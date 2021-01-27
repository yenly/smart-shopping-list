// eslint-disable-next-line no-unused-vars
import React, { useContext, Fragment } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { FirebaseContext } from './Firebase';
import PropTypes from 'prop-types';
/** @jsx jsx */
import { jsx, Card, Button, Label, Checkbox } from 'theme-ui';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

const ListItems = ({ userToken }) => {
  const firebase = useContext(FirebaseContext);
  const db = firebase.firestore();
  const [listItems, loading, error] = useCollectionData(
    db.collection(userToken),
    {
      snapshortListenOptions: {
        includeMetadataChanges: true,
      },
      idField: 'id',
    },
  );
  let history = useHistory();

  if (!listItems) {
    return null;
  }

  const handleOnClick = () => {
    history.push('/add');
  };

  const markPurchased = (event) => {
    const itemPurchased = event.target.name;
    const findDoc = db.collection(userToken).where('name', '==', itemPurchased);
    findDoc
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const now = dayjs();
          const itemDocRef = db.collection(userToken).doc(doc.id);
          itemDocRef.update({
            purchaseDate: now.valueOf(),
          });
        });
      })
      .catch((error) => console.error(error));
  };

  const isWithinADay = (pDate) => {
    const purchaseDate = dayjs(pDate);
    const today = dayjs();
    const cDate = purchaseDate.add(24, 'hour');
    return cDate.isAfter(today);
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
            {listItems.map((item) => {
              if (isWithinADay(item.purchaseDate)) {
                return (
                  <li key={item.name}>
                    <Label htmlFor={item.name} mb={2}>
                      <Checkbox
                        id={item.name}
                        name={item.name}
                        checked
                        readOnly
                      />
                      {item.name}
                    </Label>
                  </li>
                );
              } else {
                return (
                  <li key={item.name}>
                    <Label htmlFor={item.name} mb={2}>
                      <Checkbox
                        id={item.name}
                        name={item.name}
                        onClick={markPurchased}
                        onChange={markPurchased}
                      />
                      {item.name}
                    </Label>
                  </li>
                );
              }
            })}
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
