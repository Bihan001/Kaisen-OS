import React, { useContext } from 'react';
import { motion } from 'framer-motion';

import { ScreenContext } from '../../Contexts/ScreenContext';
import { getLayout } from '../../Utility/functions';
import './WebApp.scss';
import Loader from '../Loader/Loader';
const WebApp = ({ content, fullScreen }) => {
  const { screenState } = useContext(ScreenContext);

  return (
    <div className="WebApp">
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default WebApp;
