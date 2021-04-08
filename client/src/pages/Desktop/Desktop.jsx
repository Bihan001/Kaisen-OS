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

const Desktop = (props) => {
  const { user, setUser } = useContext(AuthContext);
  const { theme, ChangeTheme } = useContext(ThemeContext);
  const { dirPaths, UpdatedirPaths } = useContext(DirectoryContext);
  const { notifications, removeNotification } = useContext(NotificationContext);

  const [openedfiles, setopenedfiles] = useState({});
  const [openedfolders, setopenedfolders] = useState({});

  const [startMenuContents, setStartMenuContents] = useState({
    folders: [],
    files: [],
  });

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
  const [presentWallpaper, setPresentWallpaper] = useState(0);
  //taskbar States============================================
  //const [showtaskbarfloatingcontents,setshowtaskbarfloatingcontents]=useState(false);
  const [showcolorpalatte, setshowcolorpalatte] = useState(false);
  const [showmenu, setshowmenu] = useState(false);
  //taskbar states==============================

  /* useEffect(() => {
    // if (!user) props.history.push('/login');
    const file = new Folder('Demo', Date.now(), Date.now(), {}, 'root#a', 'folder');
    console.log(file);
  }, []);*/

  useEffect(() => {
    axios({
      method: 'post',
      url: `${backendUrl}/api/folders/getFilesAndFolders`,
      data: {
        filePaths: ['root#terminal.exe', 'root#public#rock#newTextFile.txt', 'root#demo.txt', 'root#demo2.txt'],
        folderPaths: ['root#public', 'root#ankur', 'root#bihan'],
      },
    })
      .then((res) => {
        console.log('/getFilesAndFolders : ', res);

        setStartMenuContents({
          folders: res.data.data.folderResultList.map((data) => {
            return new ClassFolder(
              data.name,
              data.dateCreated,
              data.dateModified,
              data.editableBy,
              data.path,
              data.type,
              data.children
            );
          }),
          files: res.data.data.fileResultList.map((data) => {
            return new ClassFile(
              data.name,
              data.dateCreated,
              data.dateModified,
              data.editableBy,
              data.path,
              data.type,
              data.content
            );
          }),
        });
      })
      .catch((err) => {
        console.log(err);
      });

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
        for (var i in wallpapers) {
          if (wallpapers[i].id === user.wallpaper) {
            setPresentWallpaper(i);
            break;
          }
        }
      } else setPresentWallpaper(0);
    }
  }, [wallpapers, user]);

  //Functions
  const handleOpen = (data) => {
    opened_dirPaths = {};
    if (data.type == 'folder') {
      //this works
      opened_dirPaths = clone(openedfolders);
      newId = uuid();
      opened_dirPaths[newId] = data;
      setopenedfolders(opened_dirPaths);
    } else if (
      data.type == 'exe' ||
      data.type == 'txt' ||
      data.type == 'mp3' ||
      data.type == 'mp4' ||
      data.type == 'webapp' ||
      data.type == 'pdf' ||
      data.type == 'mpeg'
    ) {
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

  const logout = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/sessionLogout');
      setUser(null);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
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

  const handleWallpaperLeft = () => {
    let index = presentWallpaper;
    if (wallpapers[index - 1]) setPresentWallpaper(index - 1);
    else setPresentWallpaper(wallpapers.length - 1);
  };
  const handleWallpaperRight = () => {
    let index = presentWallpaper;
    if (wallpapers[index + 1]) setPresentWallpaper(index + 1);
    else setPresentWallpaper(0);
  };

  //==========

  return (
    <div
      className="Desktop"
      style={
        wallpapers.length > 0
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
      <button onClick={logout}>Logout</button>
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
                <div className="Icons" key={dirPaths[dir].path}>
                  <img src={handleIcon(dirPaths[dir])} onClick={() => handleOpen(dirPaths[dir])} />
                  <div>{dirPaths[dir].name}</div>
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

      {showmenu && user && (
        <div className="Start_Menu " style={{ backgroundColor: theme, zIndex: maxValue }}>
          <div className="Info_n_Content">
            <div className="User_Info">
              <div className="dp_div">
                <img src={user.displayImage} />
              </div>
              <div className="User_Name">{user.name}</div>
            </div>
            <div className="StartMenu__Content StartMenu__Content__Scrollable">
              {startMenuContents.folders.map((content) => (
                <div className="StartMenu__Content__Data" onClick={() => handleOpen(content)}>
                  <img src={handleIcon(content)} />
                  <div>{content.name}</div>
                </div>
              ))}
              {startMenuContents.files.map((content) => (
                <div className="StartMenu__Content__Data" onClick={() => handleOpen(content)}>
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
      )}

      {showcolorpalatte && (
        <div className="Color_Palatte" style={{ backgroundColor: theme, zIndex: maxValue }}>
          <div className="Color_Palatte__First-div">Choose a Theme</div>
          <div className="Color_Palatte__Second-div">
            <div className="Pink" onClick={() => ChangeTheme('#F5CFCF')}></div>
            <div className="Purple" onClick={() => ChangeTheme('#D7BDE2 ')}></div>
            <div className="Teal" onClick={() => ChangeTheme('#40e0d0')}></div>
            <div className="Grey" onClick={() => ChangeTheme('#ABB2B9 ')}></div>
            <div className="Cyan" style={{ backgroundColor: 'cyan' }} onClick={() => ChangeTheme('cyan')}></div>
            <div className="Gold" style={{ backgroundColor: 'gold' }} onClick={() => ChangeTheme('gold')}></div>
            <div className="Teal" style={{ backgroundColor: 'teal' }} onClick={() => ChangeTheme('teal')}></div>
            <div className="Violet" style={{ backgroundColor: 'violet' }} onClick={() => ChangeTheme('violet')}></div>
            <div className="Orange" style={{ backgroundColor: 'orange' }} onClick={() => ChangeTheme('orange')}></div>
            <div className="Yellow" style={{ backgroundColor: 'yellow' }} onClick={() => ChangeTheme('yellow')}></div>
            <div className="lime" style={{ backgroundColor: 'lime' }} onClick={() => ChangeTheme('lime')}></div>
            <div className="Brown" style={{ backgroundColor: '#DEB887' }} onClick={() => ChangeTheme('#DEB887')}></div>
            <div className="Pink" style={{ backgroundColor: 'pink' }} onClick={() => ChangeTheme('pink')}></div>
            <div
              className="CornSilk"
              style={{ backgroundColor: '#FFF8DC' }}
              onClick={() => ChangeTheme('#FFF8DC')}></div>
            <div
              className="#FA8072"
              style={{ backgroundColor: '#FA8072' }}
              onClick={() => ChangeTheme('#FA8072')}></div>
            <div
              className="#ECF0F1"
              style={{ backgroundColor: '#ECF0F1' }}
              onClick={() => ChangeTheme('#ECF0F1')}></div>
          </div>
        </div>
      )}
      <Taskbar
        togglecolorpalatte={() => setshowcolorpalatte(!showcolorpalatte)}
        togglemenu={() => setshowmenu(!showmenu)}
        filearray={openedfiles}
        updatefilearray={updatefilearray}
        folderarray={openedfolders}
        updatefolderarray={updatefolderarray}
        zIndex={maxValue}
      />
    </div>
  );
};
export default Desktop;
