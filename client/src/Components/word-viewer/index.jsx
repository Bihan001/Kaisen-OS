import React, { useContext } from 'react';
import { ScreenContext } from '../../Contexts/ScreenContext';
import { getLayout } from '../../Utility/functions';
import './word.scss';
import Loader from '../Loader/Loader';
const WordViewer = ({ content, fullScreen }) => {
  const { screenState } = useContext(ScreenContext);

  return (
    <div className="word" style={getLayout(fullScreen, screenState)}>
      <Loader />
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${content}`}
        width="100%"
        height="100%"
        frameborder="0">
        This is an embedded{' '}
        <a target="_blank" href="http://office.com">
          Microsoft Office
        </a>{' '}
        document, powered by{' '}
        <a target="_blank" href="http://office.com/webapps">
          Office Online
        </a>
        .
      </iframe>
    </div>
  );
};
export default WordViewer;
