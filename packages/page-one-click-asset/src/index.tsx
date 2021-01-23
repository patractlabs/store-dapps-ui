import React from 'react';

import { Api } from '@patract/react-components';
import Queue from '@patract/react-components/status/queue';
import { UIProvider } from '@patract/ui-components';

import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
