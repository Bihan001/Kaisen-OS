import React from 'react';
import './Pdf_Viewer.scss';
const Pdf_Viewer = ({ content, fullScreen }) => {
  return (
    <div className="Pdf_Viewer" style={fullScreen ? { width: '100vw', height: '87vh' } : {}}>
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default Pdf_Viewer;
