import React, { useContext } from 'react';
import './Spotify.scss';
import Loader from '../Loader/Loader';
const Spotify = ({ content, fullScreen }) => {
  return (
    <div className="Spotify">
      <Loader />
      <iframe src={content} width="100%" height="100%"></iframe>
    </div>
  );
};
export default Spotify;
