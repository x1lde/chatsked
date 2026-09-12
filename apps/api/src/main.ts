import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // strips any properties not defined in the DTO
      forbidNonWhitelisted: true, // rejects the request if extra properties are sent
      transform: true,        // auto-converts incoming JSON strings to numbers/booleans per DTO types
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();