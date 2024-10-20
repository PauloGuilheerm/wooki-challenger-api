const { Query } = require('../../resolvers');
const { generateRandomName } = require('../utils/generateNamesForTest');
const { generateRandomEmail } = require('../utils/generateEmailsForTest');
const { generateRandomPassword } = require('../utils/generateRandomPassword');
const { ObjectId } = require('mongodb');
const { hashPassword } = require('../../utils/hashPassword');

const { getAccountById } = Query;
describe('getAccountById - Unit Test', () => {
  let mockAccountsCollection;

  beforeEach(() => {
    mockAccountsCollection = {
      findOne: jest.fn(),
    };
  });

  it('should return an error if no ID is provided', async () => {
    const result = await getAccountById(null, { id: null }, { accountsCollection: mockAccountsCollection });
  
    expect(result.message).toBe('Account not found');
    expect(result.success).toBe(false);
  });

  it('should fetch account successfully if ID is provided', async () => {
    const account = { _id: new ObjectId().toHexString(), name: generateRandomName(), balance: 100, email: generateRandomEmail(), password: hashPassword(generateRandomPassword()) };

    mockAccountsCollection.findOne.mockResolvedValue(account);
    
    const result = await getAccountById(null, { id: account._id.toString() }, { accountsCollection: mockAccountsCollection });

    expect(result.message).toBe('Account fetched successfully');
    expect(result.success).toBe(true);

  });

  it('should return an error if the account is not found', async () => {
    mockAccountsCollection.findOne.mockResolvedValue(null);
    
    const result = await getAccountById(null, { id: new ObjectId().toString() }, { accountsCollection: mockAccountsCollection });

    expect(result.message).toBe('Account not found');
    expect(result.success).toBe(false);
  });
});
