import React from 'react';
import ReactDOM from 'react-dom';
import { Account } from '@patract/react-components';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <Account url="">
      <App />
    </Account>
  </React.StrictMode>,
  document.getElementById('root')
);
