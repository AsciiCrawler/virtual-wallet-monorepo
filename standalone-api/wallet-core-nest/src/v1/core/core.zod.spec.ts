import {
  CreateUserSchema,
  DepositSchema,
  CreatePaymentSchema,
  ProcessPaymentSchema,
  WalletBalanceSchema,
} from './core.zod'; // Update the import path

describe('Zod Schema Validation', () => {
  describe('CreateUserSchema', () => {
    it('should validate a valid user creation object', () => {
      const validUser = {
        document: '12345678',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+123456789',
      };
      expect(() => CreateUserSchema.parse(validUser)).not.toThrow();
    });

    it('should reject if document is invalid', () => {
      const invalidUser = {
        document: '123', // too short
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+123456789',
      };
      expect(() => CreateUserSchema.parse(invalidUser)).toThrow();
    });

    it('should reject if name contains invalid characters', () => {
      const invalidUser = {
        document: '12345678',
        name: 'John123', // contains numbers
        email: 'john@example.com',
        phone: '+123456789',
      };
      expect(() => CreateUserSchema.parse(invalidUser)).toThrow();
    });

    it('should reject if email is invalid', () => {
      const invalidUser = {
        document: '12345678',
        name: 'John Doe',
        email: 'not-an-email',
        phone: '+123456789',
      };
      expect(() => CreateUserSchema.parse(invalidUser)).toThrow();
    });

    it('should reject if phone is invalid', () => {
      const invalidUser = {
        document: '12345678',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-789', // contains hyphens
      };
      expect(() => CreateUserSchema.parse(invalidUser)).toThrow();
    });

    it('should reject additional properties', () => {
      const invalidUser = {
        document: '12345678',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+123456789',
        extra: 'property',
      };
      expect(() => CreateUserSchema.parse(invalidUser)).toThrow();
    });
  });

  describe('DepositSchema', () => {
    it('should validate a valid deposit object', () => {
      const validDeposit = {
        document: '12345678',
        phone: '+123456789',
        amount: 100.5,
      };
      expect(() => DepositSchema.parse(validDeposit)).not.toThrow();
    });

    it('should reject if amount is negative', () => {
      const invalidDeposit = {
        document: '12345678',
        phone: '+123456789',
        amount: -100,
      };
      expect(() => DepositSchema.parse(invalidDeposit)).toThrow();
    });

    it('should reject if amount has more than 2 decimal places', () => {
      const invalidDeposit = {
        document: '12345678',
        phone: '+123456789',
        amount: 100.123,
      };
      expect(() => DepositSchema.parse(invalidDeposit)).toThrow();
    });

    it('should reject if amount exceeds maximum', () => {
      const invalidDeposit = {
        document: '12345678',
        phone: '+123456789',
        amount: 1000000000,
      };
      expect(() => DepositSchema.parse(invalidDeposit)).toThrow();
    });
  });

  describe('CreatePaymentSchema', () => {
    it('should validate a valid payment creation object', () => {
      const validPayment = {
        document: '12345678',
        phone: '+123456789',
        amount: 50.75,
      };
      expect(() => CreatePaymentSchema.parse(validPayment)).not.toThrow();
    });

    it('should reject if any required field is missing', () => {
      const invalidPayment = {
        document: '12345678',
        phone: '+123456789',
        // amount missing
      };
      expect(() => CreatePaymentSchema.parse(invalidPayment)).toThrow();
    });
  });

  describe('ProcessPaymentSchema', () => {
    it('should validate a valid payment processing object', () => {
      const validProcess = {
        sessionId: '5f8d0d55b54764421b7156c3',
        code: '123456',
      };
      expect(() => ProcessPaymentSchema.parse(validProcess)).not.toThrow();
    });

    it('should reject invalid sessionId format', () => {
      const invalidProcess = {
        sessionId: 'invalid-id',
        code: '123456',
      };
      expect(() => ProcessPaymentSchema.parse(invalidProcess)).toThrow();
    });

    it('should reject invalid code format', () => {
      const invalidProcess = {
        sessionId: '5f8d0d55b54764421b7156c3',
        code: '12345', // not 6 digits
      };
      expect(() => ProcessPaymentSchema.parse(invalidProcess)).toThrow();
    });
  });

  describe('WalletBalanceSchema', () => {
    it('should validate a valid wallet balance query', () => {
      const validQuery = {
        document: '12345678',
        phone: '+123456789',
      };
      expect(() => WalletBalanceSchema.parse(validQuery)).not.toThrow();
    });

    it('should reject if document is missing', () => {
      const invalidQuery = {
        phone: '+123456789',
      };
      expect(() => WalletBalanceSchema.parse(invalidQuery)).toThrow();
    });

    it('should reject if phone is missing', () => {
      const invalidQuery = {
        document: '12345678',
      };
      expect(() => WalletBalanceSchema.parse(invalidQuery)).toThrow();
    });
  });
});
