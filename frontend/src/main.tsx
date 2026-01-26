import React from 'react';
import ReactDOM from 'react-dom/client';
// I import Provider so the entire app can access the Redux 'Global Memory'
import { Provider } from 'react-redux';
// I import our store that we configured earlier
import { store } from './store';
// I import App, which acts as the 'Traffic Controller' for our routes
import App from './App';
// I import the global CSS for our Glassmorphism variables
import './index.css';

// I tell React to find the 'root' div in your index.html and start the app there
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* I wrap the App in the Redux Provider so state is available everywhere */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);