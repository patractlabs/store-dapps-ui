import { AccountProvider, Api, GraphqlProvider, Queue } from '@patract/react-components';
import { UIProvider } from '@patract/ui-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <GraphqlProvider>
      <UIProvider>
        <Queue>
          <Api url='wss://ws.jupiter-poa.patract.cn/'>
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
