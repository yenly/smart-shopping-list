import React, { useState, useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ThemeProvider } from 'theme-ui';
import sketchy from 'theme-ui-sketchy-preset';
import ListItems from './components/ListItems';
import AddItem from './components/AddItem';
import Navigation from './components/Navigation';
import Home from './components/Home';
import getToken from './lib/tokens';
import { FirebaseContext } from './components/Firebase';

function App() {
  const [userToken, setUserToken] = useState('');
  const firebase = useContext(FirebaseContext);
  const db = firebase.firestore();

  useEffect(() => {
    const userTokenInStorage = window.localStorage.getItem(
      'shoppingListAppUser',
    );
    setUserToken(userTokenInStorage);
  }, []);

  const createUserToken = () => {
    const newToken = getToken();
    setUserToken(newToken);
    window.localStorage.setItem('shoppingListAppUser', newToken);
  };
  const addItemToList = (event) => {
    event.preventDefault();
    const itemName = event.target.itemName.value;
    const likelyToPurchase = Number(event.target.likelyToPurchase.value);
    const newItem = {
      name: itemName.trim(),
      likelyToPurchase: likelyToPurchase,
      purchaseDate: null,
    };
    if (userToken) {
      db.collection(userToken)
        .add(newItem)
        .then((docRef) => console.log(`New item added: ${docRef.id}`))
        .catch((error) => console.error(`Error adding item: ${error}`));
    }
  };
  return (
    <ThemeProvider theme={sketchy}>
      <header>Smart Shopping List</header>
      <Router>
        <main>
          <Switch>
            <Route path="/list">
              {userToken ? (
                <ListItems userToken={userToken} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route path="/add">
              {!userToken ? (
                <Redirect to="/" />
              ) : (
                <AddItem addItem={addItemToList} />
              )}
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
    </ThemeProvider>
  );
}

export default App;
