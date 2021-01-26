import React from 'react';
import '@patract/store-sdk/dapp'

import { Api, Queue, GraphqlProvider, AccountProvider } from '@patract/react-components';
import { UIProvider } from '@patract/ui-components';

import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <GraphqlProvider>
      <UIProvider>
        <Queue>
          <Api url='wss://ws.staging.jupiter.patract.cn'>
            <AccountProvider>
              <App />
            </AccountProvider>
          </Api>
        </Queue>
      </UIProvider>
    </GraphqlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
