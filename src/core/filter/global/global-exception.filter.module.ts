import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseExceptionFilter } from '../database-exception/database-exception.filter';
import { ExternalApiExceptionFilterModule } from '../external-api-exception/external-api-exception.filter.module';
import { UnknownExceptionFilter } from '../unknown-exception/unknown-exception.filter';
import { GlobalExceptionFilter } from './global-exception.filter';

@Module({
  imports: [ExternalApiExceptionFilterModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    DatabaseExceptionFilter,
    UnknownExceptionFilter,
  ],
})
export class GlobalExceptionFilterModule {}
