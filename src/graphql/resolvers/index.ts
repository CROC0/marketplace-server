import { IResolvers } from 'apollo-server';

import { userQueries, userMutations, userNestedQueries } from './user';
import { productMutations, productQueries, productNestedQueries } from './product';

const resolvers: IResolvers = {
  Query: {
    ...userQueries,
    ...productQueries,
  },
  User: {
    ...userNestedQueries,
  },
  Product: {
    ...productNestedQueries,
  },
  Mutation: {
    ...userMutations,
    ...productMutations,
  },
};

export default resolvers;
