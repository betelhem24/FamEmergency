import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import type { RootState } from './store';
import { SocketProvider } from './context/SocketContext';
import App from './App';
import './index.css';

const AppWithSocket = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <SocketProvider token={token}>
      <App />
    </SocketProvider>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <AppWithSocket />
      </Provider>
    </React.StrictMode>
  );
}