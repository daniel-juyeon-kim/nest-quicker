import { TestBed } from '@automock/jest';
import { ArgumentsHost, Logger } from '@nestjs/common';
import { CoreToken, LoggerToken } from '@src/core/constant';
import {
  ErrorMessageBot,
  SmsApiException,
  TmapApiException,
} from '@src/core/module';
import { mock } from 'jest-mock-extended';
import { TmapApiExceptionFilter } from './tmap-api-exception.filter';

const date = new Date(2000, 1, 1);
jest.useFakeTimers({ now: date });

describe('TmapApiExceptionFilter', () => {
  let filter: TmapApiExceptionFilter;
  let logger: jest.Mocked<Logger>;
  let errorMessageBot: jest.Mocked<ErrorMessageBot>;

  const mockHost = mock<ArgumentsHost>();

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(TmapApiExceptionFilter).compile();

    filter = unit;
    logger = unitRef.get(LoggerToken.TMAP_API_EXCEPTION_LOGGER);
    errorMessageBot = unitRef.get(CoreToken.ERROR_MESSAGE_BOT);
  });

  describe('catch', () => {
    test('통과하는 테스트', async () => {
      const exception = new TmapApiException('에러');

      await filter.catch(exception, mockHost);

      expect(errorMessageBot.sendMessage).toHaveBeenCalledWith({
        date,
        exception,
      });
      expect(logger.log).toHaveBeenCalledWith(exception);
    });

    test('실패하는 테스트, 해당 헨들러가 담당하지 않는 에러', async () => {
      const exception = new SmsApiException('에러');

      await filter.catch(exception, mockHost);

      expect(errorMessageBot.sendMessage).not.toHaveBeenCalled();
      expect(logger.log).not.toHaveBeenCalled();
    });
  });
});
