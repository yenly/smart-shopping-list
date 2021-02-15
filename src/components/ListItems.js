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
  Flex,
} from 'theme-ui';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import calculateEstimate from '../lib/estimates';
import {
  calculateDateDuration,
  isWithinADay,
  isWithinMinutes,
} from '../lib/dateDurations';

const ListItems = ({ userToken, deleteItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayClearIcon, setDisplayClearIcon] = useState(false);
  const firebase = useContext(FirebaseContext);
  const db = firebase.firestore();
  const [listItems, loading, error] = useCollectionData(
    db.collection(userToken).orderBy('name', 'asc'),
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
          // if(purchaseDates && isWithinMinutes(purchaseDates[purchaseDates.length - 1])) {
          // undo checked box and revert data by
          //   remove last purchase date
          //   change likelyToPurchase = lastEstimate, lastEstimate = null
          // } else do calculate estimate and save purchase date
          if (
            purchaseDates.length !== 0 &&
            isWithinMinutes(purchaseDates[purchaseDates.length - 1])
          ) {
            const newPurchaseDates = purchaseDates.slice(
              0,
              purchaseDates.length - 1,
            );
            const newEstimatedDays =
              item.lastEstimates.length !== 0 ? item.lastEstimates.pop() : null;
            const newLastEstimates = item.lastEstimates || [];
            const itemDocRef = db.collection(userToken).doc(doc.id);
            itemDocRef.update({
              purchaseDates: newPurchaseDates,
              lastEstimates: newLastEstimates,
              likelyToPurchase: newEstimatedDays,
            });
          } else {
            const latestInterval =
              item.purchaseDates.length >= 1
                ? calculateLastInterval(purchaseDates[purchaseDates.length - 1])
                : item.likelyToPurchase;

            purchaseDates =
              purchaseDates.length === 0
                ? (purchaseDates = [now.valueOf()])
                : [...purchaseDates, now.valueOf()];

            const lastEstimate = item.likelyToPurchase;

            const numberOfPurchases = purchaseDates.length;
            const newEstimate = calculateEstimate(
              lastEstimate,
              latestInterval,
              numberOfPurchases,
            );
            // save to lastEstimate to list of lastEstimates for reverting
            const lastEstimates =
              item.lastEstimates && item.lastEstimates.length !== 0
                ? [...item.lastEstimates, lastEstimate]
                : [lastEstimate];

            const itemDocRef = db.collection(userToken).doc(doc.id);
            itemDocRef.update({
              purchaseDates: purchaseDates,
              lastEstimates: lastEstimates,
              likelyToPurchase: newEstimate,
            });
          }
        });
      })
      .catch((error) => console.error(error));
  };

  const calculateLastInterval = (lastPurchase) => {
    const mostRecent = dayjs(lastPurchase);
    const duration = calculateDateDuration(mostRecent);
    return Math.round(duration.asDays());
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

  const isChecked = (pDates) => {
    return pDates.length !== 0 && isWithinADay(pDates[pDates.length - 1]);
  };

  const isDisabled = (pDates) => {
    return (
      pDates.length !== 0 &&
      isWithinADay(pDates[pDates.length - 1]) &&
      !isWithinMinutes(pDates[pDates.length - 1])
    );
  };

  // if null, set new label instead
  const howSoon = (days) => {
    switch (true) {
      case days <= 7:
        return 'soon';
      case days > 7 && days < 30:
        return 'kind-of-soon';
      case days >= 30:
        return 'not-soon';
      default:
        return;
    }
  };

  // TODO: redefine inactive criteria in accordance to COVID shopping habits
  const isInactive = (item) => {
    const lastPurchaseDate = dayjs(
      item.purchaseDates[item.purchaseDates.length - 1],
    );
    const duration = calculateDateDuration(lastPurchaseDate);
    const daysSincePurchase = Math.round(duration.asDays());
    console.log(item.name, { daysSincePurchase }, item.likelyToPurchase);
    return (
      item.purchaseDates.length === 1 &&
      daysSincePurchase >= item.likelyToPurchase * 2
    );
  };

  const sortedItems = listItems.sort((a, b) => {
    return a.likelyToPurchase - b.likelyToPurchase;
  });
  console.log({ sortedItems });
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
              {sortedItems
                .filter((item) => item.name.includes(searchTerm))
                .map((item) => {
                  let itemStatus = '';
                  if (isInactive(item)) {
                    itemStatus = 'inactive';
                  } else {
                    itemStatus = howSoon(item.likelyToPurchase);
                  }
                  return (
                    <li key={item.name}>
                      <Flex>
                        <Label
                          aria-label={itemStatus}
                          htmlFor={item.name}
                          mb={2}
                        >
                          <Checkbox
                            id={item.name}
                            name={item.name}
                            aria-label={itemStatus}
                            onClick={markPurchased} // for older verions of IE
                            onChange={markPurchased}
                            checked={isChecked(item.purchaseDates)}
                            disabled={isDisabled(item.purchaseDates)}
                          />
                          {item.name}
                        </Label>
                        <span
                          className="delete"
                          onClick={() => deleteItem(item)}
                        >
                          delete
                        </span>
                      </Flex>
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
