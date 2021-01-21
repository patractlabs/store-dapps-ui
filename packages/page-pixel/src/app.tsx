import React from 'react';
import { ThemeProvider } from '@patract/ui-components';
import Header from './components/header';
import Pixel from './pages/pixel';

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Pixel />
    </ThemeProvider>
  );
}

export default App;
