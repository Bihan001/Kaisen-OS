import React, { useContext } from 'react';

import './WebApp.scss';
import Loader from '../Loader/Loader';
const WebApp = ({ content, fullScreen }) => {
  return (
    <div className="WebApp">
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default WebApp;
