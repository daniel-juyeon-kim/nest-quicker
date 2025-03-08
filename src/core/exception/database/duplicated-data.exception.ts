import { HttpStatus } from '@nestjs/common';
import { DataBaseExceptionMessage } from '@src/core/constant/exception-message/database.enum';
import { DataBaseException } from './database.exception';

export class DuplicatedDataException extends DataBaseException {
  private static readonly statusCode: HttpStatus = HttpStatus.CONFLICT;

  constructor(
    value: string | number | Date | Record<string, any>,
    message: string = DataBaseExceptionMessage.DuplicatedDataException,
  ) {
    super(value, message, DuplicatedDataException.statusCode);
  }
}
