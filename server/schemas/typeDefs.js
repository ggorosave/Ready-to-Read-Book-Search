const { gql } = require('apollo-server-express');
// Add 'me' to queries?

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
    }

    type Book {
        authors: String
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        user(userId: ID!): User
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(username: String, email: String, password: String!): Auth
        addSavedBook(userId: ID!, savedBook: String!): User
        removeSavedBook(savedBook: String!): User
    }
`;

module.exports = typeDefs;