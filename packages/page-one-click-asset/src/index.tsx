import React from 'react';

import { Api, Queue, GraphqlProvider, AccountProvider } from '@patract/react-components';
import { UIProvider } from '@patract/ui-components';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <GraphqlProvider>
      <UIProvider>
        <Queue>
          <Api url='wss://ws.staging.jupiter.patract.cn'>
            <AccountProvider>
              <Router>
                <App />
              </Router>
            </AccountProvider>
          </Api>
        </Queue>
      </UIProvider>
    </GraphqlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
