import React from 'react';
import { ThemeProvider } from '@patract/ui-components';
import Header from './components/header';
import PK from './pages/pk';

function App() {
  return (
    <ThemeProvider>
      <Header />
      <PK />
    </ThemeProvider>
  );
}

export default App;
