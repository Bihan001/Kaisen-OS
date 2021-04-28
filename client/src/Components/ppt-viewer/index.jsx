import React, { useContext } from 'react';
import './ppt.scss';
import Loader from '../Loader/Loader';
const PptViewer = ({ content, fullScreen }) => {
  return (
    <div className="ppt">
      <Loader />
      <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${content}`} width="100%" height="100%"></iframe>
    </div>
  );
};
export default PptViewer;
