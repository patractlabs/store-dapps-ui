import React from 'react';

import { Api } from '@patract/react-components';
import { UIProvider } from '@patract/ui-components';
import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <UIProvider>
      <Api url='ws://192.168.50.10:9944'>
        <App />
      </Api>
    </UIProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
