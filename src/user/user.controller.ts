import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUserDto';
import { IdValidationPipe } from 'src/pipes/id.validation';
import { ObjectId } from 'mongoose';
import { UserDocument } from './schemas/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: string) {
    return this.UserService.byId(_id);
  }

  @Get('count')
  @Auth('admin')
  async getCount() {
    return await this.UserService.getCount();
  }

  @Get()
  @Auth()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return await this.UserService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', IdValidationPipe) id: string) {
    return await this.UserService.byId(id);
  }

  @Get('profile/favorites')
  @Auth()
  async getFavorites(@User('_id') id: ObjectId) {
    return await this.UserService.getFavoriteMovies(id);
  }

  @Put('profile/favorites')
  @HttpCode(200)
  @Auth()
  async toggleFavorite(
    @Body('movieId', IdValidationPipe) movieId: ObjectId,
    @User() user: UserDocument,
  ) {
    return await this.UserService.toggleFavorite(movieId, user);
  }

  @Put('profile')
  @HttpCode(200)
  @Auth()
  async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return await this.UserService.updateProfile(_id, dto);
  }

  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) _id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return await this.UserService.updateProfile(_id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Auth('admin')
  async deleteUser(@Param('id', IdValidationPipe) id: string) {
    return await this.UserService.delete(id);
  }
}
