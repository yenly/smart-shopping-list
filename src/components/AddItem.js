import { Fragment } from 'react';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
/** @jsx jsx */
import { jsx, Box, Label, Input, Radio, Button } from 'theme-ui';
import { FirebaseContext } from './Firebase';

const RadioOptions = {
  soon: 7,
  'kind of soon': 14,
  'not soon': 30,
};

const AddItem = ({ userToken, setAlertMsg }) => {
  const [itemName, setItemName] = useState('');
  const [likelyToPurchase, setLikelyToPurchange] = useState(RadioOptions.soon);
  const firebase = useContext(FirebaseContext);
  const db = firebase.firestore();
  let history = useHistory();

  const onChangeItemName = (event) => {
    setItemName(event.target.value);
  };

  const onChangeLikelyToPurchase = (event) => {
    setLikelyToPurchange(Number(event.target.value));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (event.target.itemName.value) {
      const itemName = event.target.itemName.value;
      const likelyToPurchase = Number(event.target.likelyToPurchase.value);
      const newItem = {
        name: itemName.trim(),
        likelyToPurchase: likelyToPurchase,
        purchaseDate: null,
      };
      if (userToken) {
        const itemRef = db.collection(userToken);
        const snapshot = await itemRef.where('name', '==', itemName).get();

        if (!snapshot.empty) {
          setAlertMsg({
            message: `${itemName} is already on the list.`,
            msgType: 'danger',
          });
          setItemName('');
          setTimeout(() => {
            setAlertMsg('');
          }, 3000);
        } else {
          db.collection(userToken)
            .add(newItem)
            .then((docRef) => console.log(`New item added: ${docRef.id}`))
            .catch((error) => console.error(`Error adding item: ${error}`));
          setAlertMsg({
            message: 'Item added!',
            msgType: 'info',
          });
          setItemName('');
          setLikelyToPurchange(7);
          setTimeout(() => {
            setAlertMsg('');
            history.push('/list');
          }, 2000);
        }
      }
    }
  };
  return (
    <div>
      <Box as="form" onSubmit={onSubmit}>
        <Label htmlFor="itemName">Item Name</Label>
        <Input
          mb={3}
          id="itemName"
          value={itemName}
          onChange={onChangeItemName}
          required
        />
        <Label htmlFor="likelyToPurchase">
          How soon are you likely to buy again?
        </Label>
        <fieldset>
          {Object.entries(RadioOptions).map(([radioOption, radioValue]) => (
            <Fragment key={radioOption}>
              <Label htmlFor={radioOption} mb={3}>
                <Radio
                  name="likelyToPurchase"
                  id={radioOption}
                  onChange={onChangeLikelyToPurchase}
                  checked={likelyToPurchase === radioValue}
                  value={radioValue}
                />{' '}
                {radioOption}
              </Label>
            </Fragment>
          ))}
        </fieldset>
        <Button>Add item</Button>
      </Box>
    </div>
  );
};

AddItem.propTypes = {
  userToken: PropTypes.string.isRequired,
  setAlertMsg: PropTypes.func.isRequired,
};

export default AddItem;
