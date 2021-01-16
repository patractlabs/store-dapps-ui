import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@patract/ui-components';
import Header from './components/header';
import Swap from './pages/swap';
import Pool from './pages/pool';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/swap">
            <Swap />
          </Route>
          <Route path="/pool">
            <Pool />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
