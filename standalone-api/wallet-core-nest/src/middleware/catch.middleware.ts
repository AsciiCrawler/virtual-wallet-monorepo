import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';
import { standarResponse } from 'src/helpers/standar-response';
import { CustomZodException } from 'src/helpers/zod.pipe';

const mongoErrorMap = {
  // General errors
  'UnexpectedMongoError': 'An unexpected database error occurred',

  // Duplicate key errors
  '11000': 'A record with this value already exists',
  '11001': 'Duplicate key error - the document already exists',

  // Validation errors
  '121': 'Document validation failed',

  // Timeout errors
  '50': 'Operation exceeded time limit',

  // Network/connection errors
  '6': 'Host not found in DNS lookup',
  '7': 'Failed to connect to server',
  '89': 'Network timeout occurred',

  // Authentication errors
  '18': 'Authentication failed',
  '391': 'Invalid authentication mechanism',

  // Query errors
  '2': 'Bad value in query',
  '9': 'Failed to parse query',
  '13': 'Unauthorized query attempt',
  '27': 'Index not found for query',

  // Write errors
  '20': 'Invalid data for insert/update',
  '43': 'Cannot modify immutable field',
  '66': 'Immutable field modified',

  // Sharding errors
  '70': 'Operation not supported in sharded cluster',
  '72': 'Inconsistent shard configuration',

  // Transaction errors
  '251': 'Transaction aborted',
  '256': 'Transaction committed',
  '263': 'Transaction timed out',

  // Resource errors
  '125': 'Insufficient disk space',
  '168': 'Too many open files',
  '291': 'No primary available',

  // Configuration errors
  '76': 'Invalid configuration',
  '93': 'Invalid options',

  // Stale errors
  '133': 'Stale shard version',
  '134': 'Stale epoch',
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code: number | string = '0';
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
    } else if (exception instanceof mongoose.mongo.MongoError) {
      const defaultMessage = 'An unexpected database error occurred';
      code = exception.code ?? 'UnexpectedMongoError';
      message = mongoErrorMap[code] ?? defaultMessage;
    } else if (exception instanceof Error) {
      message = exception.message;
      code = status;
    }

    response.status(status).json(standarResponse(data, false, code, message));
  }
}
