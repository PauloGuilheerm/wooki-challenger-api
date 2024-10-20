const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat , GraphQLBoolean, GraphQLInt, GraphQLList } = require('graphql');
const resolvers = require('./resolvers');

const AccountsType = new GraphQLObjectType({
  name: 'accounts',
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    message: { type: GraphQLString },
    email: { type: GraphQLString },
    success: { type: GraphQLBoolean }
  },
});

const TransfersType = new GraphQLObjectType({
  name: 'transfer',
  fields: {
    _id: { type: GraphQLString },
    fromEmail: { type: GraphQLString },
    toEmail: { type: GraphQLString },
    amount: { type: GraphQLFloat },
  },
});

const CreateAccountType = new GraphQLObjectType({
  name: 'createaccounts',
  fields: {
    message: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    accountid: { type: GraphQLString },
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
    getTransfersByEmail: {
      type: new GraphQLList(TransfersType),
      args: { email: { type: GraphQLString} },
      resolve: resolvers.Query.getTransfersByEmail
    },
    getAccountById: {
      type: AccountsType,
      args: { id: { type: GraphQLString } },
      resolve: resolvers.Query.getAccountById
    },
    getAccount: {
      type: AccountsType,
      args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
      resolve: resolvers.Query.getAccount
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
      type: CreateAccountType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: resolvers.Mutation.createAccount
    },
    transferMoney: {
      type: TransferMoneyResponseType ,
      args: {
        fromEmail: { type: GraphQLString },
        toEmail: { type: GraphQLString },
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
