import { Injectable } from '@nestjs/common';
import { ProcessPaymentDto, CreatePaymentDto, CreateUserDto, DepositDto, WalletBalanceDto } from './core.zod';

@Injectable()
export class CoreService {
    createUser(createUserDto: CreateUserDto): CreateUserDto {
        return createUserDto;
    }

    deposit(depositDto: DepositDto): DepositDto {
        return depositDto;
    }

    createPayment(createPaymentDto: CreatePaymentDto): CreatePaymentDto {
        return createPaymentDto;
    }

    confirmPayment(confirmPayment: ProcessPaymentDto): ProcessPaymentDto {
        return confirmPayment;
    }

    walletBalance(walletBalanceDto: WalletBalanceDto): WalletBalanceDto {
        return walletBalanceDto;
    }
}
