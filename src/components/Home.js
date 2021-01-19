import React from 'react';
import { Button } from 'theme-ui';
import PropTypes from 'prop-types';

const Home = ({ createUserToken }) => {
  return (
    <div>
      <h1>Welcome!</h1>
      <Button onClick={createUserToken}>Create new list</Button>
    </div>
  );
};

Home.propTypes = {
  createUserToken: PropTypes.func.isRequired,
};

export default Home;
