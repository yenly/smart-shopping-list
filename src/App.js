import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import MessageFirebase from './components/MessageFirebase';
import ListItems from './components/ListItems';
import AddItem from './components/AddItem';
import Navigation from './components/Navigation';

function App() {
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
              <MessageFirebase />
            </Route>
          </Switch>
        </main>
        <Navigation />
      </Router>
    </>
  );
}

export default App;
