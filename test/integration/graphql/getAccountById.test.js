const request = require('supertest');
const { startServer } = require('../../../server');
const { ObjectId } = require('mongodb');
const { getAccountsCollection } = require('../../../db');

const { generateRandomName } = require('../../utils/generateNamesForTest');
const { generateRandomEmail } = require('../../utils/generateEmailsForTest');
const { generateRandomPassword } = require('../../utils/generateRandomPassword');
const { hashPassword } = require('../../../utils/hashPassword');

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

const getAccountByIdQuery = (id) => `
  query {
    getAccountById(id: \"${id}\") {
      message
      success
      _id
      name
      balance
    }
  }
`;

describe('GraphQL API - getAccountById Resolver - Integration Test', () => {
  beforeAll(async () => {
    const port = Math.floor(1000 + Math.random() * 9000);
    server = await startServer(port);
  });

  afterAll(async () => {
    server.close();
  });

  it('should return account successfully if ID is valid', async () => {
    const accountsCollection = await getAccountsCollection();

    const accountPassword = generateRandomPassword();
    const account = {
      name: generateRandomName(),
      email: generateRandomEmail(),
      password: await hashPassword(accountPassword),
      balance: 100,
    };

    await accountsCollection.insertOne(account);

    const accountQuery = getAccountQuery(account.email, accountPassword);

    const accountResponse = await request(server)
      .post('/graphql')
      .send({ query: accountQuery })
      .expect(200);

    const query = getAccountByIdQuery(accountResponse.body.data.getAccount._id);

    const response = await request(server)
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.getAccountById.message).toBe('Account fetched successfully');
    expect(response.body.data.getAccountById.success).toBe(true);
    expect(response.body.data.getAccountById._id).toBe(account._id.toString());
    expect(response.body.data.getAccountById.name).toBe(account.name);
    expect(response.body.data.getAccountById.balance).toBe(account.balance);
  });

  it('should return an error if account ID is not provided', async () => {
    const query = getAccountByIdQuery(null);

    const response = await request(server)
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.getAccountById.message).toBe('Error fetching account');
    expect(response.body.data.getAccountById.success).toBe(false);
  });

  it('should return null if account is not found', async () => {
    const query = getAccountByIdQuery(new ObjectId().toString());

    const response = await request(server)
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data.getAccountById.message).toBe('Account not found');
    expect(response.body.data.getAccountById.success).toBe(false);
  });
});
