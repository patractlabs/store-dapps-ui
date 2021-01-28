import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { UIProvider } from '@patract/ui-components';
import Swap from './pages/swap';
import Pool from './pages/pool';

function App() {
  return (
    <UIProvider>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Redirect to='/swap' />
          </Route>
          <Route path='/swap'>
            <Swap />
          </Route>
          <Route path='/pool'>
            <Pool />
          </Route>
        </Switch>
      </Router>
    </UIProvider>
  );
}

export default App;
