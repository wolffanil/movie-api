import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as morgan from 'morgan';
import helmet from 'helmet';
import * as ExpressMongoSanitize from 'express-mongo-sanitize';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // if (process.env.NODE_ENV === 'development') {
  //   app.use(morgan('dev'));
  // }

  app.use(helmet());
  app.use(ExpressMongoSanitize());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
