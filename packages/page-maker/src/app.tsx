import React from 'react';
import { UIProvider } from '@patract/ui-components';
import Maker from './pages/maker';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <UIProvider>
      <Router>
        <Maker />
      </Router>
    </UIProvider>
  );
}

export default App;