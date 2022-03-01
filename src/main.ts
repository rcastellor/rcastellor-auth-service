import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('RCASTELLOR AUTH SERVICE')
    .addCookieAuth('TE-refresh-token')
    .setDescription('Another authentication service')
    .setVersion('0.1')
    .addTag('authentication')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({ origin: 'http://localhost:4200', credentials: true, });
  await app.listen(3000);
}
bootstrap();
