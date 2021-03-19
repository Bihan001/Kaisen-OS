import React from 'react';
import './Image_Viewer.scss';
const Image_Viewer = ({ content, fullScreen }) => {
  return (
    <div className="Image_Viewer" style={fullScreen ? { width: '100vw', height: '87vh' } : {}}>
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default Image_Viewer;
