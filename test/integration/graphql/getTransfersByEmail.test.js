// getTransfersIntegration.test.js
const request = require('supertest');
const { startServer } = require('../../../server');

const { generateRandomName } = require('../../utils/generateNamesForTest');
const { generateRandomEmail } = require('../../utils/generateEmailsForTest');
const { generateRandomPassword } = require('../../utils/generateRandomPassword');

const dotenv = require('dotenv');
dotenv.config();

let server;

describe('GraphQL API - Get Transfers Integration', () => {
  beforeAll(async () => {
    const port = Math.floor(1000 + Math.random() * 9000);
    server = await startServer(port);
  });

  afterAll(async () => {
    server.close();
  });

  it('should create accounts, transfer money, and retrieve transfers successfully', async () => {
    const accountOwner1 = generateRandomName();
    const accountEmail1 = generateRandomEmail();
    const accountPassword1 = generateRandomPassword();

    const accountOwner2 = generateRandomName();
    const accountEmail2 = generateRandomEmail();
    const accountPassword2 = generateRandomPassword();

    const createAccountMutation1 = `
      mutation {
        createAccount(name: \"${accountOwner1}\", email: \"${accountEmail1}\", password: \"${accountPassword1}\") {
          message
          success
        }
      }
    `;

    const createAccountResponse1 = await request(server)
      .post('/graphql')
      .send({ query: createAccountMutation1 })
      .expect(200);

    expect(createAccountResponse1.body.data.createAccount.message).toBe('Account created successfully');
    expect(createAccountResponse1.body.data.createAccount.success).toBe(true);

    const createAccountMutation2 = `
      mutation {
        createAccount(name: \"${accountOwner2}\", email: \"${accountEmail2}\", password: \"${accountPassword2}\") {
          message
          success
        }
      }
    `;

    const createAccountResponse2 = await request(server)
      .post('/graphql')
      .send({ query: createAccountMutation2 })
      .expect(200);

    expect(createAccountResponse2.body.data.createAccount.message).toBe('Account created successfully');
    expect(createAccountResponse2.body.data.createAccount.success).toBe(true);

    const transferMoneyMutation = `
      mutation {
        transferMoney(fromEmail: \"${accountEmail1}\", toEmail: \"${accountEmail2}\", amount: 50) {
          message
          success
        }
      }
    `;

    const transferMoneyResponse = await request(server)
      .post('/graphql')
      .send({ query: transferMoneyMutation })
      .expect(200);

    expect(transferMoneyResponse.body.data.transferMoney.message).toBe('Transfer successful');
    expect(transferMoneyResponse.body.data.transferMoney.success).toBe(true);

    const getTransfersQuery = `
      query {
        getTransfersByEmail(email: \"${accountEmail1}\") {
          fromEmail
          toEmail
          amount
        }
      }
    `;

    const getTransfersResponse = await request(server)
      .post('/graphql')
      .send({ query: getTransfersQuery })
      .expect(200);

      console.log(getTransfersResponse.body.data)

    expect(getTransfersResponse.body.data.getTransfersByEmail[0].fromEmail).toBe(accountEmail1);
    expect(getTransfersResponse.body.data.getTransfersByEmail[0].toEmail).toBe(accountEmail2);
    expect(getTransfersResponse.body.data.getTransfersByEmail[0].amount).toBe(50);
  });
});
