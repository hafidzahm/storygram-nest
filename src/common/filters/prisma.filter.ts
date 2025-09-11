import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
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
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const { code } = exception;
    const { statusCode, message } = errorMap[code] ?? {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };

    response.status(statusCode).json({
      message,
      statusCode,
    });
  }
}
