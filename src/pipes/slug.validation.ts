import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class slugValidation implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') return value;

    if (value?.length < 2) {
      throw new BadRequestException('slug must be');
    }

    return value;
  }
}
