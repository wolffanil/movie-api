import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

export class IdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') return value;

    if (!mongoose.isValidObjectId(value))
      throw new BadRequestException('Ivalid format id');

    return value;
  }
}
