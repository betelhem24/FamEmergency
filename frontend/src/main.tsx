import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import App from './App';
import Login from './Login';
import ProtectedRoute from './components/ProtectedRoute'; // Word: Import our Guard
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Word-by-Word: We WRAP the App component inside the ProtectedRoute guard */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/login" element={<Login />} />
          {/* Word: Registration is public, so no guard here */}
          <Route path="/register" element={<App />} /> 
          
          {/* Word: Fallback to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);