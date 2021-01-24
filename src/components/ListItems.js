// eslint-disable-next-line no-unused-vars
import React, { useContext, Fragment } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { FirebaseContext } from './Firebase';
import PropTypes from 'prop-types';
/** @jsx jsx */
import { jsx, Card, Button } from 'theme-ui';
import { useHistory } from 'react-router-dom';

const ListItems = ({ userToken }) => {
  const firebase = useContext(FirebaseContext);
  const db = firebase.firestore();
  const [listItems, loading, error] = useCollectionData(
    db.collection(userToken),
    {
      snapshortListenOptions: {
        includeMetadataChanges: true,
      },
    },
  );
  let history = useHistory();

  if (!listItems) {
    return null;
  }

  const handleOnClick = () => {
    history.push('/add');
  };

  return (
    <Fragment>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading list...</span>}
      {listItems && listItems.length !== 0 && (
        <Card
          sx={{
            maxWidth: 600,
            padding: '20px',
            border: 'thin',
            borderColor: 'yellowDark',
            borderRadius: 'sketchy5',
            textAlign: 'left',
            background: (theme) => theme.colors.yellow,
          }}
        >
          <ul>
            {listItems.map((item) => (
              <li key={item.name}>{item.name}</li>
            ))}
          </ul>
        </Card>
      )}
      {listItems.length === 0 && (
        <>
          <p>Your shopping list is currently empty.</p>
          <Button onClick={handleOnClick}>Add item</Button>
        </>
      )}
    </Fragment>
  );
};

ListItems.propTypes = {
  userToken: PropTypes.string.isRequired,
};

export default ListItems;
