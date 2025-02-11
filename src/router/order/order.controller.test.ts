import { Test, TestingModule } from '@nestjs/testing';
import { ServiceToken } from '@src/core/constant';
import { UnknownDataBaseError } from '@src/core/module';
import { NotExistDataError, OrderEntity } from '@src/database';
import { mock, mockClear } from 'jest-mock-extended';
import { describe } from 'node:test';
import { DeepPartial } from 'typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { IOrderService } from './order.service.interface';

describe('OrderController', () => {
  let controller: OrderController;
  const service = mock<IOrderService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: ServiceToken.ORDER_SERVICE, useValue: service }],
    }).compile();

    controller = module.get(OrderController);

    mockClear(service);
  });

  describe('createOrder()', () => {
    const dto: Parameters<OrderService['createOrder']>[0] = {
      walletAddress: '0x123456789abcdef',
      detail: 'Fragile, handle with care',
      transportation: {
        bicycle: 1,
        truck: 1,
      },
      product: {
        width: 20,
        length: 30,
        height: 40,
        weight: 10,
      },
      destination: {
        x: 37.7749,
        y: -122.4194,
      },
      departure: {
        x: 34.0522,
        y: -118.2437,
      },
      sender: {
        name: 'John Doe',
        phone: '123-456-7890',
      },
      receiver: {
        name: 'Jane Smith',
        phone: '987-654-3210',
      },
    };

    test('통과하는 테스트', async () => {
      await expect(controller.create(dto)).resolves.toEqual(undefined);

      expect(service.createOrder).toHaveBeenCalledWith(dto);
    });

    test('실패하는 테스트, 알 수 없는 DB 에러 헨들링', async () => {
      const error = new UnknownDataBaseError('알 수 없는 DB 에러');
      service.createOrder.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toStrictEqual(error);

      expect(service.createOrder).toHaveBeenCalledWith(dto);
    });

    test('실패하는 테스트, 존재하지 않는 데이터 에러', async () => {
      const error = new NotExistDataError('존재하지 않는 데이터');
      service.createOrder.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toStrictEqual(error);

      expect(service.createOrder).toHaveBeenCalledWith(dto);
    });
  });

  describe('getMatchableOrdersByWalletAddress()', () => {
    test('통과하는 테스트', async () => {
      const walletAddress = '배송원 지갑주소';
      const resolveValue: DeepPartial<OrderEntity[]> = [
        {
          id: 1,
          departure: { detail: '디테일', x: 0, y: 0 },
          destination: { detail: '디테일', x: 37.5, y: 112 },
          detail: '디테일',
          product: { height: 0, length: 0, weight: 0, width: 0 },
          transportation: {
            bicycle: 0,
            bike: 0,
            car: 0,
            scooter: 0,
            truck: 0,
            walking: 0,
          },
        },
      ];
      service.findAllMatchableOrder.mockResolvedValueOnce(resolveValue);

      await expect(
        controller.findAllMatchableOrder(walletAddress),
      ).resolves.toEqual(resolveValue);

      expect(service.findAllMatchableOrder).toHaveBeenCalledWith(walletAddress);
    });

    test('실패하는 테스트, next 호출', async () => {
      const walletAddress = '배송원 지갑주소';
      const error = new NotExistDataError('회원이 존재하지 않습니다.');
      service.findAllMatchableOrder.mockRejectedValueOnce(error);

      await expect(
        controller.findAllMatchableOrder(walletAddress),
      ).rejects.toStrictEqual(error);

      expect(service.findAllMatchableOrder).toHaveBeenCalledWith(walletAddress);
    });
  });

  describe('getOrdersDetail()', () => {
    test('통과하는 테스트', async () => {
      const orderIds = [1, 2, 3, 4];
      const resolveValue: DeepPartial<OrderEntity[]> = [
        {
          departure: {
            detail: '디테일',
            sender: {
              name: '이름',
              phone: '01012345678',
            },
            x: 0,
            y: 0,
          },
          destination: {
            detail: '디테일',
            receiver: {
              name: '이름',
              phone: '01012345678',
            },
            x: 37.5,
            y: 112,
          },
          detail: '디테일',
          id: 2,
          product: {
            height: 0,
            length: 0,
            weight: 0,
            width: 0,
          },
        },
        {
          departure: {
            detail: '디테일',
            sender: {
              name: '이름',
              phone: '01012345678',
            },
            x: 0,
            y: 0,
          },
          destination: {
            detail: '디테일',
            receiver: {
              name: '이름',
              phone: '01012345678',
            },
            x: 37.5,
            y: 112,
          },
          detail: '디테일',
          id: 3,
          product: {
            height: 0,
            length: 0,
            weight: 0,
            width: 0,
          },
        },
      ];
      service.findAllOrderDetail.mockResolvedValueOnce(resolveValue);

      await expect(
        controller.findAllOrderDetail(orderIds),
      ).resolves.toStrictEqual(resolveValue);

      expect(service.findAllOrderDetail).toHaveBeenCalledWith(orderIds);
    });

    describe('실패하는 테스트', () => {
      test('예상하지 못한 에러 발생', async () => {
        const orderIds = [1, 2, 3, 4];
        const error = new UnknownDataBaseError('알 수 없는 에러');
        service.findAllOrderDetail.mockRejectedValueOnce(error);

        await expect(
          controller.findAllOrderDetail(orderIds),
        ).rejects.toStrictEqual(error);

        expect(service.findAllOrderDetail).toHaveBeenCalledWith(orderIds);
      });
    });
  });
});
