import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ScreenContext } from '../../Contexts/ScreenContext';
import { getLayout } from '../../Utility/functions';
import './Pdf_Viewer.scss';
import Loader from '../Loader/Loader';
const Pdf_Viewer = ({ content, fullScreen }) => {
  const { screenState } = useContext(ScreenContext);

  return (
    <motion.div
      className="Pdf_Viewer"
      initial={false}
      animate={{ width: getLayout(fullScreen, screenState).width, height: getLayout(fullScreen, screenState).height }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}>
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </motion.div>
  );
};
export default Pdf_Viewer;
