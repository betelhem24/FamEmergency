import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // The "Plug"
import { store } from './store';        // The "Brain"
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*  I wrap App in Provider so every component can access the Brain */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);