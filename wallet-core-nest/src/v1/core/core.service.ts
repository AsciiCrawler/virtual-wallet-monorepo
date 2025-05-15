import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ProcessPaymentDto,
  CreatePaymentDto,
  CreateUserDto,
  DepositDto,
  WalletBalanceDto,
  SuccessResponse,
  BalanceResponse,
  CreatePaymentResponse,
} from './core.zod';
import { UserRepository } from 'src/repository/user.repository';
import { EventRepository } from 'src/repository/event.repository';
import moment from 'moment';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CoreService {
  constructor(
    private userRepository: UserRepository,
    private eventRepository: EventRepository,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<SuccessResponse> {
    await this.userRepository.createUser(createUserDto);
    return { success: true };
  }

  async deposit(depositDto: DepositDto): Promise<SuccessResponse> {
    const session = await this.connection.startSession();
    return await session
      .withTransaction(async () => {
        await this.eventRepository.createDepositEvent(depositDto.document, depositDto.amount, session);
        await this.userRepository.incrementBalance(depositDto.document, depositDto.amount, session);
        return { success: true };
      })
      .finally(() => {
        session.endSession();
      });
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<CreatePaymentResponse> {
    const { id, code } = await this.eventRepository.createPaymentEvent(
      createPaymentDto.document,
      createPaymentDto.amount,
    );
    return { success: true, DEBUG_SESSION_ID: id, DEBUG_CONFIRMATION_CODE: code };
  }

  async processPayment(processPaymentDto: ProcessPaymentDto): Promise<SuccessResponse> {
    const { sessionId, code } = processPaymentDto;

    const payment = await this.eventRepository.findEventById(sessionId);
    if (!payment) throw new BadRequestException('Invalid session ID');
    if (payment.processed) throw new BadRequestException('Payment already processed');
    if (payment.code !== code) throw new BadRequestException('Invalid verification code');
    if (moment().isAfter(payment.expiresAt)) throw new BadRequestException('Payment session has expired');

    const userBalance = await this.userRepository.getBalance(payment.document);
    if (payment.amount > userBalance) throw new BadRequestException('Insufficient funds for this payment');

    const session = await this.connection.startSession();
    return await session
      .withTransaction(async () => {
        await this.eventRepository.updateEventStatus(payment.id, true, session);
        await this.userRepository.reduceBalance(payment.document, payment.amount, session);
        return { success: true };
      })
      .finally(() => {
        session.endSession();
      });
  }

  async walletBalance(walletBalanceDto: WalletBalanceDto): Promise<BalanceResponse> {
    const { document, phone } = walletBalanceDto;

    const user = await this.userRepository.getUserByDocument(document);
    if (user.phone !== phone) throw new BadRequestException('Invalid phone number');

    return { balance: user.balance };
  }

  async getAllUserEvents(walletBalanceDto: WalletBalanceDto) {
    const { document, phone } = walletBalanceDto;

    const user = await this.userRepository.getUserByDocument(document);
    if (user.phone !== phone) throw new BadRequestException('Invalid phone number');

    return (await this.eventRepository.getAllEventsByDocument(document))
      .filter((value) => value.processed === true)
      .map((value) => {
        return {
          _id: value.id,
          amount: value.amount,
          createdAt: value.createdAt,
          type: value.type,
        };
      });
  }
}
