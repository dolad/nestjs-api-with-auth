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
    let responseBody;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if(exception != null){
      const errorResponse = exception.getResponse ? exception.getResponse() as any : { message:"Something went wrong"};
       responseBody = {
        statusCode: httpStatus,
        status: false,
        data: null,
        message: errorResponse.message || errorResponse,
      };
    }else {
      responseBody = {
        statusCode: httpStatus,
        status: false,
        data: null,
        message: "Something went wrong",
      }
    }
    
   
   
    this.logger.error(exception.message, exception.stack, responseBody, );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
