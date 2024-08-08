import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.model';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly JwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const existUser = await this.UserModel.findOne({ email: dto.email });

    if (existUser)
      throw new BadRequestException(
        'User with this email is already in the system',
      );

    const newUser = await this.UserModel.create(dto);

    const tokens = await this.issueTokenPair(String(newUser._id));

    return {
      user: this.returnUserFields(newUser),
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto): Promise<User> {
    const user = await this.UserModel.findOne({ email: dto.email }).select(
      '+password',
    );

    if (!user || !(await user.comparePassword(dto.password))) {
      throw new UnauthorizedException('email or password incorrent');
    }

    return user;
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in!');

    const result = await this.JwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid token or expired!');

    const user = await this.UserModel.findById(result._id);

    const tokens = await this.issueTokenPair(String(user._id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async issueTokenPair(
    userId: string,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const data = { _id: userId };

    const refreshToken = await this.JwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.JwtService.signAsync(data, {
      expiresIn: '1h',
    });

    return { refreshToken, accessToken };
  }

  returnUserFields(user: User) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
}
