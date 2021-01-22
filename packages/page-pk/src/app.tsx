import React from 'react';
import { UIProvider } from '@patract/ui-components';
import Header from './components/header';
import PK from './pages/pk';

function App() {
  return (
    <UIProvider>
      <Header />
      <PK />
    </UIProvider>
  );
}

export default App;
