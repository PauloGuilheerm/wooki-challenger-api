const request = require('supertest');
const { startServer } = require('../../../server');

const dotenv = require('dotenv');
dotenv.config();

let server;

const getTransferMutation = (fromEmail, toEmail, amount) => `mutation { transferMoney(fromEmail: \"${fromEmail}\",  toEmail: \"${toEmail}\", amount: ${amount}) { success message } }`;
describe('GraphQL API - Transfer Money', () => {
  beforeAll(async () => {
    const port = Math.floor(1000 + Math.random() * 9000);

    server = await startServer(port);
  });

  afterAll(async () => {
    server.close();
  });

  it('should transfer money successfully', async () => {
    const mutation = getTransferMutation(process.env.ACCOUNT1_EMAIL_MOCK, process.env.ACCOUNT2_EMAIL_MOCK, process.env.AMOUNT_MOCK);

    const response = await request(server)
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.transferMoney.success).toBe(true);
    expect(response.body.data.transferMoney.message).toBe('Transfer successful');
  });

  it('should fail when trying to transfer more than the balance', async () => {
    const mutation = getTransferMutation(process.env.ACCOUNT_3_EMAIL_MOCK_WITHOUT_BALANCE, process.env.ACCOUNT2_EMAIL_MOCK, process.env.AMOUNT_MOCK);

    const response = await request(server)
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.transferMoney.success).toBe(false);
    expect(response.body.data.transferMoney.message).toBe('Insufficient balance');
  });

  it('should fail when fromId', async () => {
    const mutation = getTransferMutation(process.env.INVALID_ACCOUNT_EMAIL, process.env.ACCOUNT2_EMAIL_MOCK, process.env.AMOUNT_MOCK);

    const response = await request(server)
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.transferMoney.success).toBe(false);
    expect(response.body.data.transferMoney.message).toBe('From account not found');
  });

  it('should fail when toId', async () => {
    const mutation = getTransferMutation(process.env.ACCOUNT1_EMAIL_MOCK, process.env.INVALID_ACCOUNT_EMAIL, process.env.AMOUNT_MOCK);

    const response = await request(server)
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.transferMoney.success).toBe(false);
    expect(response.body.data.transferMoney.message).toBe('To account not found');
  });
});
