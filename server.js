const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { ApolloServer } = require('apollo-server-koa');
const schema = require('./schema');
const resolvers = require('./resolvers');
const { connectDB } = require('./db');

const dotenv = require('dotenv');
dotenv.config();

const app = new Koa();

const startServer = async (port) => {
  const db = await connectDB();

  const server = new ApolloServer({
    schema,
    resolvers,
    context: () => ({ db }),
  });

  await server.start();

  server.applyMiddleware({ app });

  port = port ?? process.env.APP_PORT;

  app.use(bodyParser());
  
  return app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
};

module.exports = { startServer };
