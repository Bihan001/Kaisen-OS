import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthProvider from './Contexts/AuthContext';
import { ThemeProvider } from './Contexts/ThemeContext/ThemeContext';
import { DirectoryProvider } from './Contexts/DirectoryContext/DirectoryContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import NotificationProvider from './Contexts/NotificationContext';
import { WallpaperProvider } from './Contexts/WallpaperContext';

axios.defaults.withCredentials = true;

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <WallpaperProvider>
          <DirectoryProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </DirectoryProvider>
        </WallpaperProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
