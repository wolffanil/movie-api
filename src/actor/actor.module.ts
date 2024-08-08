import { Module } from '@nestjs/common';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ActorSchema } from './schemas/actor.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Actor', schema: ActorSchema }]),
  ],
  controllers: [ActorController],
  providers: [ActorService],
})
export class ActorModule {}
