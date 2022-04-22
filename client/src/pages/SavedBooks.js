import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { useMutation } from '@apollo/client';

import { useQuery } from '@apollo/client';
import { QUERY_MY_PROFILE } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  
  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;
  const {loading, data} = useQuery(QUERY_MY_PROFILE);
  const [deleteBook, {error}] = useMutation(DELETE_BOOK);
  
  // TODO -get userProfile apollo
  useEffect(() => {
    
    const getUserData = async () => {
      console.log(userData,data,loading)
      if (loading){
        return
      }
      try {
        const user = await data.myProfile
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        console.log(token,data,loading,user)
        if (!token) {
          return false;
        }
        
        if (!user?._id) {
          throw new Error('You must be logged in to view this page!');
        }

        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [userDataLength,data]);

  // TODO remove saved book
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const {data} = await deleteBook({
        variables:{bookId},
      });

      if (!data) {
        throw new Error('something went wrong!');
      }
      console.log(data.deleteBook)
    //   const updatedUser = await response.json();
      setUserData(data.deleteBook);
    //   // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
  console.log(userDataLength,userData,'loading')
  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} borxzxder='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
