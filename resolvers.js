const { ObjectId } = require('mongodb');
const { getAccountsCollection, getTransfersCollection} = require('./db');
const { hashPassword } = require('./utils/hashPassword');

const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    getAccountById: async (parent, { id }, { accountsCollection}) => {
      
      accountsCollection = accountsCollection?? await getAccountsCollection();

      try {
        const account = await accountsCollection.findOne({ _id: new ObjectId(id) });
        
        if(!account) {
          return {
            message: 'Account not found',
            success: false,
          };
        };
        
        return {
          message: 'Account fetched successfully',
          success: true,
          ...account,
        };
      }catch{
        return {
          message: 'Error fetching account',
          success: false,
        }
      }
    },
    getTransfersByEmail: async (parent, { email }, { transfersCollection }) => {
      transfersCollection = transfersCollection ?? await getTransfersCollection();
      const transfers = await transfersCollection.find({
        $or: [
          { fromEmail: email.toLowerCase() },
          { toEmail: email.toLowerCase() }
        ]
      }).toArray();

      return transfers;
    },
    getAccount: async (parent, { email, password }, { accountsCollection }) => {
      accountsCollection = accountsCollection ?? await getAccountsCollection();

      if(email == null || email === undefined){
        return {
          message: 'Account email is required',
          success: false,
        };
      };

      if(password == null || password === undefined){
        return {
          message: 'Account password is required',
          success: false,
        };
      }

      const account = await accountsCollection.findOne({ email: email.toLowerCase() });

      if(account == null){
        return {
          message: 'Account not found',
          success: false,
        };
      }; 

      const isMatchPassword = await bcrypt.compare(password, account.password);

      if(!isMatchPassword){
        return {
          message: 'Password is incorrect',
          success: false,
        };
      };
      
      return {
        message: 'Account found successfully',
        success: true,
        ...account,
      }
    },
    getAccountBalance: async (parent, { id }, { accountsCollection }) => {
      accountsCollection = accountsCollection ?? await getAccountsCollection();

      if(id === null || id === undefined){
        return {
          message: 'Account id is required',
          success: false,
          data: {}
        };
      }
      const account = await accountsCollection.findOne({ _id: new ObjectId(id) });

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
    createAccount: async (parent, { name, password, email }, { accountsCollection }) => {
      accountsCollection = accountsCollection ?? await getAccountsCollection();

      if(!name)  {
        return {
          message: 'Name is required',
          success: false,
        };
      };
      
      const axistingAccountWithThisEmail = await accountsCollection.findOne({ email: email.toLowerCase() });

      if(axistingAccountWithThisEmail) {
        return {
          message: 'Account with this owner already exists',
          success: false,
        };
      };

      const newAccount = {
        name: name.toLowerCase(),
        balance: 5000,
        email: email.toLowerCase(),
        password: await hashPassword(password),
      };
      
      await accountsCollection.insertOne(newAccount);
      
      return {
        message: 'Account created successfully',
        success: true,
      };
    },
    transferMoney: async (parent, { fromEmail, toEmail, amount },  { accountsCollection, transfersCollection }) => {
      accountsCollection = accountsCollection ?? await getAccountsCollection();
      transfersCollection = transfersCollection ?? await getTransfersCollection();
      
      if (amount < 0) {
        return {
          message: 'Amount must be greater than or equal to 0.',
          success: false,
        };
      };
      
      if(fromEmail === toEmail){
        return {
          message: 'From and To accounts must be different.',
          success: false,
        };
      };

      const fromAccount = await accountsCollection.findOne({ email: fromEmail.toLowerCase() });
      const toAccount = await accountsCollection.findOne({ email: toEmail.toLowerCase() });

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

      await accountsCollection.updateOne({ email: fromEmail.toLowerCase() }, { $inc: { balance: -amount } });
      await accountsCollection.updateOne({ email: toEmail.toLowerCase() }, { $inc: { balance: +amount } });

      const transaction = { fromEmail, toEmail, amount };
      await transfersCollection.insertOne(transaction);

      return {
        message: 'Transfer successful',
        success: true,
      };
    },
  },
};

module.exports = resolvers;
