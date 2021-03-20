import React from 'react';
import './Video_Player.scss';
const Video_Player = ({ content, fullScreen }) => {
  return (
    <div className="Video_Player" style={fullScreen ? { width: '100vw', height: '87vh' } : {}}>
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default Video_Player;
