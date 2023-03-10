import React, { useState, useEffect, useMemo } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

// for queries
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

// for mutations
import { useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';


import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // grab encrypted user data using the me query
  const { data } = useQuery(QUERY_ME, {
    update(cache, { data: { removeBook } }) {
      try {
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: removeBook },
        })
      } catch (err) {
        console.error(err);
      }
    }
  });
  // useMemo hook returns a memorized value, runs when only one of it's dependencies changes. (should use fewer resources if I understand correctly)
  const user = useMemo(() => data?.me || {}, [data?.me]);

  // sets up the remove book mutation
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  // refreshes data if something changes in user data?
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        if (!user) {
          throw new Error('something went wrong!');
        }

        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();

  }, [user]); //  deleted from parameters --> , [userDataLength]

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {

      const { data } = await removeBook({
        variables: { bookId: bookId },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      {error && (
        <div className="my-3 p-3 bg-danger text-white">{error.message}</div>
      )}
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
              <Card key={book.bookId} border='dark'>
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
