import { Fragment } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
/** @jsx jsx */
import { jsx, Box, Label, Input, Radio, Button } from 'theme-ui';
import Notification from './Notification';

const RadioOptions = {
  soon: 7,
  'kind of soon': 14,
  'not soon': 30,
};

const AddItem = ({ addItem }) => {
  const [itemName, setItemName] = useState('');
  const [likelyToPurchase, setLikelyToPurchange] = useState(RadioOptions.soon);
  const [alertMsg, setAlertMsg] = useState('');
  let history = useHistory();

  const onChangeItemName = (event) => {
    setItemName(event.target.value);
  };

  const onChangeLikelyToPurchase = (event) => {
    setLikelyToPurchange(Number(event.target.value));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!event.target.itemName.value) {
      setAlertMsg({
        message: 'Please enter item name',
        msgType: 'danger',
      });
      setTimeout(() => {
        setAlertMsg('');
      }, 3000);
    } else {
      addItem(event);
      setItemName('');
      setLikelyToPurchange(7);
      setAlertMsg({
        message: 'Item added!',
        msgType: 'info',
      });
      setTimeout(() => {
        history.push('/list');
      }, 3000);
    }
  };
  return (
    <div>
      {alertMsg && (
        <Notification message={alertMsg.message} msgType={alertMsg.msgType} />
      )}
      <Box as="form" onSubmit={onSubmit}>
        <Label htmlFor="itemName">Item Name</Label>
        <Input
          mb={3}
          id="itemName"
          value={itemName}
          onChange={onChangeItemName}
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
  addItem: PropTypes.func.isRequired,
};

export default AddItem;
