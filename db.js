const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

let dbInstance = null;

const getDbConnection = async () => {
  if (!dbInstance) {
    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
    await client.connect();
    dbInstance = client.db(process.env.DB_CLIENT);
  }
  return dbInstance;
}
const connectDB = async () => {
  const db = await getDbConnection();
  const accountsCollection = db.collection('accounts');
  const transactionsCollection = db.collection('transactions');

  return { 
    accountsCollection, 
    transactionsCollection
 };
};

const getAccountsCollection = async() => {
  const db = await getDbConnection();
  return db.collection('accounts');
};

const getTransactionsCollection = async () => {
  const db = await getDbConnection();
  return db.collection('transactions');
}


module.exports = { connectDB, getAccountsCollection, getTransactionsCollection, getDbConnection };