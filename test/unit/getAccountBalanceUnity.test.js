const { getAccountBalance } = require('../../resolvers').Query;
const { ObjectId } = require('mongodb');

describe('getAccountBalance resolver', () => {
  let accountsCollectionMock;

  beforeEach(() => {
    accountsCollectionMock = {
      findOne: jest.fn(),
    };
  });

  it('should return the correct balance for a valid account', async () => {
    const mockAccount = { _id: new ObjectId().toHexString(), balance: 100.50 };
    
    accountsCollectionMock.findOne.mockResolvedValueOnce(mockAccount);

    const result = await getAccountBalance(null, { id: mockAccount._id }, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Account found successfully');
    expect(result.success).toBe(true);
    expect(result.data).toBe(mockAccount.balance);
  });

  it('should throw an error if the account is not found', async () => {
    const accountId = new ObjectId().toHexString();

    const result = await getAccountBalance(null, { id: accountId }, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Account not found');
    expect(result.success).toBe(false);
  });

  it('should throw an error for an invalid ObjectId', async () => {
    const invalidAccountId = 'invalid_id';

    const result = await getAccountBalance(null, { id: invalidAccountId }, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('ID invalid');
    expect(result.success).toBe(false);
  });
});
