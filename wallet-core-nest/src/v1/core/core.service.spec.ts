import { UserModel, UserRepository } from 'src/repository/user.repository';
import { CoreService } from './core.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EventModel, EventRepository } from 'src/repository/event.repository';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { CreatePaymentDto, CreateUserDto, DepositDto, ProcessPaymentDto, WalletBalanceDto } from './core.zod';
import moment from 'moment';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('UserService', () => {
  let coreService: CoreService;
  let userRepository: UserRepository;
  let eventRepository: EventRepository;

  const userModel = {
    _id: '680390ffbd487766facf7174',
    document: '123456789',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    balance: 5000,
  } as UserModel;

  const paymentModel = {
    id: '680393670de42e6b1114804d',
    document: '123456789',
    amount: 1000,
    code: '2350',
    expiresAt: moment().add(15, 'minute').toDate(),
    processed: false,
  } as EventModel;

  /*  */

  const createUserDto: CreateUserDto = {
    document: userModel.document,
    email: userModel.email,
    name: userModel.name,
    phone: userModel.phone,
  };

  const depositDto: DepositDto = {
    amount: 1000,
    document: createUserDto.document,
    phone: createUserDto.phone,
  };

  const createPaymentDto: CreatePaymentDto = {
    amount: 1000,
    document: createUserDto.document,
    phone: createUserDto.phone,
  };

  const processPaymentDto: ProcessPaymentDto = {
    code: '2350',
    sessionId: '6803911546ed9975e7429796',
  };

  const walletBalanceDto: WalletBalanceDto = {
    document: createUserDto.document,
    phone: createUserDto.phone,
  };

  /*  */

  beforeEach(async () => {
    const mockConnection = {
      startSession: jest.fn().mockResolvedValue({
        withTransaction: jest.fn(async (callback) => {
          const result = await callback();
          return result; // This will return { success: true }
        }),
        endSession: jest.fn(),
        startTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        commitTransaction: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreService,
        UserRepository,
        EventRepository,
        { provide: getConnectionToken(), useValue: mockConnection },
        { provide: getModelToken(UserModel.name), useValue: UserModel },
        { provide: getModelToken(EventModel.name), useValue: EventModel },
      ],
    }).compile();
    coreService = module.get<CoreService>(CoreService);
    userRepository = module.get<UserRepository>(UserRepository);
    eventRepository = module.get<EventRepository>(EventRepository);
  });

  /*  */

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      jest.spyOn(userRepository, 'createUser').mockResolvedValueOnce(userModel);
      const result = await coreService.createUser(createUserDto);

      expect(result).toEqual({ success: true });
    });

    it('should throw InternalServerErrorException when user creation fails', async () => {
      jest.spyOn(userRepository, 'createUser').mockRejectedValue(new Error());
      await expect(coreService.createUser(createUserDto)).rejects.toThrow();
    });
  });

  describe('deposit', () => {
    it('should successfully deposit funds in account', async () => {
      jest.spyOn(eventRepository, 'createDepositEvent').mockResolvedValueOnce({} as EventModel);
      jest.spyOn(userRepository, 'incrementBalance').mockResolvedValueOnce({ newBalance: 1000 });
      const result = await coreService.deposit(depositDto);
      expect(result).toEqual({ success: true });
    });
  });

  describe('createPayment', () => {
    it('should successfully create a payment', async () => {
      const id = '680391c5fdddc5ec257e08da';
      const code = '3050';
      jest.spyOn(eventRepository, 'createPaymentEvent').mockResolvedValueOnce({ id, code } as EventModel);

      const result = await coreService.createPayment(createPaymentDto);

      expect(result).toEqual({ success: true, DEBUG_SESSION_ID: id, DEBUG_CONFIRMATION_CODE: code });
    });
  });

  describe('processPayment', () => {
    it('should successfully process a payment', async () => {
      jest.spyOn(eventRepository, 'findEventById').mockResolvedValueOnce(paymentModel);
      jest.spyOn(eventRepository, 'updateEventStatus').mockResolvedValueOnce(paymentModel);
      jest.spyOn(userRepository, 'reduceBalance').mockResolvedValueOnce({ newBalance: 0 });
      jest.spyOn(userRepository, 'getBalance').mockResolvedValueOnce(1000);

      const result = await coreService.processPayment(processPaymentDto);
      expect(result).toEqual({ success: true });
    });

    it('should return "Invalid session ID" error', async () => {
      jest.spyOn(eventRepository, 'findEventById').mockResolvedValueOnce(null);

      try {
        await coreService.processPayment(processPaymentDto);
        fail('Expected to throw but did not');
      } catch (error) {
        expect(error.message).toBe('Invalid session ID');
      }
    });

    it('should return "Payment already processed" error', async () => {
      jest
        .spyOn(eventRepository, 'findEventById')
        .mockResolvedValueOnce({ ...paymentModel, processed: true } as EventModel);

      try {
        await coreService.processPayment(processPaymentDto);
        fail('Expected to throw but did not');
      } catch (error) {
        expect(error.message).toBe('Payment already processed');
      }
    });

    it('should return "Invalid verification code" error', async () => {
      jest
        .spyOn(eventRepository, 'findEventById')
        .mockResolvedValueOnce({ ...paymentModel, processed: false, code: '000000' } as EventModel);

      try {
        await coreService.processPayment(processPaymentDto);
        fail('Expected to throw but did not');
      } catch (error) {
        expect(error.message).toBe('Invalid verification code');
      }
    });

    it('should return "Payment session has expired" error', async () => {
      jest.spyOn(eventRepository, 'findEventById').mockResolvedValueOnce({
        ...paymentModel,
        expiresAt: moment().subtract(15, 'minutes').toDate(),
      } as EventModel);

      try {
        await coreService.processPayment(processPaymentDto);
        fail('Expected to throw but did not');
      } catch (error) {
        expect(error.message).toBe('Payment session has expired');
      }
    });

    it('should return "Insufficient funds for this payment" error', async () => {
      jest.spyOn(eventRepository, 'findEventById').mockResolvedValueOnce({ ...paymentModel } as EventModel);
      jest.spyOn(userRepository, 'getBalance').mockResolvedValueOnce(0);

      try {
        await coreService.processPayment(processPaymentDto);
        fail('Expected to throw but did not');
      } catch (error) {
        expect(error.message).toBe('Insufficient funds for this payment');
      }
    });
  });

  describe('walletBalance', () => {
    it('should successfully get wallet balance', async () => {
      jest.spyOn(userRepository, 'getUserByDocument').mockResolvedValueOnce(userModel);

      const result = await coreService.walletBalance(walletBalanceDto);

      expect(userRepository.getUserByDocument).toHaveBeenCalledWith(walletBalanceDto.document);
      expect(result).toEqual({ balance: userModel.balance });
    });

    it('should return "Invalid phone number" error', async () => {
      jest.spyOn(userRepository, 'getUserByDocument').mockResolvedValueOnce(userModel);

      try {
        await coreService.walletBalance({ ...walletBalanceDto, phone: '0000000000' });
        fail('Expected to throw but did not');
      } catch (error) {
        expect(error.message).toBe('Invalid phone number');
      }
    });
  });

  describe('getAllUserEvents', () => {
    it('should successfully get user events', async () => {
      jest.spyOn(userRepository, 'getUserByDocument').mockResolvedValueOnce(userModel);
      jest.spyOn(eventRepository, 'getAllEventsByDocument').mockResolvedValueOnce([]);

      const result = await coreService.getAllUserEvents(walletBalanceDto);

      expect(userRepository.getUserByDocument).toHaveBeenCalledWith(walletBalanceDto.document);
      expect(result).toEqual([]);
    });

    it('should return "Invalid phone number" error', async () => {
      jest.spyOn(userRepository, 'getUserByDocument').mockResolvedValueOnce(userModel);
      jest.spyOn(eventRepository, 'getAllEventsByDocument').mockResolvedValueOnce([]);

      try {
        await coreService.getAllUserEvents({ ...walletBalanceDto, phone: '0000000000' });
        fail('Expected to throw but did not');
      } catch (error) {
        expect(error.message).toBe('Invalid phone number');
      }
    });
  });
});
