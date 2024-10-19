const request = require('supertest');
const { startServer } = require('../../../server');

const { generateRandomName } = require('../../utils/generateNamesForTest');
const { generateRandomEmail } = require('../../utils/generateEmailsForTest');
const { generateRandomPassword } = require('../../utils/generateRandomPassword');
const { hashPassword } = require('../../../utils/hashPassword');
const { getAccountsCollection } = require('../../../db');

const dotenv = require('dotenv');
dotenv.config();

let server;

const getAccountQuery = (email, password) => `
      query {
        getAccount(email: \"${email}\", password: \"${password}\") {
          message
          success
          _id
          name
          balance
        }
      }
    `;

describe('GraphQL API - Account Resolver', () => {
  beforeAll(async () => {
    const port = Math.floor(1000 + Math.random() * 9000);

    server = await startServer(port);
  });

  afterAll(async () => {
    server.close();
  });

  it('should return account successfully with correct credentials', async () => {
    const accountowner = generateRandomName();
    const accountemail = generateRandomEmail();
    const accountpassword = generateRandomPassword();
    const hashedPassword = await hashPassword(accountpassword);

    const accountsCollection = await getAccountsCollection();
    
    await accountsCollection.insertOne({
      name: accountowner.toLowerCase(),
      email: accountemail.toLowerCase(),
      password: hashedPassword,
      balance: 100,
    });

    const query = getAccountQuery(accountemail, accountpassword);

    const response = await request(server)
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.getAccount.message).toBe('Account found successfully');
    expect(response.body.data.getAccount.success).toBe(true);
    expect(response.body.data.getAccount.name).toBe(accountowner.toLowerCase());
    expect(response.body.data.getAccount.balance).toBe(100);
  });

  it('should return error if account is not found', async () => {
    const accountemail = generateRandomEmail();
    const accountpassword = generateRandomPassword();

    const query = getAccountQuery(accountemail, accountpassword);

    const response = await request(server)
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.getAccount.message).toBe('Account not found');
    expect(response.body.data.getAccount.success).toBe(false);
  });

  it('should return error if password is incorrect', async () => {
    const accountowner = generateRandomName();
    const accountemail = generateRandomEmail();
    const correctPassword = generateRandomPassword();
    const incorrectPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(correctPassword);

    const accountsCollection = await getAccountsCollection();
    
    await accountsCollection.insertOne({
      name: accountowner.toLowerCase(),
      email: accountemail.toLowerCase(),
      password: hashedPassword,
      balance: 100,
    });

    const query = getAccountQuery(accountemail, incorrectPassword);

    const response = await request(server)
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.getAccount.message).toBe('Password is incorrect');
    expect(response.body.data.getAccount.success).toBe(false);
  });
});
