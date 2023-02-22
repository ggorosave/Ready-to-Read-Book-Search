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

        login(email: String!, password: String!): Auth

        saveBook(userId: ID!, bookId: String!, authors: String!, title: String!, description: String!, image: String!): User
        
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;