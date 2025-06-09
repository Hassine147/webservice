//
const { ApolloServer, gql } = require('apollo-server');
const { v4: uuidv4 } = require('uuid');

// Données en mémoire
const users = [];
const products = [];
const feedbacks = [];

//  GraphQL 
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    feedbacks: [Feedback]
  }

  type Product {
    id: ID!
    name: String!
    description: String
    feedbacks: [Feedback]
  }

  type Feedback {
    id: ID!
    rating: Int!
    comment: String
    date: String!
    user: User!
    product: Product!
  }

  type Query {
    getAllProducts: [Product]
    getFeedbackByProduct(productId: ID!): [Feedback]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    createProduct(name: String!, description: String): Product
    submitFeedback(userId: ID!, productId: ID!, rating: Int!, comment: String): Feedback
  }
`;

//  Résolveurs 
const resolvers = {
  Query: {
    getAllProducts: () => products,
    getFeedbackByProduct: (_, { productId }) => {
      return feedbacks.filter(fb => fb.productId === productId);
    },
  },

  Mutation: {
    createUser: (_, { name, email }) => {
      const user = { id: uuidv4(), name, email };
      users.push(user);
      return user;
    },
    createProduct: (_, { name, description }) => {
      const product = { id: uuidv4(), name, description };
      products.push(product);
      return product;
    },
    submitFeedback: (_, { userId, productId, rating, comment }) => {
      const user = users.find(u => u.id === userId);
      const product = products.find(p => p.id === productId);
      if (!user || !product) throw new Error("Invalid user or product ID");

      const feedback = {
        id: uuidv4(),
        rating,
        comment,
        date: new Date().toISOString(),
        userId,
        productId,
      };
      feedbacks.push(feedback);
      return feedback;
    },
  },

  Feedback: {
    user: (fb) => users.find(u => u.id === fb.userId),
    product: (fb) => products.find(p => p.id === fb.productId),
  },

  User: {
    feedbacks: (user) => feedbacks.filter(fb => fb.userId === user.id),
  },

  Product: {
    feedbacks: (product) => feedbacks.filter(fb => fb.productId === product.id),
  },
};

// Serveur Apollo 
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(` Server ready at ${url}`);
});
