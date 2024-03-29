import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clone } from 'ramda';
import axios from 'axios';
import uuid from 'react-uuid';
import './Desktop.scss';
//import bgvideo from "../../assets/videos/bgvideo.mp4"

import { AuthContext } from '../../Contexts/AuthContext';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';
import { DirectoryContext } from '../../Contexts/DirectoryContext/DirectoryContext';

import Taskbar from '../../Components/TaskBar/Taskbar';
import Particular_File from '../../Components/File/File';
import File_Explorer from '../../Components/File_Explorer/File_Explorer';
import Tooltip from '../../Components/Tooltip/Tooltip';
import { backendUrl } from '../../backendUrl';

import arrow from '../../assets/icons/arrow.png';

import { Folder, File, ClassFolder, ClassFile } from '../../Classes/Classes';

import { handleIcon, fadeinTop, textTruncate } from '../../Utility/functions';

import StartMenu from './start-menu';
import { WallpaperContext } from '../../Contexts/WallpaperContext';

const Desktop = (props) => {
  const { user, setUser } = useContext(AuthContext);
  const { theme, ChangeTheme } = useContext(ThemeContext);
  const { changeWallpaper } = useContext(WallpaperContext);
  const { dirPaths, UpdatedirPaths } = useContext(DirectoryContext);

  const [openedfiles, setopenedfiles] = useState({});
  const [openedfolders, setopenedfolders] = useState({});

  /*const [folderZindex,setfolderZindex]=useState(0);
  const [fileZindex,setfileZindex]=useState(0);*/

  //tooltip============================
  const [tooltipTimerId, setTooltipTimerId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const [tooltipData, setTooltipData] = useState({
    name: '',
    dateModified: '',
    createdBy: '',
  });

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  //===================================

  const [maxValue, setMaxValue] = useState(1);

  //Utility Variables
  var newdir; //type:String
  var obj;
  var opened_dirPaths = {}; //This is not an array but a dirPath!!!
  var newId;
  //  var fileMaxZindex=0;
  // var folderMaxZindex=0;
  //=================

  const [wallpapers, setWallpapers] = useState([]);
  const [presentWallpaper, setPresentWallpaper] = useState(-1);
  //taskbar States============================================
  //const [showtaskbarfloatingcontents,setshowtaskbarfloatingcontents]=useState(false);
  const [showcolorpalatte, setshowcolorpalatte] = useState(false);
  const [showMenu, setshowmenu] = useState(false);
  //taskbar states==============================

  //Startmenu Clicked Outside Configs===
  const clickedOutsideRef = useRef(null);
  const handleClickOutside = (e) => {
    try {
      if (!clickedOutsideRef.current.contains(e.target) && !e.target.classList.contains('disableOutsideClick')) {
        setshowmenu(false);
      }
    } catch (err) {}
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  //====================================

  /* useEffect(() => {
    // if (!user) props.history.push('/login');
    const file = new Folder('Demo', Date.now(), Date.now(), {}, 'root#a', 'folder');
    console.log(file);
  }, []);*/

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${backendUrl}/api/auth/getAllWallpapers`,
    })
      .then((res) => {
        setWallpapers(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (wallpapers && user) {
      if (user.wallpaper) {
        for (let i in wallpapers) {
          if (wallpapers[i].id === user.wallpaper) {
            setPresentWallpaper(+i);
            break;
          }
        }
      } else setPresentWallpaper(0);
    }
  }, [wallpapers, user]);

  useEffect(() => {
    if (presentWallpaper >= 0 && wallpapers.length > 0 && user) {
      changeWallpaper(wallpapers[presentWallpaper].image);
    }
  }, [presentWallpaper]);

  //Functions
  const handleOpen = (data) => {
    opened_dirPaths = {};
    const fileTypes = ['exe', 'txt', 'mp3', 'mp4', 'webapp', 'pdf', 'mpeg', 'jpg', 'jpeg', 'xlsx', 'png'];
    if (data.type == 'folder') {
      //this works
      opened_dirPaths = clone(openedfolders);
      newId = uuid();
      opened_dirPaths[newId] = data;
      opened_dirPaths[newId].zindex = maxValue;
      setMaxValue(maxValue + 1);
      setopenedfolders(opened_dirPaths);
    } else if (fileTypes.includes(data.type)) {
      opened_dirPaths = clone(openedfiles);
      newId = uuid();
      opened_dirPaths[newId] = data;
      opened_dirPaths[newId].zindex = maxValue;
      setMaxValue(maxValue + 1);
      setopenedfiles(opened_dirPaths);
    }
  };

  const updatefilearray = (dirObj) => {
    setopenedfiles(dirObj);
  };
  const updatefolderarray = (dirObj) => {
    // console.log('asdasd');
    setopenedfolders(dirObj);
  };

  const handleZindex = (id, div) => {
    if (div == 'folder_div') {
      opened_dirPaths = clone(openedfolders);
      if (opened_dirPaths[id].zindex < maxValue) {
        opened_dirPaths[id].zindex = maxValue;
        setMaxValue(maxValue + 1);
        setopenedfolders(opened_dirPaths);
      }
    } else if (div == 'file_div') {
      // if(fileZindex<=folderZindex)
      // setfileZindex(folderZindex+1);
      opened_dirPaths = clone(openedfiles);
      if (opened_dirPaths[id].zindex < maxValue) {
        opened_dirPaths[id].zindex = maxValue;
        setMaxValue(maxValue + 1);
        setopenedfiles(opened_dirPaths);
      }
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (presentWallpaper !== -1 && wallpapers.length > 0) {
        const res = await axios.put(`${backendUrl}/api/auth/saveWallpaper/${wallpapers[presentWallpaper].id}`);
        console.log(res);
        localStorage.setItem('wallpaper', wallpapers[presentWallpaper].image);
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [presentWallpaper]);

  //==========

  return (
    <div
      className="Desktop"
      style={
        wallpapers.length > 0 && presentWallpaper >= 0
          ? {
              backgroundImage: `url(${wallpapers[presentWallpaper].image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }
          : {}
      }>
      {/* FOR WALLPAPERS LOADING TIME OPTIMIZATION -> START */}
      <div style={{ display: 'none' }}>
        {wallpapers.map((item) => (
          <>
            <img src={item.thumbnail} />
            <img src={item.image} />
          </>
        ))}
      </div>
      {/* FOR WALLPAPERS LOADING TIME OPTIMIZATION -> END */}

      <Tooltip isDesktopIcon showTooltip={showTooltip} tooltipPosition={tooltipPosition} tooltipData={tooltipData} />

      {/* <div className="bg-video">
                 <video className="bg-video-content" autoPlay muted loop>
                    <source src={bgvideo} type="video/mp4"/>
                     <source src={bgvideo} type="video/webm"/>
                            Browser is NOt Supported!!
                 </video>
            </div> */}

      {dirPaths !== null && (
        <div className="Desktop_Icons_div">
          {Object.keys(dirPaths).map((dir) => {
            newdir = dir.toString().split('#');
            newdir.pop();
            newdir.join('#');
            if (newdir == 'root')
              return (
                <div
                  className="Icons"
                  key={dirPaths[dir].path}
                  onTouchStart={() => handleOpen(dirPaths[dir])}
                  onDoubleClick={() => handleOpen(dirPaths[dir])}
                  onMouseOver={(e) => {
                    clearTimeout(tooltipTimerId);
                    setTooltipTimerId(
                      setTimeout(() => {
                        setShowTooltip(true);
                        setTooltipData({
                          name: dirPaths[dir].name,
                          type: dirPaths[dir].type,
                          createdBy: dirPaths[dir].editableBy.name,
                          dateModified: dirPaths[dir].dateModified,
                        });
                        setTooltipPosition({ x: e.clientX, y: e.clientY });
                      }, 500)
                    );
                  }}
                  onMouseOut={(e) => {
                    setShowTooltip(false);
                    clearTimeout(tooltipTimerId);
                  }}>
                  <img src={handleIcon(dirPaths[dir])} />
                  <div className="Icons__text">{textTruncate(dirPaths[dir].name, 9)}</div>
                </div>
              );
          })}
        </div>
      )}

      {openedfolders && (
        <div className="Folders_Window_div">
          <AnimatePresence>
            {Object.keys(openedfolders).map((id) => {
              if (!openedfolders[id].closed)
                return (
                  <File_Explorer
                    data={openedfolders[id]}
                    initialfolderpath={openedfolders[id].path}
                    folderarray={openedfolders}
                    updatefolderarray={updatefolderarray}
                    filearray={openedfiles}
                    updatefilearray={updatefilearray}
                    key={id}
                    handleZindex={handleZindex}
                    id={id}
                    zIndex={openedfolders[id].zindex}
                    maxZindex={maxValue}
                    updateOnlyZindex={() => setMaxValue(maxValue + 1)}
                  />
                );
            })}

            {/* {openedfolders.map((folder,index)=>(
                       <File_Explorer
                        data={folder}
                        folderarray={openedfolders}
                        updatefolderarray={updatefolderarray}
                        filearray={openedfiles}
                        updatefilearray={updatefilearray}
                        key={index}
                       />
                   ))} */}
          </AnimatePresence>
        </div>
      )}

      {openedfiles && (
        <div className="Files_Window_div">
          <AnimatePresence>
            {Object.keys(openedfiles).map((id) => {
              if (!openedfiles[id].closed)
                return (
                  <Particular_File
                    data={openedfiles[id]}
                    filearray={openedfiles}
                    updatefilearray={updatefilearray}
                    folderarray={openedfolders}
                    updatefolderarray={updatefolderarray}
                    handleZindex={handleZindex}
                    key={id}
                    id={id}
                    zIndex={openedfiles[id].zindex}
                    maxZindex={maxValue}
                    updateOnlyZindex={() => setMaxValue(maxValue + 1)}
                  />
                );
            })}
          </AnimatePresence>
        </div>
      )}
      {/* {openedfiles && (
               <div className="Files_Window_div">
                {openedfiles.map((file,index)=>(
                    <Particular_File 
                    data={file} 
                    filearray={openedfiles}
                    updatefilearray={updatefilearray}
                    key={index}
                    />
                ))}
               </div>
           )} */}

      <StartMenu
        user={user}
        setUser={setUser}
        showMenu={showMenu}
        wallpapers={wallpapers}
        presentWallpaper={presentWallpaper}
        setPresentWallpaper={setPresentWallpaper}
        handleOpen={handleOpen}
        handleIcon={handleIcon}
        maxZindex={maxValue}
        theme={theme}
        clickedOutsideRef={clickedOutsideRef}
      />

      {/* {showMenu && user && (
        <div className="Start_Menu " style={{ backgroundColor: theme, zIndex: maxValue }}>
          <div className="Info_n_Content">
            <div className="User_Info">
              <div className="dp_div">
                <img src={user.displayImage} />
              </div>
              <div className="User_Name">{user.name}</div>
            </div>
            <div className="StartMenu__Content StartMenu__Content__Scrollable">
              {startMenuContents.folders.map((content, idx) => (
                <div key={idx} className="StartMenu__Content__Data" onClick={() => handleOpen(content)}>
                  <img src={handleIcon(content)} />
                  <div>{content.name}</div>
                </div>
              ))}
              {startMenuContents.files.map((content, idx) => (
                <div key={idx} className="StartMenu__Content__Data" onClick={() => handleOpen(content)}>
                  <img src={handleIcon(content)} />
                  <div>{content.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="Wallpaper_n_Widgets">
            <div className="Wallpaper_n_Widgets__Top">
              <div>{wallpapers.length > 0 && <img src={wallpapers[presentWallpaper].image} />}</div>
              <div className="Left" onClick={handleWallpaperLeft}>
                <img src={arrow} />
              </div>
              <div className="Right" onClick={handleWallpaperRight}>
                <img src={arrow} />
              </div>
            </div>
            <div className="Wallpaper_n_Widgets__Bottom">Bottom</div>
          </div>
        </div>
      )} */}

      <AnimatePresence>
        {showcolorpalatte && (
          <motion.div
            className="Color_Palatte disableOutsideClick"
            style={{ backgroundColor: theme, zIndex: maxValue }}
            variants={fadeinTop}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className="Color_Palatte__First-div disableOutsideClick">Choose a Theme</div>
            <div className="Color_Palatte__Second-div disableOutsideClick">
              <div className="Pink disableOutsideClick" onClick={() => ChangeTheme('#F5CFCF')}></div>
              <div className="Purple disableOutsideClick" onClick={() => ChangeTheme('#D7BDE2')}></div>
              <div className="Teal disableOutsideClick" onClick={() => ChangeTheme('#40e0d0')}></div>
              <div className="Grey disableOutsideClick" onClick={() => ChangeTheme('#ABB2B9')}></div>
              <div
                className="Cyan disableOutsideClick"
                style={{ backgroundColor: 'cyan' }}
                onClick={() => ChangeTheme('#00FFFF')}></div>
              <div
                className="Gold disableOutsideClick"
                style={{ backgroundColor: 'gold' }}
                onClick={() => ChangeTheme('#D7BE69')}></div>
              <div
                className="Teal disableOutsideClick"
                style={{ backgroundColor: 'teal' }}
                onClick={() => ChangeTheme('#008080')}></div>
              <div
                className="Violet disableOutsideClick"
                style={{ backgroundColor: 'violet' }}
                onClick={() => ChangeTheme('#EE82EE')}></div>
              <div
                className="Orange disableOutsideClick"
                style={{ backgroundColor: 'orange' }}
                onClick={() => ChangeTheme('orange')}></div>
              <div
                className="Yellow disableOutsideClick"
                style={{ backgroundColor: 'yellow' }}
                onClick={() => ChangeTheme('#FFFF00')}></div>
              <div
                className="lime disableOutsideClick"
                style={{ backgroundColor: 'lime' }}
                onClick={() => ChangeTheme('#00FF00')}></div>
              <div
                className="Brown disableOutsideClick"
                style={{ backgroundColor: '#DEB887' }}
                onClick={() => ChangeTheme('#DEB887')}></div>
              <div
                className="Pink disableOutsideClick"
                style={{ backgroundColor: 'pink' }}
                onClick={() => ChangeTheme('#FFC0CB')}></div>
              <div
                className="CornSilk disableOutsideClick"
                style={{ backgroundColor: '#FFF8DC' }}
                onClick={() => ChangeTheme('#FFF8DC')}></div>
              <div
                className="#FA8072 disableOutsideClick"
                style={{ backgroundColor: '#FA8072' }}
                onClick={() => ChangeTheme('#FA8072')}></div>
              <div
                className="#ECF0F1 disableOutsideClick"
                style={{ backgroundColor: '#ECF0F1' }}
                onClick={() => ChangeTheme('#ECF0F1')}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Taskbar
        togglecolorpalatte={() => setshowcolorpalatte(!showcolorpalatte)}
        togglemenu={() => setshowmenu(!showMenu)}
        filearray={openedfiles}
        updatefilearray={updatefilearray}
        folderarray={openedfolders}
        updatefolderarray={updatefolderarray}
        zIndex={maxValue}
        clickedOutsideRef={clickedOutsideRef}
      />
    </div>
  );
};
export default Desktop;
