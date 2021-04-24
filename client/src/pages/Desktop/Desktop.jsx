import React, { useState, useEffect, useRef, useContext } from 'react';
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
import { backendUrl } from '../../backendUrl';

import arrow from '../../assets/icons/arrow.png';

import { Folder, File, ClassFolder, ClassFile } from '../../Classes/Classes';

import { handleIcon } from '../../Utility/functions';

import Notification from '../../Components/notification';
import { NotificationContext } from '../../Contexts/NotificationContext';
import StartMenu from './start-menu';
import { WallpaperContext } from '../../Contexts/WallpaperContext';

const Desktop = (props) => {
  const { user, setUser } = useContext(AuthContext);
  const { theme, ChangeTheme } = useContext(ThemeContext);
  const { changeWallpaper } = useContext(WallpaperContext);
  const { dirPaths, UpdatedirPaths } = useContext(DirectoryContext);
  const { notifications, removeNotification } = useContext(NotificationContext);

  const [openedfiles, setopenedfiles] = useState({});
  const [openedfolders, setopenedfolders] = useState({});

  /*const [folderZindex,setfolderZindex]=useState(0);
  const [fileZindex,setfileZindex]=useState(0);*/

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
    const fileTypes = ['exe', 'txt', 'mp3', 'mp4', 'webapp', 'pdf', 'mpeg'];
    if (data.type == 'folder') {
      //this works
      opened_dirPaths = clone(openedfolders);
      newId = uuid();
      opened_dirPaths[newId] = data;
      setopenedfolders(opened_dirPaths);
    } else if (fileTypes.includes(data.type)) {
      opened_dirPaths = clone(openedfiles);
      newId = uuid();
      opened_dirPaths[newId] = data;
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
      <div style={{ position: 'absolute', right: 5, bottom: 60, zIndex: maxValue }}>
        {Object.keys(notifications).map((key) => (
          <Notification
            key={key}
            id={key}
            type={notifications[key].type}
            heading={notifications[key].heading}
            description={notifications[key].description}
            removeNotification={removeNotification}
          />
        ))}
      </div>
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
                <div className="Icons" key={dirPaths[dir].path} onClick={() => handleOpen(dirPaths[dir])}>
                  <img src={handleIcon(dirPaths[dir])} />
                  <div className="Icons__text">{dirPaths[dir].name}</div>
                </div>
              );
          })}
        </div>
      )}

      {openedfolders && (
        <div className="Folders_Window_div">
          {Object.keys(openedfolders).map((id) => {
            if (!openedfolders[id].closed)
              return (
                <div className="border" style={{ zIndex: openedfolders[id].zindex, position: 'relative' }} key={id}>
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
                  />
                </div>
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
        </div>
      )}

      {openedfiles && (
        <div className="Files_Window_div">
          {Object.keys(openedfiles).map((id) => {
            if (!openedfiles[id].closed)
              return (
                <div className="border" style={{ zIndex: openedfiles[id].zindex, position: 'relative' }} key={id}>
                  <Particular_File
                    data={openedfiles[id]}
                    filearray={openedfiles}
                    updatefilearray={updatefilearray}
                    folderarray={openedfolders}
                    updatefolderarray={updatefolderarray}
                    handleZindex={handleZindex}
                    key={id}
                    id={id}
                  />
                </div>
              );
          })}
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

      {showcolorpalatte && (
        <div className="Color_Palatte disableOutsideClick" style={{ backgroundColor: theme, zIndex: maxValue }}>
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
        </div>
      )}
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
