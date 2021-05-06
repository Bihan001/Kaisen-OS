import React, { useState, useEffect, useContext } from 'react';
import { clone } from 'ramda';
import './Taskbar.scss';

import { handleIcon } from '../../Utility/functions';

import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';
import FrostedGlass from '../../Utility/frosted-glass';
import Clock from '../../pages/Desktop/widgets/clock';

const Taskbar = ({
  togglecolorpalatte,
  togglemenu,
  filearray,
  updatefilearray,
  folderarray,
  updatefolderarray,
  zIndex,
}) => {
  //Utility Variables
  var obj;
  var opened_dirPaths;
  var newpath;
  //===================

  const { theme, ChangeTheme } = useContext(ThemeContext);
  const [buttonthemes, setbuttonthemes] = useState({
    color: 'black',
  });

  const handlerestoresize = (data, id) => {
    opened_dirPaths = {};
    if (data.type == 'folder') {
      opened_dirPaths = clone(folderarray);
      if (opened_dirPaths[id]) {
        opened_dirPaths[id].minimized = false;
        updatefolderarray(opened_dirPaths);
      }
    } else {
      opened_dirPaths = clone(filearray);
      if (opened_dirPaths[id]) {
        opened_dirPaths[id].minimized = false;
        updatefilearray(opened_dirPaths);
      }
    }
  };

  return (
    <div className="Taskbar Frosted_Glass" id="taskbar" style={{ zIndex: zIndex + 1 }}>
      <FrostedGlass frostId="taskbar" opacityHex="77" />
      <div className="Apps_N_Info">
        <div
          className="Kaisen_Button disableOutsideClick"
          style={buttonthemes}
          onMouseEnter={() => setbuttonthemes({ color: theme })}
          onMouseLeave={() => setbuttonthemes({ color: 'black' })}
          onClick={togglemenu}>
          {/* <img className="Kaisen_Button_Image disableOutsideClick" src={k_svg} style={{ fill: 'red' }} /> */}
          <Start_Button color={buttonthemes} />
        </div>

        <div className="Icons">
          {Object.keys(filearray).map((id) => {
            if (filearray[id].minimized)
              return (
                <img src={handleIcon(filearray[id])} key={id} onClick={() => handlerestoresize(filearray[id], id)} />
              );
          })}

          {Object.keys(folderarray).map((id) => {
            if (folderarray[id].minimized)
              return (
                <img
                  src={handleIcon(folderarray[id])}
                  key={id}
                  onClick={() => handlerestoresize(folderarray[id], id)}
                />
              );
          })}
        </div>
      </div>

      <div className="Time_N_Color">
        <div className="Color_div">
          <div
            className="palatte_icon disableOutsideClick"
            style={{ backgroundColor: theme }}
            onClick={togglecolorpalatte}></div>
        </div>
        <div></div>
      </div>
    </div>
  );
};
export const Start_Button = ({ color }) => {
  return (
    <svg
      id="Capa_1"
      className="Kaisen_Button_Image disableOutsideClick"
      enable-background="new 0 0 512 512"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill={color.color}>
      <g id="K" className="disableOutsideClick">
        <path
          className="disableOutsideClick"
          d="m485.006 0h-167.812l-168.252 189.774v-189.774h-124.043v512h124.043v-155.058l58.198-61.215 122.344 216.273h157.617l-193.227-307.24z"
        />
      </g>
    </svg>
  );
};
export default Taskbar;
