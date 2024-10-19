// createAccount.test.js
const resolvers = require('../../resolvers');

const { generateRandomEmail } = require('../utils/generateEmailsForTest');
const { generateRandomName } = require('../utils/generateNamesForTest');
const { generateRandomPassword } = require('../utils/generateRandomPassword');

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
    const accountemail = generateRandomEmail();
    const accountpassword = generateRandomPassword();

    const input = { name: accountowner, email: accountemail, password: accountpassword };
    accountsCollectionMock.insertOne.mockResolvedValueOnce({ insertedId: '12345' });

    const result = await createAccount(null, input, { accountsCollection: accountsCollectionMock });

    expect(result.message).toBe('Account created successfully');
    expect(result.success).toBe(true);
  });
});
