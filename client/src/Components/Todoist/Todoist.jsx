import React, { useContext } from 'react';
import './Todoist.scss';
import Loader from '../Loader/Loader';
const Todoist = ({ content, fullScreen }) => {
  return (
    <div className="Todoist">
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default Todoist;
