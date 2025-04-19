import { PipeTransform, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class CustomZodException extends HttpException {
  constructor(
    message: string,
    private errors: any[],
  ) {
    super({ message, code: HttpStatus.BAD_REQUEST, errors }, HttpStatus.BAD_REQUEST);
  }

  getErrors() {
    return this.errors;
  }
}

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new CustomZodException('Schema validation error', error.errors);
    }
  }
}
