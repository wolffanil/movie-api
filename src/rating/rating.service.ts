import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rating } from './schemas/rating.model';
import { Model, Types } from 'mongoose';
import { MovieService } from '../movie/movie.service';
import { SetRatingDto } from './dto/set-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private readonly RatingModel: Model<Rating>,
    private readonly MovieService: MovieService,
  ) {}

  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return await this.RatingModel.findOne({ movieId, userId })
      .select('value')
      .then((data) => (data ? data.value : 0));
  }

  async averageRatingMovie(movieId: Types.ObjectId | string) {
    const ratingMovie: Rating[] = await this.RatingModel.aggregate().match({
      movieId: new Types.ObjectId(movieId),
    });

    return (
      ratingMovie.reduce((acc, item) => acc + item.value, 0) /
      ratingMovie.length
    );
  }

  async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
    const { movieId, value } = dto;

    const newRating = await this.RatingModel.findOneAndUpdate(
      { movieId, userId },
      { movieId, userId, value },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    const averageRating = await this.averageRatingMovie(movieId);

    await this.MovieService.updateRating(movieId, averageRating);

    return newRating;
  }
}
