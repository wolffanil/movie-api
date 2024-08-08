import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString({
    message: 'You did not pass refresh token or it is not a string!',
  })
  refreshToken: string;
}
