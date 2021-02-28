import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthProvider from './Contexts/AuthContext';
import { ThemeProvider } from './Contexts/ThemeContext/ThemeContext';
import { DirectoryProvider } from './Contexts/DirectoryContext/DirectoryContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <DirectoryProvider>
          <App />
        </DirectoryProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
