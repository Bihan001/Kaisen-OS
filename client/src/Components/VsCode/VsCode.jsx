import React, { useContext } from 'react';
import './VsCode.scss';
import Loader from '../Loader/Loader';
const VsCode = ({ content, fullScreen }) => {
  return (
    <div className="VsCode">
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default VsCode;
