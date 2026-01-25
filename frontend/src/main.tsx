import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // New Tools
import { store } from './store';
import App from './App';
import Login from './Login'; // Import the placeholder we made
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/*  When URL is /register, show the App component */}
          <Route path="/register" element={<App />} />
          
          {/*  When URL is /login, show the Login component */}
          <Route path="/login" element={<Login />} />
          
          {/*  If someone goes to just "/", send them to /login automatically */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);