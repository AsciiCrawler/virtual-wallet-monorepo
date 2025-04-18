import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CoreService } from './core.service';
import { ZodPipe } from 'src/helpers/zod.pipe';
import {
  ProcessPaymentDto,
  ProcessPaymentSchema,
  CreatePaymentDto,
  CreatePaymentSchema,
  CreateUserDto,
  CreateUserSchema,
  DepositDto,
  DepositSchema,
  WalletBalanceDto,
  WalletBalanceSchema,
} from './core.zod';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { zodToOpenAPI } from 'src/helpers/zod-to-openapi';
import { standarResponse, standarResponseType } from 'src/helpers/standar-response';

@Controller('v1')
export class CoreController {
  constructor(private coreService: CoreService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @HttpCode(HttpStatus.CREATED)
  @Post('create-user')
  @ApiBody({ schema: zodToOpenAPI(CreateUserSchema) })
  async createUser(@Body(new ZodPipe(CreateUserSchema)) creteUserDto: CreateUserDto): Promise<standarResponseType> {
    return standarResponse(await this.coreService.createUser(creteUserDto));
  }

  @ApiOperation({ summary: 'Deposit funds' })
  @HttpCode(HttpStatus.OK)
  @Post('deposit')
  @ApiBody({ schema: zodToOpenAPI(DepositSchema) })
  async deposit(@Body(new ZodPipe(DepositSchema)) depositDto: DepositDto): Promise<standarResponseType> {
    return standarResponse(await this.coreService.deposit(depositDto));
  }

  @ApiOperation({ summary: 'Create payment' })
  @HttpCode(HttpStatus.CREATED)
  @Post('create-payment')
  @ApiBody({ schema: zodToOpenAPI(CreatePaymentSchema) })
  async createPayment(
    @Body(new ZodPipe(CreatePaymentSchema)) createPaymentDto: CreatePaymentDto,
  ): Promise<standarResponseType> {
    return standarResponse(await this.coreService.createPayment(createPaymentDto));
  }

  @ApiOperation({ summary: 'Process payment' })
  @HttpCode(HttpStatus.OK)
  @Post('process-payment')
  @ApiBody({ schema: zodToOpenAPI(ProcessPaymentSchema) })
  async processPayment(
    @Body(new ZodPipe(ProcessPaymentSchema))
    processPaymentDto: ProcessPaymentDto,
  ): Promise<standarResponseType> {
    return standarResponse(await this.coreService.processPayment(processPaymentDto));
  }

  @ApiOperation({ summary: 'Get wallet balance' })
  @HttpCode(HttpStatus.OK)
  @Post('wallet-balance')
  @ApiBody({ schema: zodToOpenAPI(WalletBalanceSchema) })
  async walletBalance(
    @Body(new ZodPipe(WalletBalanceSchema)) walletBalanceDto: WalletBalanceDto,
  ): Promise<standarResponseType> {
    return standarResponse(await this.coreService.walletBalance(walletBalanceDto));
  }
}
