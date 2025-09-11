import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaErrorFilter } from './common/filters/prisma.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Register global exception filters for HTTP and Prisma errors.
  app.use(cookieParser());
  app.useGlobalFilters(new PrismaErrorFilter(), new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
