const resolvers = require('../../resolvers');
const { ObjectId } = require('mongodb');

const { transferMoney } = resolvers.Mutation;
describe('transferMoney resolver', () => {
  let accountsCollectionMock;
  let transactionsCollectionMock;

  beforeEach(() => {
    accountsCollectionMock = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };
    transactionsCollectionMock = {
      insertOne: jest.fn(),
    };
  });

  it('should transfer money successfully', async () => {
    const fromAccount = { _id: new ObjectId('233333333331111111111113'), balance: 500 };
    const toAccount = { _id: new ObjectId('233333333331111111222213'), balance: 100 };

    accountsCollectionMock.findOne
      .mockResolvedValueOnce(fromAccount)
      .mockResolvedValueOnce(toAccount);

    const result = await transferMoney(null, {
      fromId: fromAccount._id,
      toId: toAccount._id,
      amount: 100,
    }, { accountsCollection: accountsCollectionMock, transactionsCollection: transactionsCollectionMock });

    expect(accountsCollectionMock.findOne).toHaveBeenCalledTimes(2);
    expect(accountsCollectionMock.updateOne).toHaveBeenCalledTimes(2);
    expect(transactionsCollectionMock.insertOne).toHaveBeenCalledTimes(1);
    
    expect(result.message).toBe('Transfer successful');
    expect(result.success).toBe(true);
  });

  it('should fail if from account has insufficient balance', async () => {
    const fromAccount = { _id: new ObjectId('233333333331111111111113'), balance: 50 };
    const toAccount = { _id: new ObjectId('233333333331111111222213'), balance: 100 };

    accountsCollectionMock.findOne
      .mockResolvedValueOnce(fromAccount)
      .mockResolvedValueOnce(toAccount);

    const result = await transferMoney(null, {
      fromId: fromAccount._id,
      toId: toAccount._id,
      amount: 100,
    }, { accountsCollection: accountsCollectionMock, transactionsCollection: transactionsCollectionMock });

    expect(result.message).toBe('Insufficient balance');
    expect(result.success).toBe(false);

    expect(accountsCollectionMock.updateOne).not.toHaveBeenCalled();
  });

  it('should fail if from account is not found', async () => {
    accountsCollectionMock.findOne
      .mockResolvedValueOnce(null);

    const result = await transferMoney(null, {
      fromId: process.env.INVALID_ACCOUNT_ID,
      toId: process.env.ACCOUNT2_MOCK,
      amount: 100,
    }, { accountsCollection: accountsCollectionMock, transactionsCollection: transactionsCollectionMock });

    expect(result.message).toBe('From account not found');
    expect(result.success).toBe(false);

    expect(accountsCollectionMock.updateOne).not.toHaveBeenCalled();
  });

  it('should fail if to account is not found', async () => {
    const fromAccount = { _id: new ObjectId(process.env.ACCOUNT1_MOCK), balance: 500 };

    accountsCollectionMock.findOne
      .mockResolvedValueOnce(fromAccount)
      .mockResolvedValueOnce(null);

    const result = await transferMoney(null, {
      fromId: process.env.ACCOUNT1_MOCK,
      toId: process.env.INVALID_ACCOUNT_ID,
      amount: 100,
    }, { accountsCollection: accountsCollectionMock, transactionsCollection: transactionsCollectionMock });

    expect(result.message).toBe('To account not found');
    expect(result.success).toBe(false);

    expect(accountsCollectionMock.updateOne).not.toHaveBeenCalled();
  });
});
