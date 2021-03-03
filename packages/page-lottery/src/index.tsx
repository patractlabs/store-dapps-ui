import { AccountProvider, Api, GraphqlProvider, Queue } from '@patract/react-components';
import { UIProvider } from '@patract/ui-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app';
import { Provider } from './provider';

ReactDOM.render(
  <React.StrictMode>
    <GraphqlProvider>
      <UIProvider>
        <Queue>
          <Api url='wss://new.staging.jupiter.patract.cn/'>
            <AccountProvider>
              <Provider>
                <Router>
                  <App />
                </Router>
              </Provider>
            </AccountProvider>
          </Api>
        </Queue>
      </UIProvider>
    </GraphqlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
