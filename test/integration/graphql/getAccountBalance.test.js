const request = require('supertest');
const { startServer } = require('../../../server');
const { ObjectId } = require('mongodb');

let server;

const getAccountBalanceQuery = (id) => `query { getAccountBalance(id: \"${id}\") { message success data } }`;
describe('GraphQL API', () => {
  beforeAll(async () => {
    const port = Math.floor(1000 + Math.random() * 9000);

    server = await startServer(port);
  });

  afterAll(async () => {
    server.close();
  });

  it('should fetch account details', async () => {
    const query = getAccountBalanceQuery(new ObjectId(process.env.ACCOUNT1_MOCK))

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
    const query = getAccountBalanceQuery(new ObjectId(process.env.ACCOUNT2_MOCK));

    const response = await request(server)
      .post('/graphql')
      .send({query})
      .expect(200);

    expect(response.body.data.getAccountBalance.message).toBe("Account found successfully");
    expect(response.body.data.getAccountBalance.success).toBe(true);
    expect(response.body.data.getAccountBalance.data).toStrictEqual(expect.any(Number));
  });

  it('should return an error when not send the accountowner', async () => {
    const query = getAccountBalanceQuery(new ObjectId().toHexString());

    const response = await request(server)
      .post('/graphql')
      .send({query})
      .expect(200);

      expect(response.body.data.getAccountBalance.message).toBe('Account not found');
      expect(response.body.data.getAccountBalance.success).toBe(false);
  });
});
