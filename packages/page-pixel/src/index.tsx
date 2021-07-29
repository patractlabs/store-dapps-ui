import React from 'react';
import ReactDOM from 'react-dom';
import { Api, Queue, GraphqlProvider, AccountProvider } from '@patract/react-components';
import { UIProvider } from '@patract/ui-components';
import App from './app';
import { wsUrl } from '@patract/utils';

ReactDOM.render(
  <React.StrictMode>
    <GraphqlProvider>
      <UIProvider>
        <Queue>
          <Api url={wsUrl}>
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
