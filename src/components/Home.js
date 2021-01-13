import React from 'react';

const Home = ({ createUserToken }) => {
  return (
    <div>
      <h1>Welcome!</h1>
      <button onClick={createUserToken}>Create new list</button>
    </div>
  );
};

export default Home;
