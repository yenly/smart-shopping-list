import React, { useContext } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { FirebaseContext } from './Firebase';

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
    <div>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading list...</span>}
      {listItems && (
        <ul>
          {listItems.map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>
      )}
      {listItems.length === 0 && <p>Your shopping list is currently empty.</p>}
    </div>
  );
};

export default ListItems;
