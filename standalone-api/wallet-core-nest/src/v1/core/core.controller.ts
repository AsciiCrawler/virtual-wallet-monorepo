import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
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

@Controller('v1')
export class CoreController {
  constructor(private coreService: CoreService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @HttpCode(HttpStatus.CREATED)
  @Post('create-user')
  @ApiBody({ schema: zodToOpenAPI(CreateUserSchema) })
  createUser(
    @Body(new ZodPipe(CreateUserSchema)) creteUserDto: CreateUserDto,
  ): CreateUserDto {
    return this.coreService.createUser(creteUserDto);
  }

  @ApiOperation({ summary: 'Deposit funds' })
  @HttpCode(HttpStatus.OK)
  @Post('deposit')
  @ApiBody({ schema: zodToOpenAPI(DepositSchema) })
  deposit(
    @Body(new ZodPipe(DepositSchema)) depositDto: DepositDto,
  ): DepositDto {
    return this.coreService.deposit(depositDto);
  }

  @ApiOperation({ summary: 'Create payment' })
  @HttpCode(HttpStatus.CREATED)
  @Post('create-payment')
  @ApiBody({ schema: zodToOpenAPI(CreatePaymentSchema) })
  createPayment(
    @Body(new ZodPipe(CreatePaymentSchema)) createPaymentDto: CreatePaymentDto,
  ): CreatePaymentDto {
    return this.coreService.createPayment(createPaymentDto);
  }

  @ApiOperation({ summary: 'Process payment' })
  @HttpCode(HttpStatus.OK)
  @Post('process-payment')
  @ApiBody({ schema: zodToOpenAPI(ProcessPaymentSchema) })
  confirmPayment(
    @Body(new ZodPipe(ProcessPaymentSchema))
    confirmPaymentDto: ProcessPaymentDto,
  ): ProcessPaymentDto {
    return this.coreService.confirmPayment(confirmPaymentDto);
  }

  @ApiOperation({ summary: 'Get wallet balance' })
  @HttpCode(HttpStatus.OK)
  @Post('wallet-balance')
  @ApiBody({ schema: zodToOpenAPI(WalletBalanceSchema) })
  walletBalance(
    @Body(new ZodPipe(WalletBalanceSchema)) walletBalanceDto: WalletBalanceDto,
  ): WalletBalanceDto {
    return this.coreService.walletBalance(walletBalanceDto);
  }
}
