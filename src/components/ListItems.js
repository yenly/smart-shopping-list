// eslint-disable-next-line no-unused-vars
import React, { useContext, Fragment, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { FirebaseContext } from './Firebase';
import PropTypes from 'prop-types';
/** @jsx jsx */
import {
  jsx,
  Card,
  Button,
  Label,
  Checkbox,
  Input,
  IconButton,
} from 'theme-ui';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import calculateEstimate from '../lib/estimates';

dayjs.extend(duration);

const ListItems = ({ userToken }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayClearIcon, setDisplayClearIcon] = useState(false);
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
          let item = doc.data();
          let purchaseDates = item.purchaseDates;
          const latestInterval =
            item.purchaseDates.length >= 1
              ? calculateLastInterval(
                  purchaseDates[purchaseDates.length - 1],
                  now.valueOf(),
                )
              : item.likelyToPurchase;

          purchaseDates =
            purchaseDates.length === 0
              ? (purchaseDates = [now.valueOf()])
              : [...purchaseDates, now.valueOf()];

          const lastEstimate = !isNaN(item.lastEstimate)
            ? item.lastEstimate
            : null;
          const numberOfPurchases = purchaseDates.length;
          const newEstimate = calculateEstimate(
            lastEstimate,
            latestInterval,
            numberOfPurchases,
          );

          const itemDocRef = db.collection(userToken).doc(doc.id);
          itemDocRef.update({
            purchaseDates: purchaseDates,
            estimatedDays: newEstimate,
          });
        });
      })
      .catch((error) => console.error(error));
  };

  const calculateLastInterval = (lastPurchase, today) => {
    const mostRecent = dayjs(lastPurchase);
    const todayPurchase = dayjs(today);
    const duration = dayjs.duration(todayPurchase.diff(mostRecent));
    return Math.round(duration.asDays());
  };

  const isWithinADay = (pDate) => {
    if (pDate === undefined) {
      return false;
    }
    const purchaseDate = dayjs(pDate);
    const today = dayjs();
    const cDate = purchaseDate.add(24, 'hour');
    return cDate.isAfter(today);
  };

  const handleSearchTermOnChange = (event) => {
    const term = event.target.value;
    if (term.length !== 0) {
      setDisplayClearIcon(true);
    } else {
      setDisplayClearIcon(false);
    }
    setSearchTerm(term);
  };

  const clearSearchTermInput = () => {
    setSearchTerm('');
    setDisplayClearIcon(false);
  };

  return (
    <Fragment>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading list...</span>}
      {userToken && (
        <p>
          Share your list with this token:
          <br />
          <strong>{userToken}</strong>
        </p>
      )}

      {listItems && listItems.length !== 0 && (
        <>
          <Label htmlFor="searchTerm">Filter items</Label>
          <div className="searchTermInput">
            <Input
              mb={3}
              name="searchTerm"
              value={searchTerm}
              onChange={handleSearchTermOnChange}
            />
            {displayClearIcon && (
              <IconButton
                aria-label="Clear Filter Term"
                onClick={clearSearchTermInput}
              >
                X
              </IconButton>
            )}
          </div>
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
              {listItems
                .filter((item) => item.name.includes(searchTerm))
                .map((item) => {
                  // console.log(item.name, isWithinADay(item.purchaseDates.pop()))
                  // if (isWithinADay(item.purchaseDates.pop())) {
                  //   return (
                  //     <li key={item.name}>
                  //       <Label htmlFor={item.name} mb={2}>
                  //         <Checkbox
                  //           id={item.name}
                  //           name={item.name}
                  //           onChange={markPurchased}
                  //           checked={true}
                  //           readOnly
                  //         />
                  //         {item.name}
                  //       </Label>
                  //     </li>
                  //   );
                  // } else {
                  //   return (
                  //     <li key={item.name}>
                  //       <Label htmlFor={item.name} mb={2}>
                  //         <Checkbox
                  //           id={item.name}
                  //           name={item.name}
                  //           onClick={markPurchased}
                  //           onChange={markPurchased}
                  //         />
                  //         {item.name}
                  //       </Label>
                  //     </li>
                  //   );
                  // }
                  return (
                    <li key={item.name}>
                      <Label htmlFor={item.name} mb={2}>
                        <Checkbox
                          id={item.name}
                          name={item.name}
                          onClick={markPurchased}
                          onChange={markPurchased}
                          checked={isWithinADay(item.purchaseDates.pop())}
                          readOnly={isWithinADay(item.purchaseDates.pop())}
                        />
                        {item.name}
                      </Label>
                    </li>
                  );
                })}
            </ul>
          </Card>
        </>
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
