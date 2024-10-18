const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat , GraphQLBoolean } = require('graphql');
const { ObjectId } = require('mongodb');
const resolvers = require('./resolvers');
const { getAccountsCollection } = require('./db');

const AccountsType = new GraphQLObjectType({
  name: 'accounts',
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const TransferMoneyResponseType = new GraphQLObjectType({
  name: 'TransferMoneyResponse',
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  },
});

const AccountBalanceResponseType = new GraphQLObjectType({
  name: 'AccountBalanceResponse',
  fields: {
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
    data: { type: GraphQLFloat }
  },
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    account: {
      type: AccountsType,
      args: { id: { type: GraphQLString } },
      resolve: async (parent, { id }) => {
        const accountsCollection = await getAccountsCollection();
        return await accountsCollection.findOne({ _id: new ObjectId(id) });
      },
    },
    getAccountBalance: {
      type: AccountBalanceResponseType,
      args: { id: { type: GraphQLString } },
      resolve: resolvers.Query.getAccountBalance
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createAccount: {
      type: AccountsType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: resolvers.Mutation.createAccount
    },
    transferMoney: {
      type: TransferMoneyResponseType ,
      args: {
        fromId: { type: GraphQLString },
        toId: { type: GraphQLString },
        amount: { type: GraphQLFloat },
      },
      resolve: resolvers.Mutation.transferMoney,
    },    
  },
});


module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
