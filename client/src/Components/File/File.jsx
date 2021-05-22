import React, { useState, useEffect, useContext, useRef } from 'react';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';
import { ScreenContext } from '../../Contexts/ScreenContext';

import { motion, useDragControls } from 'framer-motion';
import { clone, set } from 'ramda';
import './File.scss';

import { handleIcon, getLayout } from '../../Utility/functions';

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
import VsCode from '../VsCode/VsCode';
import Spotify from '../Spotify/Spotify';
import Todoist from '../Todoist/Todoist';
import Calculator from '../calculator';
import FrostedGlass from '../../Utility/frosted-glass';

const expandObject = (obj) => {
  Object.keys(obj).map((key) => {
    let target = obj[key];
    delete obj[key];
    key.split(',').map((k) => (obj[k.trim()] = target));
  });
  return obj;
};

const Particular_File = ({
  data,
  updatefilearray,
  filearray,
  handleZindex,
  id,
  folderarray,
  updatefolderarray,
  zIndex,
}) => {
  const { theme } = useContext(ThemeContext);
  const { screenState } = useContext(ScreenContext);

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

  useEffect(() => {
    if (data.name == 'terminal' && data.type == 'exe') configureComponent(data);
  }, [filearray, folderarray]);

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
    exe: [
      {
        terminal: (
          <ReactTerminal
            fullScreen={fullScreen}
            id={id}
            filearray={filearray}
            updatefilearray={updatefilearray}
            folderarray={folderarray}
            updatefolderarray={updatefolderarray}
          />
        ),
        VsCode: <VsCode content={data.content} fullScreen={fullScreen} />,
        Spotify: <Spotify content={data.content} fullScreen={fullScreen} />,
        Todoist: <Todoist content={data.content} fullScreen={fullScreen} />,
        Calculator: <Calculator />,
      },
    ],
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
    //console.log(componentsMap);
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
          let top = html.style.transform.split(',')[1].split('px')[0];
          return -1 * top + 'px';
        }
      } catch {
        return '0px';
      }
    }
  };
  const getLeft = () => {
    html = document.getElementById(id + 'File');
    console.log('getLeft called !');
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

  const dragControls = useDragControls();

  const startDrag = (event) => {
    setdraggable(true);
    dragControls.start(event, { snapToCursor: false });
  };

  return (
    <>
      {state && (
        <>
          <motion.div
            className="File"
            id={id + 'File'}
            style={
              !fullScreen
                ? {
                    width: getLayout(fullScreen, screenState).width,
                    height: getLayout(fullScreen, screenState).height,
                    display: !data.minimized ? 'initial' : 'none',
                    zIndex: zIndex,
                    transformOrigin: '50% 50% 0px',
                  }
                : {
                    width: getLayout(fullScreen, screenState).width,
                    height: getLayout(fullScreen, screenState).height,
                    position: 'fixed',
                    // top: getTop(),
                    // left: getLeft(),
                    display: !data.minimized ? 'initial' : 'none',
                    zIndex: zIndex,
                  }
            }
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              fullScreen
                ? {
                    top: getTop(),
                    left: getLeft(),
                    width: getLayout(fullScreen, screenState).width,
                    height: getLayout(fullScreen, screenState).height,
                    opacity: 1,
                    scale: 1,
                  }
                : {
                    width: getLayout(fullScreen, screenState).width,
                    height: getLayout(fullScreen, screenState).height,
                    opacity: 1,
                    scale: 1,
                  }
            }
            transition={{ type: 'spring', stiffness: 300, damping: 40, duration: 3 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            drag={!fullScreen ? draggable : false}
            dragControls={dragControls}
            dragConstraints={!fullScreen ? { left: -500, right: 500, top: -30, bottom: 500 } : {}}
            dragElastic={false}
            dragMomentum={false}>
            <div className="Frosted_Glass Topbar" id={'topbar' + id} onPointerDown={(e) => startDrag(e)} tabIndex="-1">
              <FrostedGlass frostId={'topbar' + id} opacityHex="99" showMargin={false} />
              <div className="Topbar__Zindex_handler" onClick={FilehandleZindex}>
                <div className="Topbar__Zindex_handler_Icon">
                  <img src={handleIcon(data)} />
                </div>
                <div className="Topbar__Zindex_handler_Name">{data.name + '.' + data.type}</div>
              </div>

              <div className="Window_Buttons">
                <div className="Green" onClick={handleminizestatus}></div>
                <div className="Yellow" onClick={() => setfullScreen(!fullScreen)}>
                  {' '}
                </div>
                <div className="Red" onClick={handlecloseapp}></div>
              </div>
            </div>
            <div className="File_Config_Window" onClick={FilehandleZindex} onPointerDown={(e) => setdraggable(false)}>
              {Component}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};
export default Particular_File;
