// src/types/core.types.ts
export type SuccessResponse = {
  success: boolean;
};

export type EventDTO = {
  _id: string;
  amount: number;
  createdAt: string;
  type: string;
}

export type BalanceResponse = {
  balance: number;
};

export type CreatePaymentResponse = SuccessResponse & {
  DEBUG_SESSION_ID: string;
  DEBUG_CONFIRMATION_CODE: string;
};

export type CreateUserDto = {
  document: string;
  name: string;
  email: string;
  phone: string;
};

export type DepositDto = {
  document: string;
  phone: string;
  amount: number;
};

export type CreatePaymentDto = {
  document: string;
  phone: string;
  amount: number;
};

export type ProcessPaymentDto = {
  sessionId: string;
  code: string;
};

export type WalletBalanceDto = {
  document: string;
  phone: string;
};
