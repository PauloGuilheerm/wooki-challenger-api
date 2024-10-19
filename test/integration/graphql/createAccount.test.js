const request = require('supertest');
const { startServer } = require('../../../server');

const { generateRandomName } = require('../../utils/generateNamesForTest');
const { generateRandomEmail } = require('../../utils/generateEmailsForTest');
const { generateRandomPassword } = require('../../utils/generateRandomPassword');

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
    const accountowner = generateRandomName();
    const accountemail = generateRandomEmail();
    const accountpassword = generateRandomPassword();

    const mutation = `
      mutation {
        createAccount(name: \"${accountowner}\", email: \"${accountemail}\", password: \"${accountpassword}\") {
        message success
        }
      }
    `;

    const response = await request(server)
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.createAccount.message).toBe('Account created successfully');
    expect(response.body.data.createAccount.success).toBe(true);
  });
});
