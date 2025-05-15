const TestDataGenerator = {
  generateRandomNumberString(length = 10): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  },

  generateRandomAlphanumericString(length = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  },

  generateRandomUser() {
    return {
      document: this.generateRandomAlphanumericString(),
      name: this.generateRandomAlphanumericString(),
      email: `${this.generateRandomAlphanumericString()}@test.com`,
      phone: this.generateRandomNumberString(),
    };
  },
};

const ApiClient = {
  baseUrl: 'http://localhost:10000/v1',

  createUser(user) {
    return cy.request('POST', `${this.baseUrl}/create-user`, user);
  },

  deposit(params) {
    return cy.request('POST', `${this.baseUrl}/deposit`, params);
  },

  getWalletBalance(params) {
    return cy.request('POST', `${this.baseUrl}/wallet-balance`, params);
  },

  getAllUserEvents(params) {
    return cy.request('POST', `${this.baseUrl}/get-all-user-events`, params);
  },

  createPayment(params) {
    return cy.request('POST', `${this.baseUrl}/create-payment`, params);
  },

  processPayment(params) {
    return cy.request('POST', `${this.baseUrl}/process-payment`, params);
  },
};

describe('Wallet End-to-End Testing', () => {
  const user = TestDataGenerator.generateRandomUser();
  let paymentSession = {
    sessionId: '',
    code: '',
  };

  context('User Registration and Initial Setup', () => {
    it('should register a new user', () => {
      ApiClient.createUser(user).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.success).to.be.true;
      });
    });

    it('should successfully deposit $1000', () => {
      ApiClient.deposit({
        document: user.document,
        phone: user.phone,
        amount: 1000,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.success).to.be.true;
      });
    });

    it('should verify wallet balance is $1000', () => {
      ApiClient.getWalletBalance({
        document: user.document,
        phone: user.phone,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.balance).to.eq(1000);
      });
    });
  });

  context('Payment Processing', () => {
    it('should create a payment request and return session details', () => {
      ApiClient.createPayment({
        document: user.document,
        phone: user.phone,
        amount: 500,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.success).to.be.true;
        expect(response.body.data.success).to.be.true;
        expect(response.body.data).to.include.all.keys('DEBUG_SESSION_ID', 'DEBUG_CONFIRMATION_CODE');

        paymentSession = {
          sessionId: response.body.data.DEBUG_SESSION_ID,
          code: response.body.data.DEBUG_CONFIRMATION_CODE,
        };
      });
    });

    it('should process payment and deduct $500 from account', () => {
      ApiClient.processPayment({
        sessionId: paymentSession.sessionId,
        code: paymentSession.code,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.success).to.be.true;
      });
    });
  });

  context('Events verification', () => {
    it('should verify wallet balance is now $500', () => {
      ApiClient.getWalletBalance({
        document: user.document,
        phone: user.phone,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.balance).to.eq(500);
      });
    });

    it('should get events and be length 2 (Deposit and Payment)', () => {
      ApiClient.getAllUserEvents({
        document: user.document,
        phone: user.phone,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.length).to.equal(2);
      });
    });
  });
});
