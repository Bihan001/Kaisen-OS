import React, { useContext } from 'react';
import { ScreenContext } from '../../Contexts/ScreenContext';
import './Pdf_Viewer.scss';
import Loader from '../Loader/Loader';
const Pdf_Viewer = ({ content, fullScreen }) => {
  const { screenState } = useContext(ScreenContext);
  const getLayout = () => {
    if (fullScreen) return { width: '100vw', height: '87vh' };
    else if (screenState.mobileView) return { width: '90vw', height: '60vh' };
    else return {};
  };
  return (
    <div className="Pdf_Viewer" style={getLayout()}>
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default Pdf_Viewer;
