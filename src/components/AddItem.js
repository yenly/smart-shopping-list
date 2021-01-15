import { useState } from 'react';
import { useHistory } from 'react-router-dom';
/** @jsx jsx */
import { jsx, Box, Label, Input, Radio, Button } from 'theme-ui';
import Notification from './Notification';

const AddItem = ({ addItem }) => {
  const [itemName, setItemName] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  let history = useHistory();

  const onChangeItemName = (event) => {
    event.preventDefault();
    setItemName(event.target.value);
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
          <Label htmlFor="soon" mb={3}>
            <Radio name="likelyToPurchase" id="soon" value="7" defaultChecked />{' '}
            Soon
          </Label>
          <Label htmlFor="kind-of-soon" mb={3}>
            <Radio name="likelyToPurchase" id="kind-of-soon" value="14" /> Kind
            of Soon
          </Label>
          <Label htmlFor="not-soon" mb={3}>
            <Radio name="likelyToPurchase" id="not-soon" value="30" /> Not Soon
          </Label>
        </fieldset>
        <Button>Add item</Button>
      </Box>
    </div>
  );
};

export default AddItem;
