const resolvers = require('../../resolvers');
const {hashPassword} = require('../../utils/hashPassword');
const { ObjectId } = require('mongodb');

const { transferMoney } = resolvers.Mutation;
describe('transferMoney resolver', () => {
  let accountsCollectionMock;
  let transfersCollectionMock;

  beforeEach(() => {
    accountsCollectionMock = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };
    transfersCollectionMock = {
      insertOne: jest.fn(),
    };
  });

  it('should transfer money successfully', async () => {
    const fromId = new ObjectId().toHexString();
    const toId = new ObjectId().toHexString();
    const fromAccount = { _id: fromId, email: 'from@from.com', password: hashPassword(fromId), balance: 500 };
    const toAccount = { _id: toId, email: 'to@to.com', password: hashPassword(toId), balance: 100 };

    accountsCollectionMock.findOne
      .mockResolvedValueOnce(fromAccount)
      .mockResolvedValueOnce(toAccount);

    const result = await transferMoney(null, {
      fromEmail: fromAccount.email,
      toEmail: toAccount.email,
      amount: 100,
    }, { accountsCollection: accountsCollectionMock, transfersCollection: transfersCollectionMock });
    
    expect(result.message).toBe('Transfer successful');
    expect(result.success).toBe(true);
  });

  it('should fail if from account has insufficient balance', async () => {
    const fromId = new ObjectId().toHexString();
    const toId = new ObjectId().toHexString();
    const fromAccount = { _id: fromId, email: 'from@from.com', password: hashPassword(fromId), balance: 50 };
    const toAccount = { _id: toId, email: 'to@to.com', password: hashPassword(toId), balance: 100 };

    accountsCollectionMock.findOne
      .mockResolvedValueOnce(fromAccount)
      .mockResolvedValueOnce(toAccount);

    const result = await transferMoney(null, {
      fromEmail: fromAccount.email,
      toEmail: toAccount.email,
      amount: 100,
    }, { accountsCollection: accountsCollectionMock, transfersCollection: transfersCollectionMock });

    expect(result.message).toBe('Insufficient balance');
    expect(result.success).toBe(false);

    expect(accountsCollectionMock.updateOne).not.toHaveBeenCalled();
  });

  it('should fail if from account is not found', async () => {
    accountsCollectionMock.findOne
      .mockResolvedValueOnce(null);

    const result = await transferMoney(null, {
      fromEmail: process.env.INVALID_ACCOUNT_EMAIL,
      toEmail: process.env.ACCOUNT2_OWNER_MOCK,
      amount: 100,
    }, { accountsCollection: accountsCollectionMock, transfersCollection: transfersCollectionMock });

    expect(result.message).toBe('From account not found');
    expect(result.success).toBe(false);

    expect(accountsCollectionMock.updateOne).not.toHaveBeenCalled();
  });

  it('should fail if to account is not found', async () => {
    const fromId = new ObjectId().toHexString();

    const fromAccount = { _id: fromId, email: process.env.ACCOUNT1_EMAIL_MOCK, password: hashPassword(fromId), balance: 50 };

    accountsCollectionMock.findOne
      .mockResolvedValueOnce(fromAccount)
      .mockResolvedValueOnce(null);

    const result = await transferMoney(null, {
      fromEmail: process.env.ACCOUNT1_EMAIL_MOCK,
      toEmail: process.env.INVALID_ACCOUNT_EMAIL,
      amount: 100,
    }, { accountsCollection: accountsCollectionMock, transfersCollection: transfersCollectionMock });

    expect(result.message).toBe('To account not found');
    expect(result.success).toBe(false);

    expect(accountsCollectionMock.updateOne).not.toHaveBeenCalled();
  });
});
