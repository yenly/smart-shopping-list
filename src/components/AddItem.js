import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const AddItem = ({ addItem }) => {
  const [itemName, setItemName] = useState('');
  let history = useHistory();

  const onChangeItemName = (event) => {
    event.preventDefault();
    setItemName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    addItem(event);
    history.push('/list');
  };
  return (
    <div>
      <h2>Add item view</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="itemName">Name of Item</label> <br />
        <input
          id="itemName"
          value={itemName}
          onChange={onChangeItemName}
        />{' '}
        <br />
        <label htmlFor="likelyToPurchase">
          How soon are you likely to buy again?
        </label>
        <br />
        <select name="likelyToPurchase" id="likelyToPurchase">
          <option value="">--Please choose likelihood</option>
          <option value="7">Soon</option>
          <option value="14">Kind of soon</option>
          <option value="30">Not soon</option>
        </select>
        <br />
        <button>Add item to list</button>
      </form>
    </div>
  );
};

export default AddItem;
