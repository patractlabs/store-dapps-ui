import React from 'react';
import { UIProvider } from '@patract/ui-components';
import Header from './components/header';
import Pixel from './pages/pixel';

function App() {
  return (
    <UIProvider>
      <Header />
      <Pixel />
    </UIProvider>
  );
}

export default App;
