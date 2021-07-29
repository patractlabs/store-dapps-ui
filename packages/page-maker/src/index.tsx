import { AccountProvider, Api, Queue } from '@patract/react-components';
import { UIProvider } from '@patract/ui-components';
import { wsUrl } from '@patract/utils';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <UIProvider>
      <Queue>
        <Api url={wsUrl}>
          <AccountProvider>
            <App />
          </AccountProvider>
        </Api>
      </Queue>
    </UIProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
