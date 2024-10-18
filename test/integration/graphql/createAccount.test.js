const request = require('supertest');
const { startServer } = require('../../../server');

const dotenv = require('dotenv');
dotenv.config();

let server;

describe('GraphQL API - Create Account', () => {
  beforeAll(async () => {
    const port = Math.floor(1000 + Math.random() * 9000);

    server = await startServer(port);
  });

  afterAll(async () => {
    server.close();
  });

  it('should create an account successfully', async () => {
    const mutation = `
      mutation {
        createAccount(name: "John Doe") {
          _id
          name
          balance
        }
      }
    `;

    const response = await request(server)
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.createAccount.name).toBe("John Doe");
    expect(response.body.data.createAccount.balance).toBe(0);
  });
});
