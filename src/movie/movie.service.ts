import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.model';
import { Model, ObjectId, Types } from 'mongoose';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly MovieModel: Model<Movie>,
  ) {}

  async byId(_id: string) {
    const movie = await this.MovieModel.findById(_id);
    if (!movie) throw new NotFoundException('Movie not found');

    return movie;
  }

  async bySlug(slug: string) {
    const movie = await this.MovieModel.findOne({ slug })
      .populate('genres actors')
      .lean();

    if (!movie) throw new NotFoundException('Movie not found');

    return movie;
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.MovieModel.find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('actors genres')
      .lean();
  }

  async byActor(actorId: ObjectId) {
    const movies = await this.MovieModel.find({ actors: actorId });
    if (!movies) throw new NotFoundException('Movies not found');

    return movies;
  }

  async byGenres(genreIds: string[]) {
    const movies = await this.MovieModel.find({
      genres: { $in: genreIds },
    }).lean();

    if (!movies?.length) throw new NotFoundException('Movies not found');
    return movies;
  }

  async updateCountOpened(slug: string) {
    const movie = await this.MovieModel.findOneAndUpdate(
      { slug },
      {
        $inc: { countOpened: 1 },
      },
      { new: true },
    );

    if (!movie) throw new NotFoundException('Movie not found');

    return movie;
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return await this.MovieModel.findByIdAndUpdate(
      id,
      {
        rating: newRating,
      },
      {
        new: true,
      },
    );
  }

  async getMostPopular() {
    return await this.MovieModel.find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres')
      .lean();
  }

  async update(_id: string, dto: UpdateMovieDto) {
    const movie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    });

    if (!movie) throw new NotFoundException('Movie not found');

    return movie;
  }

  async create() {
    const defaultValue: UpdateMovieDto = {
      title: '',
      slug: '',
      poster: '',
      bigPoster: '',
      videoUrl: '',
      genres: [],
      actors: [],
    };

    const movie = await this.MovieModel.create(defaultValue);

    return movie._id;
  }

  async delete(_id: string) {
    const movie = await this.MovieModel.findByIdAndDelete(_id);

    if (!movie) throw new NotFoundException('Movie not found');

    return true;
  }
}
