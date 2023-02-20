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
