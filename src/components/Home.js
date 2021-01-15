import React from 'react';
import { Button } from 'theme-ui';

const Home = ({ createUserToken }) => {
  return (
    <div>
      <h1>Welcome!</h1>
      <Button onClick={createUserToken}>Create new list</Button>
    </div>
  );
};

export default Home;
