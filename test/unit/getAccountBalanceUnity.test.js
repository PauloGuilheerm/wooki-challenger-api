const { getAccountBalance } = require('../../resolvers').Query;
const { ObjectId } = require('mongodb');

const { generateRandomName } = require('../utils/generateNamesForTest');
describe('getAccountBalance resolver', () => {
  let accountsCollectionMock;

  beforeEach(() => {
    accountsCollectionMock = {
      findOne: jest.fn(),
    };
  });

  it('should return the correct balance for a valid account', async () => {
    const accountowner = generateRandomName();
    const mockAccount = { _id: new ObjectId().toHexString(), name: accountowner,balance: 100.50 };
    
    accountsCollectionMock.findOne.mockResolvedValueOnce(mockAccount);

    const result = await getAccountBalance(null, { accountowner: mockAccount.name }, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Account found successfully');
    expect(result.success).toBe(true);
    expect(result.data).toBe(mockAccount.balance);
  });

  it('should throw an error if the account is not found', async () => {
    const accountowner = generateRandomName();

    const result = await getAccountBalance(null, { accountowner: accountowner }, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Account not found');
    expect(result.success).toBe(false);
  });

  it('should throw an error for an invalid account owner', async () => {
    const invalidaccountowner = 'invalid accountowner';

    const result = await getAccountBalance(null, { accountowner: invalidaccountowner }, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Account not found');
    expect(result.success).toBe(false);
  });
});
