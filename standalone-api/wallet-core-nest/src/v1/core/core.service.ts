import { Injectable } from '@nestjs/common';
import {
  ProcessPaymentDto,
  CreatePaymentDto,
  CreateUserDto,
  DepositDto,
  WalletBalanceDto,
} from './core.zod';
import { UserRepository } from 'src/repository/user.repository';
import { PaymentRepository } from 'src/repository/payment.repository';
import moment from 'moment';

@Injectable()
export class CoreService {
  constructor(
    private userRepository: UserRepository,
    private paymentRepository: PaymentRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const createUserResult =
      await this.userRepository.createUser(createUserDto);

    return createUserResult;
  }

  async deposit(depositDto: DepositDto): Promise<{ newBalance: number }> {
    const depositFundsResult = await this.userRepository.depositFunds(
      depositDto.document,
      depositDto.amount,
    );

    return { newBalance: depositFundsResult.newBalance };
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    const createPaymentResult = await this.paymentRepository.createPayment(
      createPaymentDto.document,
      createPaymentDto.amount,
    );
    return createPaymentResult;
  }

  // TODO : Transaction Support - Refactor
  async processPayment(processPaymentDto: ProcessPaymentDto): Promise<any> {
    const findByIdResult = await this.paymentRepository.findById(
      processPaymentDto.sessionId,
    );

    if (!findByIdResult) throw new Error('Payment - null');

    if (findByIdResult.processed) throw new Error('Payment already processed');

    if (findByIdResult.code !== processPaymentDto.code)
      throw new Error('No valid code');

    if (moment().isAfter(findByIdResult.expiresAt))
      throw new Error('Expired payment');

    const balance = await this.userRepository.getBalance(
      findByIdResult.document,
    );

    if (findByIdResult.amount > balance)
      throw new Error('Payment is greater than user balance');

    const updatePaymentStatusResult =
      await this.paymentRepository.updatePaymentStatus(findByIdResult.id, true);

    const reduceBalanceResult = await this.userRepository.reduceBalance(
      findByIdResult.document,
      findByIdResult.amount,
    );

    return { newBalance: reduceBalanceResult.newBalance };
  }

  async walletBalance(walletBalanceDto: WalletBalanceDto): Promise<any> {
    const getUserByDocumentResult = await this.userRepository.getUserByDocument(
      walletBalanceDto.document,
    );

    if (!getUserByDocumentResult) throw new Error('User - null');

    if (getUserByDocumentResult.phone !== walletBalanceDto.phone)
      throw new Error('No valid phone');

    return getUserByDocumentResult;
  }
}
