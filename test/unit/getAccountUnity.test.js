const resolvers = require('../../resolvers');
const { getAccount } = resolvers.Query;
const { ObjectId } = require('mongodb');
const { hashPassword } = require('../../utils/hashPassword');

const { generateRandomName } = require('../utils/generateNamesForTest');
const { generateRandomEmail } = require('../utils/generateEmailsForTest');
const { generateRandomPassword } = require('../utils/generateRandomPassword');
describe('account resolver', () => {
  let accountsCollectionMock;

  beforeEach(() => {
    accountsCollectionMock = {
      findOne: jest.fn(),
    };
  });

  it('should fetch an account by account email and password successfully', async () => {
    const accountowner = generateRandomName();
    const accountemail = generateRandomEmail();
    const accountpassword = generateRandomPassword();
    
    const mockAccount = { id: new ObjectId().toHexString(), name: accountowner, email: accountemail, password: await hashPassword(accountpassword), balance: 100 };

    accountsCollectionMock.findOne.mockResolvedValueOnce(mockAccount);

    const result = await getAccount(null, { email: mockAccount.email, password: accountpassword }, { accountsCollection: accountsCollectionMock });

    expect(result.id).toBe(mockAccount.id);
    expect(result.name).toBe(mockAccount.name);
    expect(result.balance).toBe(mockAccount.balance);
    expect(result.success).toBe(true);
  });

  it('should return error if password is incorrect', async () => {
    const accountowner = generateRandomName();
    const accountemail = generateRandomEmail();
    const accountpassword = generateRandomPassword();
    
    const mockAccount = { id: new ObjectId().toHexString(), name: accountowner, email: accountemail, password: accountpassword, balance: 100 };

    accountsCollectionMock.findOne.mockResolvedValueOnce(mockAccount);

    const result = await getAccount(null, { email: mockAccount.email, password: 'incorrectpassword' }, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Password is incorrect');
    expect(result.success).toBe(false);
  });

  it('should return null if account not found', async () => {
    const input = { name: 'teste', email: "teste@teste.com", password: 'asdasdsadsa'};

    const result = await getAccount(null, input, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Account not found');
    expect(result.success).toBe(false);
  });

  it('should return password is required if not send password field', async () => {
    const input = { name: 'teste', email: "teste@teste.com"};

    const result = await getAccount(null, input, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Account password is required');
    expect(result.success).toBe(false);
  });
});
