const resolvers = require('../../resolvers');
const { account } = resolvers.Query;
const { ObjectId } = require('mongodb');

const { generateRandomName } = require('../utils/generateNamesForTest');
describe('account resolver', () => {
  let accountsCollectionMock;

  beforeEach(() => {
    accountsCollectionMock = {
      findOne: jest.fn(),
    };
  });

  it('should fetch an account by account owner successfully', async () => {
    const accountowner = generateRandomName();
    const mockAccount = { id: new ObjectId().toHexString(), name: accountowner, balance: 100 };

    accountsCollectionMock.findOne.mockResolvedValueOnce(mockAccount);

    const result = await account(null, { accountowner: mockAccount.name }, { accountsCollection: accountsCollectionMock });

    expect(result.id).toBe(mockAccount.id);
    expect(result.name).toBe(mockAccount.name);
    expect(result.balance).toBe(mockAccount.balance);
    expect(result.success).toBe(true);
  });

  it('should return null if account not found', async () => {
    const input = { accountowner: 'teste' };

    const result = await account(null, input, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Account not found');
    expect(result.success).toBe(false);
  });
});
