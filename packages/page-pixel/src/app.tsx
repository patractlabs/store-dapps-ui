import { UIProvider } from '@patract/ui-components';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PaintIndex } from './pages/paint';

function App() {
  return (
    <UIProvider>
      <Router>
        <PaintIndex />
      </Router>
    </UIProvider>
  );
}

export default App;
