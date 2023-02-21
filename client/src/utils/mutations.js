import { gql } from '@apollo/client';

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String) {
        addUser(sername: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
                email
                password
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation login($username: String, $email: String, $password: String!) {
        login(username: $username, email: $email, password: $password) {
            _id
            username
            email
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($userId: ID!, $bookId: String!, $title: String!, $description: String!, $image: String!, $authors: String) {
        saveBook(userId: $userId, bookId: $bookId, title: $title, description: $description, image: $image, authors: $author) {
            _id
            username
            savedBooks
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            id
            username
            savedBooks {
                bookId
                authors
                title
            }
        }
    }
`;