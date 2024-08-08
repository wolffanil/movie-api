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
import { GenreService } from './genre.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdValidationPipe } from '../pipes/id.validation';
import { CreateGenreDto } from './dto/create-genre.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly GenreService: GenreService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return await this.GenreService.bySlug(slug);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return await this.GenreService.getAll(searchTerm);
  }

  @Get('collections')
  async getCollection() {
    return await this.GenreService.getCollection();
  }

  @Get(':id')
  @Auth('admin')
  async byId(@Param('id', IdValidationPipe) id: string) {
    return await this.GenreService.byId(id);
  }

  @Post()
  @Auth('admin')
  async create() {
    return await this.GenreService.create();
  }

  @Put(':id')
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateGenreDto,
  ) {
    return await this.GenreService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return await this.GenreService.delete(id);
  }
}
