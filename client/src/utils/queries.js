import { gql } from '@apollo/client';

export const QUERY_MY_PROFILE = gql`
  query myProfile {
    myProfile {
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
