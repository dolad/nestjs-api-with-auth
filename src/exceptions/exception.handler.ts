import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger = new Logger('error');
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(exception);
    const errorResponse = exception.getResponse() as any;
    const responseBody = {
      statusCode: httpStatus,
      status: false,
      data: null,
      message: errorResponse.message || errorResponse,
     
    };
    
    this.logger.error(exception.message, exception.stack, responseBody, );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
