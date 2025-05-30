import { z } from 'zod';

export type SuccessResponse = {
  success: boolean;
};

export type BalanceResponse = {
  balance: number;
};

export type CreatePaymentResponse = SuccessResponse & {
  DEBUG_SESSION_ID: string;
  DEBUG_CONFIRMATION_CODE: string;
};

/*  */

const documentSchemaElement = z.string().regex(/^[A-Za-z0-9]{8,20}$/, {
  message: 'Document must be 8-20 alphanumeric characters',
});

const phoneSchemaElement = z
  .string()
  .min(8, 'Phone number must be at least 8 digits')
  .max(15, 'Phone number cannot exceed 15 digits')
  .regex(/^\+?\d+$/, "Phone number must start with an optional '+', followed only by digits");

const amountSchemaElement = z
  .number()
  .positive('Amount must be positive')
  .max(999_999_999, 'Amount cannot exceed 999,999,999')
  .refine((val) => Number(val.toFixed(2)) === val, 'Amount must have at most 2 decimal places');

const emailSchemaElement = z.string().email('Invalid email format').max(100, 'Email cannot exceed 100 characters');

const nameSchemaElement = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(40, 'Name cannot exceed 40 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

const sessionIdSchemaElement = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Session ID must be a valid MongoDB ObjectId');

const codeSchemaElement = z.string().regex(/^\d{6}$/, 'Confirmation code must be exactly 6 digits');

/*  */
/*  */
/*  */

export const CreateUserSchema = z
  .object({
    document: documentSchemaElement,
    name: nameSchemaElement,
    email: emailSchemaElement,
    phone: phoneSchemaElement,
  })
  .strict();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

/*  */

export const DepositSchema = z
  .object({
    document: documentSchemaElement,
    phone: phoneSchemaElement,
    amount: amountSchemaElement,
  })
  .strict();

export type DepositDto = z.infer<typeof DepositSchema>;

/*  */

export const CreatePaymentSchema = z
  .object({
    document: documentSchemaElement,
    phone: phoneSchemaElement,
    amount: amountSchemaElement,
  })
  .strict();

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;

/*  */

export const ProcessPaymentSchema = z
  .object({
    sessionId: sessionIdSchemaElement,
    code: codeSchemaElement,
  })
  .strict();

export type ProcessPaymentDto = z.infer<typeof ProcessPaymentSchema>;

/*  */

export const WalletBalanceSchema = z
  .object({
    document: documentSchemaElement,
    phone: phoneSchemaElement,
  })
  .strict();

export type WalletBalanceDto = z.infer<typeof WalletBalanceSchema>;
