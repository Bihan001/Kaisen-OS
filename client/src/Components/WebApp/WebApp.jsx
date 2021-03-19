import React from 'react';
import './WebApp.scss';
const WebApp = ({ content, fullScreen }) => {
  return (
    <div className="WebApp" style={fullScreen ? { width: '100vw', height: '87vh' } : {}}>
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default WebApp;
