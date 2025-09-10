import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // Logger.debug(response, 'ResponseDebug');
    // Logger.debug(request, 'RequestDebug');
    // Logger.debug(status, 'StatusDebug');
    // Logger.debug(exception.getResponse(), 'statusMessage');

    const errorResponse = exception.getResponse();
    // Logger.debug(errorResponse, 'statusMessage');

    const message =
      typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as HttpException).message || exception.message;

    response.status(status).json({
      method: request.method,
      message,
      statusCode: status,
    });
  }
}
