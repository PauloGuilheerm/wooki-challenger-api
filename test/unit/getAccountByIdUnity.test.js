const resolvers = require('../../resolvers');
const { account } = resolvers.Query;
const { ObjectId } = require('mongodb');

describe('account resolver', () => {
  let accountsCollectionMock;

  beforeEach(() => {
    accountsCollectionMock = {
      findOne: jest.fn(),
    };
  });

  it('should fetch an account by ID successfully', async () => {
    const mockAccount = { id: new ObjectId().toHexString(), name: 'João', balance: 100 };

    accountsCollectionMock.findOne.mockResolvedValueOnce(mockAccount);

    const result = await account(null, { id: mockAccount.id}, { accountsCollection: accountsCollectionMock });

    expect(result.data.id).toBe(mockAccount.id);
    expect(result.data.name).toBe(mockAccount.name);
    expect(result.data.balance).toBe(mockAccount.balance);
  });

  it('should return null if account not found', async () => {
    const input = { id: 'non-existent-id' };

    accountsCollectionMock.findOne.mockResolvedValueOnce(null);

    const result = await account(null, input, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('ID invalid');
    expect(result.success).toBe(false);
  });
});
