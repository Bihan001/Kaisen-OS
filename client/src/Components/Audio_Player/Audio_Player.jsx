import React from 'react';
import './Audio_Player.scss';
import Loader from '../Loader/Loader';
const Audio_Player = ({ content, fullScreen }) => {
  return (
    <div className="Audio_Player" style={fullScreen ? { width: '100vw', height: '87vh' } : {}}>
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default Audio_Player;
