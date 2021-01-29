import React from 'react';
import { UIProvider } from '@patract/ui-components';
import PK from './pages/pk';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <UIProvider>
      <Router>
        <PK />
      </Router>
    </UIProvider>
  );
}

export default App;
