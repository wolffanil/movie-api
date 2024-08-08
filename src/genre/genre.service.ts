import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from './schemas/genre.model';
import { Model } from 'mongoose';
import { CreateGenreDto } from './dto/create-genre.dto';
import { MovieService } from '../movie/movie.service';
import { ICollection } from './genre.interface';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly GenreModel: Model<Genre>,
    private readonly MovieService: MovieService,
  ) {}

  async byId(_id: string) {
    const genre = await this.GenreModel.findById(_id);
    if (!genre) throw new NotFoundException('Genre not found');

    return genre;
  }

  async bySlug(slug: string) {
    const genre = await this.GenreModel.findOne({ slug }).lean();

    if (!genre) throw new NotFoundException('Genre not found');

    return genre;
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
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.GenreModel.find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .lean();
  }

  async getCollection() {
    const genres = await this.getAll();
    const collections = await Promise.all(
      genres.map(async (genre) => {
        const moviesByGenre = await this.MovieService.byGenres([
          String(genre._id),
        ]);

        const result: ICollection = {
          _id: String(genre._id),
          image: moviesByGenre[0].bigPoster,
          slug: genre.slug,
          title: genre.name,
        };

        return result;
      }),
    );

    return collections;
  }

  async update(_id: string, dto: CreateGenreDto) {
    const genre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    });

    if (!genre) throw new NotFoundException('Genre not found');

    return genre;
  }

  async create() {
    const defaultValue: CreateGenreDto = {
      description: '',
      name: '',
      slug: '',
      icon: '',
    };

    const genre = await this.GenreModel.create(defaultValue);

    return genre._id;
  }

  async delete(_id: string) {
    const genre = await this.GenreModel.findByIdAndDelete(_id);

    if (!genre) throw new NotFoundException('Genre not found');

    return true;
  }
}
