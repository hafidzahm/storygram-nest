import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

const errorMap: Record<
  string,
  { statusCode: number; message: string } | undefined
> = {
  P2O0O: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid data provided',
  }, //400 BAD REQUEST
  P2002: {
    statusCode: HttpStatus.CONFLICT,
    message: 'Resource already exists',
  }, // 409 CONFLICT
  P2005: { statusCode: HttpStatus.NOT_FOUND, message: 'Resource not found' }, // 400 NOT FOUND
};

@Catch()
export class PrismaErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const { code } = exception;
      statusCode = errorMap[code]?.statusCode as HttpStatus;
      message = errorMap[code]?.message as string;
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      Logger.error(exception, 'UNPROCESSABLE_ENTITY');
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      message = 'Validation error';
    }

    response.status(statusCode).json({
      message,
      statusCode,
    });
  }
}
