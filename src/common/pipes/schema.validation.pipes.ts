import {
  PipeTransform,
  BadRequestException,
  Logger,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      // Only validate request body; pass through params/queries/etc.
      if (metadata.type !== 'body') return value;
      Logger.debug({ type: typeof value, value }, 'ZodValidationPipe');

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
