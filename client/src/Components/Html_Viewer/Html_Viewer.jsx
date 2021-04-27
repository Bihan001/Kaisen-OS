import React, { useContext } from 'react';
import './Html_Viewer.scss';
import Loader from '../Loader/Loader';
const Html_Viewer = ({ content, fullScreen }) => {
  return (
    <div className="Html_Viewer">
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default Html_Viewer;
