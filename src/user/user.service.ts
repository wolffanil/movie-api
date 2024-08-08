import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.model';
import { Model, ObjectId } from 'mongoose';
import { UpdateUserDto } from './dto/updateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async byId(_id: string) {
    const user = await this.UserModel.findById(_id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.byId(_id);
    const isSameUser = await this.UserModel.findOne({ email: dto.email });

    if (isSameUser && String(_id) !== String(isSameUser._id))
      throw new BadRequestException('Email busy');

    if (dto.password) user.password = dto.password;

    user.email = dto.email;
    if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin;

    await user.save();
    return;
  }

  async getCount() {
    return await this.UserModel.find().countDocuments();
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.UserModel.find(options)
      .select('email _id isAdmin')
      .sort({ craetedAt: 'desc' })
      .lean();
  }

  async delete(id: string) {
    await this.UserModel.findByIdAndDelete(id);

    return true;
  }

  async toggleFavorite(movieId: ObjectId, user: UserDocument) {
    const { _id, favorites } = user;

    await this.UserModel.findByIdAndUpdate(_id, {
      favorites: favorites.includes(movieId)
        ? favorites.filter((id) => String(id) !== String(movieId))
        : [...favorites, movieId],
    });

    return true;
  }

  async getFavoriteMovies(_id: ObjectId) {
    return await this.UserModel.findById(_id, 'favorites')
      .populate({
        path: 'favorites',
        populate: {
          path: 'genres',
        },
      })
      .then((data) => data.favorites);
  }
}
