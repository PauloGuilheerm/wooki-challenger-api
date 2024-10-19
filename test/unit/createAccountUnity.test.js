// createAccount.test.js
const resolvers = require('../../resolvers');

const { generateRandomName } = require('../utils/generateNamesForTest');

const { createAccount } = resolvers.Mutation;

describe('createAccount resolver', () => {
  let accountsCollectionMock;

  beforeEach(() => {
    accountsCollectionMock = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
    };
  });

  it('should create a new account successfully', async () => {
    const accountowner = generateRandomName();
    const input = { name: accountowner };
    accountsCollectionMock.insertOne.mockResolvedValueOnce({ insertedId: '12345' });

    const result = await createAccount(null, input, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Account created successfully');
    expect(result.success).toBe(true);
  });
});
