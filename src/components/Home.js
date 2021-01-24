import React, { useState } from 'react';
import { Button, Label, Input, Box } from 'theme-ui';
import PropTypes from 'prop-types';

const Home = ({ createUserToken, submitListToken }) => {
  const [listToken, setListToken] = useState('');

  const onChangeListToken = (event) => {
    setListToken(event.target.value);
  };

  return (
    <div>
      <h1>Welcome!</h1>
      <Button onClick={createUserToken}>Create new list</Button>

      <h3>OR</h3>
      <p>Join an existing shopping list by entering a three word token</p>

      <Box as="form" onSubmit={submitListToken}>
        <Label htmlFor="listToken">Share token</Label>
        <Input
          mb={3}
          id="listToken"
          value={listToken}
          onChange={onChangeListToken}
        />
        <Button type="submit">Join an existing item</Button>
      </Box>
    </div>
  );
};

Home.propTypes = {
  createUserToken: PropTypes.func.isRequired,
  submitListToken: PropTypes.func.isRequired,
};

export default Home;
