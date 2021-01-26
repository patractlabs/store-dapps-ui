import React from 'react';
import ReactDOM from 'react-dom';
import { AccountProvider } from '@patract/react-components';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <AccountProvider>
      <App />
    </AccountProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
