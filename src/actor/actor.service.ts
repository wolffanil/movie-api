import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Actor } from './schemas/actor.model';
import { Model } from 'mongoose';
import { ActorDto } from './actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(Actor.name) private readonly ActorModel: Model<Actor>,
  ) {}

  async byId(_id: string) {
    const actor = await this.ActorModel.findById(_id);
    if (!actor) throw new NotFoundException('Actor not found');

    return actor;
  }

  async bySlug(slug: string) {
    const actor = await this.ActorModel.findOne({ slug }).lean();

    if (!actor) throw new NotFoundException('Actor not found');

    return actor;
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

    return this.ActorModel.aggregate()
      .match(options)
      .lookup({
        from: 'movies',
        foreignField: 'actors',
        localField: '_id',
        as: 'movies',
      })
      .addFields({
        countMovies: {
          $size: '$movies',
        },
      })
      .project({ __v: 0, updatedAt: 0, movies: 0 })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async update(_id: string, dto: ActorDto) {
    const actor = await this.ActorModel.findByIdAndUpdate(_id, dto, {
      new: true,
    });

    if (!actor) throw new NotFoundException('Actor not found');

    return actor;
  }

  async create() {
    const defaultValue: ActorDto = {
      name: '',
      slug: '',
      photo: '',
    };

    const actor = await this.ActorModel.create(defaultValue);

    return actor._id;
  }

  async delete(_id: string) {
    const actor = await this.ActorModel.findByIdAndDelete(_id);

    if (!actor) throw new NotFoundException('Actor not found');

    return true;
  }
}
