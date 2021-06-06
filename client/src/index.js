import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthProvider from './Contexts/AuthContext';
import { ThemeProvider } from './Contexts/ThemeContext/ThemeContext';
import { DirectoryProvider } from './Contexts/DirectoryContext/DirectoryContext';
import { ScreenProvider } from './Contexts/ScreenContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import NotificationProvider from './Contexts/NotificationContext';
import { WallpaperProvider } from './Contexts/WallpaperContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

axios.defaults.withCredentials = true;

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <ScreenProvider>
        <ThemeProvider>
          <WallpaperProvider>
            <DirectoryProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </DirectoryProvider>
          </WallpaperProvider>
        </ThemeProvider>
      </ScreenProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
reportWebVitals();
