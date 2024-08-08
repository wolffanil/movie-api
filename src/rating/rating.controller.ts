import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation';
import { Types } from 'mongoose';
import { User } from '../user/decorators/user.decorator';
import { RatingService } from './rating.service';
import { SetRatingDto } from './dto/set-rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly RatingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  async getMovieValueByUser(
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User('_id') id: Types.ObjectId,
  ) {
    return await this.RatingService.getMovieValueByUser(movieId, id);
  }

  @Post('set-rating')
  @HttpCode(200)
  @Auth()
  async setRating(@User('_id') id: Types.ObjectId, @Body() dto: SetRatingDto) {
    return await this.RatingService.setRating(id, dto);
  }
}
