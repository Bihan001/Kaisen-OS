import React, { useContext } from 'react';

import { ScreenContext } from '../../Contexts/ScreenContext';
import { getLayout } from '../../Utility/functions';
import './Image_Viewer.scss';
import Loader from '../Loader/Loader';
const Image_Viewer = ({ content, fullScreen }) => {
  const { screenState } = useContext(ScreenContext);

  return (
    <div className="Image_Viewer" style={getLayout(fullScreen, screenState)}>
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default Image_Viewer;
