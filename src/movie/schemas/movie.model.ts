import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Genre } from '../../genre/schemas/genre.model';
import { Actor } from '../../actor/schemas/actor.model';

export class Parameters {
  @Prop()
  year: number;

  @Prop()
  duration: number;

  @Prop()
  country: string;
}

@Schema({
  timestamps: true,
})
export class Movie extends Document {
  @Prop()
  title: string;

  @Prop({ unique: [true, 'slug is already exist'] })
  slug: string;

  @Prop()
  parameters?: Parameters;

  @Prop()
  poster: string;

  @Prop()
  bigPoster: string;

  @Prop()
  videoUrl: string;

  @Prop({ default: 0 })
  countOpened?: number;

  @Prop({ default: 4.0 })
  rating: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Genre.name }])
  genres: Genre[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Actor.name }])
  actors: Actor[];

  @Prop({ default: false })
  isSendTelegram?: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
