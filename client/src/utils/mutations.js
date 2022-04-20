import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!,$password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        user:{
            _id
            username
            email
        }
    }
  }
  `;

  export const LOGIN = gql`
    mutation login($username: String!, $email: String!,$password: String!) {
      login(username: $username, email: $email, password: $password) {
        token
        user:{
            _id
            username
            email
        }
        
      }
    }
  `;
  
  export const SAVE_BOOK = gql`
    mutation saveBook($bookId: ID!) {
      saveBook(bookId: $bookId) {
        token
        user:{
            _id
            username
            email
            savedBooks:{
                _id
                authors
                description
                bookId
                image
                link
                title
            }
        }
        
      }
    }
  `;
  
  export const DELETE_BOOK = gql`
    mutation deleteBook($bookId: ID!) {
      deleteBook(bookId: $bookId) {
        token
        user:{
            _id
            username
            email
            savedBooks:{
                _id
                authors
                description
                bookId
                image
                link
                title
            }
        }
        
      }
    }
  `;
