import React, { useContext } from 'react';
import { ScreenContext } from '../../Contexts/ScreenContext';
import { getLayout } from '../../Utility/functions';
import './ppt.scss';
import Loader from '../Loader/Loader';
const PptViewer = ({ content, fullScreen }) => {
  const { screenState } = useContext(ScreenContext);

  return (
    <div className="ppt" style={getLayout(fullScreen, screenState)}>
      <Loader />
      <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${content}`} width="100%" height="100%"></iframe>
    </div>
  );
};
export default PptViewer;
