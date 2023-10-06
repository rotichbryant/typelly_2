import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app          = await NestFactory.create(AppModule,{ cors: true,  snapshot: true, });
  const { APP_PORT } = process.env;
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  await app.listen(APP_PORT);
}
bootstrap();

