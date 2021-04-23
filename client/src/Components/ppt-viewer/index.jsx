import React, { useContext } from 'react';
import { ScreenContext } from '../../Contexts/ScreenContext';
import './ppt.scss';
import Loader from '../Loader/Loader';
const PptViewer = ({ content, fullScreen }) => {
  const { screenState } = useContext(ScreenContext);
  const getLayout = () => {
    if (fullScreen) return { width: '100vw', height: '87vh' };
    else if (screenState.mobileView) return { width: '90vw', height: '60vh' };
    else return {};
  };
  return (
    <div className="ppt" style={getLayout()}>
      <Loader />
      <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${content}`} width="100%" height="100%"></iframe>
    </div>
  );
};
export default PptViewer;
