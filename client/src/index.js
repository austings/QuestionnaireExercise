import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Admin from './Admin'; 
import App from './App';
import Login from './Login';
import Dashboard from './Dashboard'; 
import Questionnaire from './Questionnaire';
import ProtectedRoute from './components/ProtectedRoute'; // import this

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename='/bioverse'>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questionnaire/:id" element={<Questionnaire />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Admin page route with protection */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
