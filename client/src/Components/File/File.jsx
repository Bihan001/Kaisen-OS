import React, { useState, useEffect, useContext, useRef } from 'react';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';

import { motion } from 'framer-motion';
import { clone, set } from 'ramda';
import './File.scss';

import ReactTerminal from '../Terminal/Terminal';
import WebApp from '../WebApp/WebApp';
import Pdf_Viewer from '../Pdf_Viewer/Pdf_Viewer';
import Html_Viewer from '../Html_Viewer/Html_Viewer';
import Image_Viewer from '../Image_Viewer/Image_Viewer';
import Video_Player from '../Video_Player/Video_Player';
import Audio_Player from '../Audio_Player/Audio_Player';
import PptViewer from '../ppt-viewer';
import WordViewer from '../word-viewer';
import ExcelViewer from '../excel-viewer';
import TextViewer from '../text-viewer';
import FrostedGlass from '../../Utility/frosted-glass';

const expandObject = (obj) => {
  Object.keys(obj).map((key) => {
    let target = obj[key];
    delete obj[key];
    key.split(',').map((k) => (obj[k.trim()] = target));
  });
  return obj;
};

const Particular_File = ({ data, updatefilearray, filearray, handleZindex, id }) => {
  const { theme } = useContext(ThemeContext);

  const [state, setState] = useState(null);
  const [draggable, setdraggable] = useState(false);

  const [Component, setComponent] = useState(<></>);

  const [fullScreen, setfullScreen] = useState(false);

  //Utility Variables
  var tempfile;
  var opened_dirPaths;
  var html;
  //var Component;
  //=================
  useEffect(() => {
    setState(data);
    configureComponent(data);
    // console.log(Component);
  }, []);

  useEffect(() => {
    if (Component !== <></>) setState(data);
  }, [data.minimized]);

  useEffect(() => {
    configureComponent(data);
  }, [fullScreen]);

  useEffect(() =>
    //Updating the minimizing function
    {
      if (state) {
        opened_dirPaths = clone(filearray);

        if (opened_dirPaths[id]) {
          opened_dirPaths[id].minimized = state.minimized;
          updatefilearray(opened_dirPaths);
        }
      }
    }, [state]);

  const componentsMap = expandObject({
    exe: [{ terminal: <ReactTerminal fullScreen={fullScreen} id={id} /> }],
    webapp: <WebApp content={data.content} fullScreen={fullScreen} />,
    pdf: <Pdf_Viewer content={data.content} fullScreen={fullScreen} />,
    'ppt, pptx': <PptViewer content={data.content} fullScreen={fullScreen} />,
    'doc, docx': <WordViewer content={data.content} fullScreen={fullScreen} />,
    'xls, xlsx': <ExcelViewer content={data.content} fullScreen={fullScreen} />,
    html: <Html_Viewer content={data.content} fullScreen={fullScreen} />,
    'png, jpeg, jpg, bmp': <Image_Viewer content={data.content} fullScreen={fullScreen} />,
    'mp4, mkv': <Video_Player id={id} content={data.content} fullScreen={fullScreen} />,
    'mp3, mpeg': <Audio_Player id={id} content={data.content} fullScreen={fullScreen} />,
    txt: <TextViewer content={data.content} editableBy={data.editableBy} path={data.path} fullScreen={fullScreen} />,
  });

  const configureComponent = (data) => {
    console.log(componentsMap);
    if (Array.isArray(componentsMap[data.type])) {
      return setComponent(componentsMap[data.type][0][data.name]);
    }
    setComponent(componentsMap[data.type] || null);
  };

  const handleminizestatus = () =>
    //Updating the minimiziing Function
    {
      tempfile = clone(state);
      tempfile.minimized = !tempfile.minimized;

      setState(tempfile);
    };
  const handlecloseapp = () => {
    opened_dirPaths = {};
    opened_dirPaths = clone(filearray);
    if (opened_dirPaths[id]) {
      delete opened_dirPaths[id];
      //opened_dirPaths[state.path].closed=true;
      updatefilearray(opened_dirPaths);
    }
  };
  const FilehandleZindex = () => {
    handleZindex(id, 'file_div');
  };

  const getTop = () => {
    html = document.getElementById(id + 'File');

    if (html) {
      try {
        if (html.style.transform !== undefined) {
          var top = html.style.transform.split(',')[1].split('px')[0];
          return -1 * top + 'px';
        }
      } catch {
        return '0px';
      }
    }
  };
  const getLeft = () => {
    html = document.getElementById(id + 'File');

    if (html) {
      try {
        if (html.style.transform !== undefined) {
          var left = html.style.transform.split(',')[0].split('(')[1].split('px')[0];

          return -1 * left + 'px';
        }
      } catch {
        return '0px';
      }
    }
  };
  return (
    <>
      {state && (
        <>
          {!state.minimized && (
            <motion.div
              className="File"
              id={id + 'File'}
              style={
                !fullScreen
                  ? { width: 'fit-content', height: 'fit-content' }
                  : {
                      width: 'fit-content',
                      height: 'fit-content',
                      position: 'fixed',
                      top: getTop(),
                      left: getLeft(),
                      boxShadow: '0 0 0 black',
                    }
              }
              drag={!fullScreen ? draggable : false}
              dragElastic={0.3}
              dragConstraints={!fullScreen ? { left: -150, right: 500, top: -15, bottom: 10 } : {}}>
              <div
                className="Topbar Frosted_Glass"
                id={'topbar' + id}
                onFocus={() => setdraggable(true)}
                onBlur={() => setdraggable(false)}
                tabIndex="-1">
                <FrostedGlass frostId={'topbar' + id} opacityHex="99" showMargin={false} />
                <div className="Topbar__Zindex_handler" onClick={FilehandleZindex}></div>
                <div className="Window_Buttons">
                  <div className="Green" onClick={handleminizestatus}></div>
                  <div className="Yellow" onClick={() => setfullScreen(!fullScreen)}>
                    {' '}
                  </div>
                  <div className="Red" onClick={handlecloseapp}></div>
                </div>
              </div>
              <div className="File_Config_Window" onClick={FilehandleZindex}>
                {Component}
              </div>
            </motion.div>
          )}
        </>
      )}
    </>
  );
};
export default Particular_File;
