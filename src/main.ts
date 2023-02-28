import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { loggerMiddleware } from './middleware';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  app.use(loggerMiddleware);

  app.setGlobalPrefix('api/v1', { exclude: ['/'] });

  setupSwagger(app);
  app.enableCors();

  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.get<number>('app.port');

  await app.listen(port, () => {
    logger.log(`Application listening on port ${port}`);
  });
}
bootstrap();
