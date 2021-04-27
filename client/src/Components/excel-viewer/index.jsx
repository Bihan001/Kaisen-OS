import React, { useContext } from 'react';
import './excel.scss';
import Loader from '../Loader/Loader';
const ExcelViewer = ({ content, fullScreen }) => {
  return (
    <div className="excel">
      <Loader />
      <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${content}`} width="100%" height="100%"></iframe>
    </div>
  );
};
export default ExcelViewer;
