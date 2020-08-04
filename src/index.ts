import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import User from './models/User';
import Product from './models/Product';

export interface Context {
  req: {
    headers: {
      authorization: string;
    };
  };
  models: {
    User: typeof User;
    Product: typeof Product;
  };
}

const models: Context['models'] = {
  User,
  Product,
};

const context = ({ req }: Context): Context => ({ req, models });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

const mongoDB: string = process.env.MONGODB_URI || '';

(async () => {
  try {
    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
    const serverRes = await server.listen();
    console.log(`🚀 Server ready at ${serverRes.url}`);
  } catch (error) {
    console.log(error.message);
  }
})();
