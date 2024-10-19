const request = require('supertest');
const { startServer } = require('../../../server');

let server;

const getAccountBalanceQuery = (accountowner) => `query { getAccountBalance(accountowner: \"${accountowner}\") { message success data } }`;
describe('GraphQL API', () => {
  beforeAll(async () => {
    const port = Math.floor(1000 + Math.random() * 9000);

    server = await startServer(port);
  });

  afterAll(async () => {
    server.close();
  });

  it('should fetch account details', async () => {
    const query = getAccountBalanceQuery(process.env.ACCOUNT1_OWNER_MOCK)

    const response = await request(server)
      .post('/graphql')
      .send({query})
      .expect(200);

      
      expect(response.body.data.getAccountBalance).toEqual({
        message: "Account found successfully",
        success: true,
        data: expect.any(Number),
      });
  });

  it('should fetch account balance', async () => {
    const query =  getAccountBalanceQuery(process.env.ACCOUNT2_OWNER_MOCK);

    const response = await request(server)
      .post('/graphql')
      .send({query})
      .expect(200);

    expect(response.body.data.getAccountBalance.message).toBe("Account found successfully");
    expect(response.body.data.getAccountBalance.success).toBe(true);
    expect(response.body.data.getAccountBalance.data).toStrictEqual(expect.any(Number));
  });

  it('should return an error when account does not exist', async () => {
    const query = getAccountBalanceQuery('invalid name');

    const response = await request(server)
      .post('/graphql')
      .send({query})
      .expect(200);

      expect(response.body.data.getAccountBalance.message).toBe('Account not found');
      expect(response.body.data.getAccountBalance.success).toBe(false);
  });
});
