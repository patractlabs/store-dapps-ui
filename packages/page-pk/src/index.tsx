import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { AccountProvider } from '@patract/react-components';

ReactDOM.render(
  <React.StrictMode>
    <AccountProvider>
      <App />
    </AccountProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
