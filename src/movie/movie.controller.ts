import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ObjectId } from 'mongoose';
import { GenreIdsDto } from './dto/genreIds.dto';
import { slugValidation } from 'src/pipes/slug.validation';

@Controller('movies')
export class MovieController {
  constructor(private readonly MovieService: MovieService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug', slugValidation) slug: string) {
    return await this.MovieService.bySlug(slug);
  }

  @Get('by-actor/:actorId')
  async byActor(@Param('actorId', IdValidationPipe) actorId: ObjectId) {
    return await this.MovieService.byActor(actorId);
  }

  @Post('by-genres')
  @HttpCode(200)
  async byGenres(@Body() { genreIds }: GenreIdsDto) {
    return await this.MovieService.byGenres(genreIds);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return await this.MovieService.getAll(searchTerm);
  }

  @Get('most-popular')
  async getMostPopular() {
    return await this.MovieService.getMostPopular();
  }

  @Get(':id')
  @Auth('admin')
  async byId(@Param('id', IdValidationPipe) id: string) {
    return await this.MovieService.byId(id);
  }

  @Put('update-count-opened')
  async updateCountOpened(@Body('slug') slug: string) {
    return await this.MovieService.updateCountOpened(slug);
  }

  @Post()
  @Auth('admin')
  async create() {
    return await this.MovieService.create();
  }

  @Put(':id')
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateMovieDto,
  ) {
    return await this.MovieService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return await this.MovieService.delete(id);
  }
}
