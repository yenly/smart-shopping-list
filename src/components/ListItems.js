import React, { useContext } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { FirebaseContext } from './Firebase';
import PropTypes from 'prop-types';
/** @jsx jsx */
import { jsx, Card } from 'theme-ui';

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
  if (!listItems) {
    return null;
  }
  return (
    <>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading list...</span>}
      {listItems && (
        <Card
          mb={5}
          mt={10}
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
      {listItems.length === 0 && <p>Your shopping list is currently empty.</p>}
    </>
  );
};

ListItems.propTypes = {
  userToken: PropTypes.string.isRequired,
};

export default ListItems;
