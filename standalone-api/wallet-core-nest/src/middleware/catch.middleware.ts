import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { standarResponse } from 'src/helpers/standar-response';
import { CustomZodException } from 'src/helpers/zod.pipe';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 0;
    let data: any = null;

    if (exception instanceof CustomZodException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = (exceptionResponse as any).message || exception.message;
      code = (exceptionResponse as any).code || status;
      data = { errors: exception.getErrors() };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        code = (exceptionResponse as any).code || status;
      } else {
        message = exceptionResponse as string;
        code = status;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      code = status;
    }

    response.status(status).json(standarResponse(data, false, code, message));
  }
}
