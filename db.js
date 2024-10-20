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
  const transfersCollection = db.collection('transfers');

  return { 
    accountsCollection, 
    transfersCollection
 };
};

const getAccountsCollection = async() => {
  const db = await getDbConnection();
  return db.collection('accounts');
};

const getTransfersCollection = async () => {
  const db = await getDbConnection();
  return db.collection('transfers');
}


module.exports = { connectDB, getAccountsCollection, getTransfersCollection, getDbConnection };