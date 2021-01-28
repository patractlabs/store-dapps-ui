import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { UIProvider } from '@patract/ui-components';
import Paint from './pages/paint';
import CanvasList from './pages/canvas-list';

function App() {
  return (
    <UIProvider>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Redirect to='/list' />
          </Route>
          <Route path='/list'>
            <CanvasList />
          </Route>
          <Route path='/paint/:editingId'>
            <Paint />
          </Route>
          <Route path='/paint' exact>
            <Paint />
          </Route>
        </Switch>
      </Router>
    </UIProvider>
  );
}

export default App;
