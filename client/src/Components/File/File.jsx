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

  const configureComponent = (data) => {
    if (data.name == 'terminal') setComponent(<ReactTerminal fullScreen={fullScreen} />);
    if (data.type == 'webapp') setComponent(<WebApp content={data.content} fullScreen={fullScreen} />);
    if (data.type == 'pdf') setComponent(<Pdf_Viewer content={data.content} fullScreen={fullScreen} />);
    if (data.type == 'html') setComponent(<Html_Viewer content={data.content} fullScreen={fullScreen} />);
    if (data.type == 'png' || data.type == 'jpeg' || data.type == 'jpg')
      setComponent(<Image_Viewer content={data.content} fullScreen={fullScreen} />);
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
      if (html.style.transform) {
        var top = html.style.transform.split(',')[1].split('px')[0];
        return -1 * top + 'px';
      }
      return '0px';
    }
    return '0px';
  };
  const getLeft = () => {
    html = document.getElementById(id + 'File');

    if (html) {
      if (html.style.transform) {
        var left = html.style.transform.split(',')[0].split('(')[1].split('px')[0];

        return -1 * left + 'px';
      }
      return '0px';
    }
    return '0px';
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
                className="Topbar"
                onFocus={() => setdraggable(true)}
                onBlur={() => setdraggable(false)}
                style={{ backgroundColor: theme }}
                tabIndex="-1">
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
