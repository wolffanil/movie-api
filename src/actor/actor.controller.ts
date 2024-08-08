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
import { ActorService } from './actor.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdValidationPipe } from '../pipes/id.validation';
import { ActorDto } from './actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly ActorService: ActorService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return await this.ActorService.bySlug(slug);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return await this.ActorService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async byId(@Param('id', IdValidationPipe) id: string) {
    return await this.ActorService.byId(id);
  }

  @Post()
  @Auth('admin')
  async create() {
    return await this.ActorService.create();
  }

  @Put(':id')
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ActorDto,
  ) {
    return await this.ActorService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return await this.ActorService.delete(id);
  }
}
