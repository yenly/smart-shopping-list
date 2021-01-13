import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import ListItems from './components/ListItems';
import AddItem from './components/AddItem';
import Navigation from './components/Navigation';
import Home from './components/Home';
import getToken from './lib/tokens';

function App() {
  const [userToken, setUserToken] = useState('');

  const createUserToken = (event) => {
    event.preventDefault();
    const newToken = getToken();
    setUserToken(newToken);
    window.localStorage.setItem(
      'shoppingListAppUser',
      JSON.stringify(newToken),
    );
  };
  console.log({ userToken });
  return (
    <>
      <header>Smart Shopping List App</header>
      <Router>
        <main>
          <Switch>
            <Route path="/list">
              <ListItems />
            </Route>
            <Route path="/add">
              <AddItem />
            </Route>
            <Route exact path="/">
              {userToken ? (
                <Redirect to="/list" />
              ) : (
                <Home createUserToken={createUserToken} />
              )}
            </Route>
          </Switch>
        </main>
        <Navigation />
      </Router>
    </>
  );
}

export default App;
