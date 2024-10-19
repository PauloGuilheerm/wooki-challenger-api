const { ObjectId } = require('mongodb');
const { getAccountsCollection, getTransactionsCollection} = require('./db');

const resolvers = {
  Query: {
    account: async (parent, { accountowner }, { accountsCollection }) => {
      accountsCollection = accountsCollection ?? await getAccountsCollection();

      if(accountowner == null || accountowner === undefined){
        return {
          message: 'Account owner is required',
          success: false,
        };
      }

      const account = await accountsCollection.findOne({ name: accountowner });

      if(account == null){
        return {
          message: 'Account not found',
          success: false,
        };
      }; 

      return {
        message: 'Account found successfully',
        success: true,
        ...account,
      }
    },
    getAccountBalance: async (parent, { accountowner }, { accountsCollection }) => {
      accountsCollection = accountsCollection ?? await getAccountsCollection();

      if(accountowner === null || accountowner === undefined){
        return {
          message: 'Account owner is required',
          success: false,
          data: {}
        };
      }
      const account = await accountsCollection.findOne({ name: accountowner.toLowerCase() });

      if (!account) {
        return {
          message: 'Account not found',
          success: false,
        };
      }

      return {
        message: 'Account found successfully',
        success: true,
        data: account.balance,
      };
    },
  },

  Mutation: {
    createAccount: async (parent, { name }, { accountsCollection }) => {
      accountsCollection = accountsCollection ?? await getAccountsCollection();

      if(!name)  {
        return {
          message: 'Name is required',
          success: false,
        };
      };
      
      const axistingAccountWithThisName = await accountsCollection.findOne({ name: name.toLowerCase() });

      if(axistingAccountWithThisName) {
        return {
          message: 'Account with this owner already exists',
          success: false,
        };
      };

      const newAccount = {
        name: name.toLowerCase(),
        balance: 0,
      };
      
      await accountsCollection.insertOne(newAccount);
      
      return {
        message: 'Account created successfully',
        success: true,
      };
    },
    transferMoney: async (parent, { fromId, toId, amount },  { accountsCollection, transactionsCollection }) => {
      accountsCollection = accountsCollection ?? await getAccountsCollection();
      transactionsCollection = transactionsCollection ?? await getTransactionsCollection();
      
      if (amount < 0) throw new Error("Amount must be greater than or equal to 0.");
      
      const fromAccount = await accountsCollection.findOne({ _id: new ObjectId(fromId) });
      const toAccount = await accountsCollection.findOne({ _id: new ObjectId(toId) });

      if (!fromAccount) {
        return {
          message: 'From account not found',
          success: false,
        };
      }

      if (!toAccount) {
        return {
          message: 'To account not found',
          success: false,
        };
      }

      if (fromAccount.balance < amount) {
        return {
          message: 'Insufficient balance',
          success: false,
        };
      }

      await accountsCollection.updateOne({ _id: new ObjectId(fromId) }, { $inc: { balance: -amount } });
      await accountsCollection.updateOne({ _id: new ObjectId(toId) }, { $inc: { balance: +amount } });

      const transaction = { fromId, toId, amount };
      await transactionsCollection.insertOne(transaction);

      return {
        message: 'Transfer successful',
        success: true,
      };
    },
  },
};

module.exports = resolvers;
