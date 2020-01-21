import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import defaultStore from './stores/defaultStore';
import ussdChannelStore from './stores/ussdChannelStore';
import ussdStructureStore from './stores/ussdStrctureStore';

const stores = {
  defaultStore,
  ussdChannelStore,
  ussdStructureStore,
};

// For easier debugging
window._____APP_STATE_____ = stores;

ReactDOM.render(
  // eslint-disable-next-line
  <Provider {...stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
