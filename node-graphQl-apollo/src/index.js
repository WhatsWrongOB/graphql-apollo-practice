import express from "express";
import cors from "cors";

import { gql } from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

const products = [
  { id: 1, name: "Infinix", category: "mobile", price: 200 },
  { id: 2, name: "Samsung", category: "mobile", price: 700 },
  { id: 3, name: "Dell", category: "laptop", price: 1000 },
];

/* 
typeDefs (short for type definitions) define the structure of the data in your API. They describe the types of data your API can return, the structure of the queries clients can make, and the mutations that can be used to modify the data.
 - Queries:
The Query type defines how clients can fetch data. Each field in the Query corresponds to a different type of query that clients can make to your API
 - Mutations:
The Mutation type defines how clients can modify data. Mutations typically represent actions like creating, updating, or deleting entities.
*/
const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    category: String!
    price: Int!
  }

  type Query {
    getAllProducts: [Product]
    getAllCategories: [String]
    getProductById(id: ID!): Product
    getProductsByCategory(category: String!): [Product]
  }

  type Mutation {
    createProduct(
      id: ID!
      name: String!
      category: String!
      price: Int!
    ): [Product]
    deleteProduct(id: ID!): [Product]
  }
`;

/*
resolvers are functions that handle the logic for fetching or manipulating data based on the queries or mutations defined in the schema. While typeDefs define what kind of data your API exposes, resolvers define how to fetch or modify that data.

In GraphQL, resolvers are functions that handle the logic for fetching or manipulating data based on the queries or mutations defined in the schema. While typeDefs define what kind of data your API exposes, resolvers define how to fetch or modify that data.

Each field in a GraphQL schema corresponds to a resolver function, which runs when that field is requested. Resolvers are used to fetch data from a database, an external API, or even static data in your application.

How Resolvers Work
In GraphQL, when a query or mutation is made, the GraphQL server looks for a resolver function for each field involved in the operation. The resolver function will:

Receive Arguments (if any are passed in the query/mutation).
Fetch the Data: The resolver can fetch the necessary data, which could involve calling a database, another API, or some in-memory data.
Return the Data: Once the data is fetched or manipulated, the resolver returns the appropriate response.
 - Resolver Signature
A resolver function generally follows this signature:
(parent, args, context, info) => {}

 - Exapmle :
query {
  getAllProducts {
    id
    name
    category
    price
  }
}

mutation {
  createProduct(id: "4", name: "MacBook", category: "laptop", price: 1500) {
    id
    name
    category
    price
  }
}

*/
const resolvers = {
  Query: {
    getAllProducts: () => products,
    getProductById: (_, { id }) => products.find((item) => item.id == id),
    getAllCategories: () => {
      const categories = [];
      products.forEach((item) => {
        if (!categories.includes(item.category)) {
          categories.push(item.category);
        }
      });
      return categories;
    },
    getProductsByCategory: (_, { category }) =>
      products.filter((item) => item.category == category),
  },
  Mutation: {
    createProduct: (_, { id, name, category, price }) => {
      products.push({ id, name, category, price });
      return products;
    },
    deleteProduct: (_, { id }) => {
      const index = products.findIndex((item) => item.id == id);
      if (index !== -1) products.splice(index, 1);
      return products;
    },
  },
};

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  try {
    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.listen(4000, () => {
      console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    });
  } catch (error) {
    console.error("Error starting Apollo Server:", error);
  }
}

startApolloServer();
