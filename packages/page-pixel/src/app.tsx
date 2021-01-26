import React from 'react';
import { UIProvider } from '@patract/ui-components';
import Pixel from './pages/pixel';

function App() {
  return (
    <UIProvider>
      <Pixel />
    </UIProvider>
  );
}

export default App;
