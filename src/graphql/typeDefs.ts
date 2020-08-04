import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    initials: String!
    products: [Product!]!
  }

  type Auth {
    token: String!
  }

  enum ProductStatus {
    AVAILABLE
    SOLD
    REMOVED
  }

  type Location {
    type: String!
    coordinates: [Int!]!
  }

  type Product {
    _id: ID!
    name: String!
    price: Float!
    status: ProductStatus!
    description: String!
    location: Location!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    products(search: String): [Product!]!
    product(id: ID!): Product!

    user(id: ID!): User!
  }

  type Mutation {
    registerUser(email: String!, password: String!, username: String!): Auth!
    loginUser(email: String!, password: String!): Auth!

    createProduct(name: String!, price: Float!, description: String!, point: [Int!]!): Product!
    updateProduct(id: ID!, name: String, price: Int, description: String): Product!
    changeProductStatus(id: ID!, status: String!): Product!
    deleteProduct(id: ID!): String!
  }
`;

export default typeDefs;
