import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app          = await NestFactory.create(
    AppModule,
    // new FastifyAdapter(),
    { cors: true,  snapshot: true, },
  );
  const { APP_PORT } = process.env;
  
  // app.useStaticAssets({
  //   root: join(__dirname, '..', 'public'),
  //   prefix: '/public/',
  // });

  // app.setViewEngine({
  //   engine: {
  //     handlebars: require('handlebars'),
  //   },
  //   templates: join(__dirname, '..', 'views'),
  // });
  
  // app.setViewEngine('hbs');

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(
    bodyParser.urlencoded({limit: '50mb', extended: true})
  );
  
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');
  
  await app.listen(APP_PORT);
}
bootstrap();

