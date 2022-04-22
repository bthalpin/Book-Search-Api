import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!,$password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        user {
            _id
            username
            
        }
    }
  }
  `;

  export const LOGIN_USER = gql`
    mutation login($email: String!,$password: String!) {
      login(email: $email, password: $password) {
        token
        user {
            _id
            username
        }
        
      }
    }
  `;
  
  export const SAVE_BOOK = gql`
    mutation saveBook($description:String!,$bookId: String,$image:String,$link:String,$title:String) {
      saveBook(description:$description,bookId: $bookId,image:$image,link:$link,title:$title) {
        
        savedBooks {
            description
            bookId
            image
            link
            title
        }

        
       
        
      }
    }
  `;
  
  export const DELETE_BOOK = gql`
    mutation deleteBook($bookId: ID!) {
      deleteBook(bookId: $bookId) {
            _id    
            username
            email
            savedBooks {
                
                authors
                description
                bookId
                image
                link
                title
            }
        
        
      }
    }
  `;
