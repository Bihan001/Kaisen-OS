import React from 'react';
import './WebApp.scss';
import Loader from '../Loader/Loader';
const WebApp = ({ content, fullScreen }) => {
  return (
    <div className="WebApp" style={fullScreen ? { width: '100vw', height: '87vh' } : {}}>
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default WebApp;
