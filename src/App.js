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
import Notification from './components/Notification';

function App() {
  const [userToken, setUserToken] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
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

  const submitListToken = (event) => {
    event.preventDefault();
    const listToken = event.target.listToken.value;
    const list = db.collection(listToken);
    list.get().then((doc) => {
      if (!doc.empty) {
        setUserToken(listToken.trim());
        window.localStorage.setItem('shoppingListAppUser', listToken);
      } else {
        setAlertMsg({
          message: 'Token does not exist. Please try again or create new list.',
          msgType: 'danger',
        });
        setTimeout(() => {
          setAlertMsg('');
        }, 3000);
      }
    });
  };

  return (
    <ThemeProvider theme={sketchy}>
      <header>Smart Shopping List</header>
      <Router>
        <main>
          {alertMsg && (
            <Notification
              message={alertMsg.message}
              msgType={alertMsg.msgType}
            />
          )}
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
                <AddItem userToken={userToken} setAlertMsg={setAlertMsg} />
              )}
            </Route>
            <Route exact path="/">
              {userToken ? (
                <Redirect to="/list" />
              ) : (
                <Home
                  createUserToken={createUserToken}
                  submitListToken={submitListToken}
                />
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
