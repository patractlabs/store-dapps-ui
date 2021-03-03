import { AccountProvider, Api, Queue } from '@patract/react-components';
import { UIProvider } from '@patract/ui-components';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <UIProvider>
      <Queue>
        <Api url='wss://new.staging.jupiter.patract.cn/'>
          <AccountProvider>
            <App />
          </AccountProvider>
        </Api>
      </Queue>
    </UIProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
