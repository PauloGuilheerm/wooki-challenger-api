// createAccount.test.js
const resolvers = require('../../resolvers');

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
    const input = { name: 'João' };
    accountsCollectionMock.insertOne.mockResolvedValueOnce({ insertedId: '12345' });

    const result = await createAccount(null, input, { accountsCollection: accountsCollectionMock });

    expect(result.name).toBe(input.name);
    expect(result.balance).toBe(0);
  });
});
