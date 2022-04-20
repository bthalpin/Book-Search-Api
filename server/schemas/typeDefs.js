const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]! 
  }

  type Book {
    _id: ID!
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String
  }

  type Auth {
      user: User
      token: ID!
  }      

  type Query {
    users: [User]
    user(username: String!): User
    savedBooks(username: String): [Book]
    Book(_id: ID!): Book
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookId: ID!): User
    removeBook(bookId: ID!): User
    // addComment(thoughtId: ID!, commentText: String!): Thought
    // removeComment(thoughtId: ID!, commentId: ID!): Thought
  }
`;

module.exports = typeDefs;
