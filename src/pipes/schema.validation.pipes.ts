import { PipeTransform, BadRequestException, Logger } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      Logger.debug(parsedValue, 'parsedValue');
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        Logger.debug(error.issues[0].message, 'errorParsedValueZod');
        throw new BadRequestException(error.issues[0].message);
      } else {
        Logger.debug(error, 'errorParsedValue');
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
