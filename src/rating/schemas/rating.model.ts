import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Movie } from '../../movie/schemas/movie.model';
import { User } from '../../user/schemas/user.model';

@Schema({
  timestamps: true,
})
export class Rating extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Movie.name,
    required: true,
  })
  movieId: Movie;

  @Prop()
  value: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
