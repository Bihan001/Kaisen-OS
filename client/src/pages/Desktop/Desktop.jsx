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

import { Folder, File } from '../../Classes/Classes';

import { handleIcon } from '../../Utility/functions';

const Desktop = (props) => {
  const { user, setUser } = useContext(AuthContext);
  const { theme, ChangeTheme } = useContext(ThemeContext);
  const { dirPaths, UpdatedirPaths } = useContext(DirectoryContext);

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

  //Functions
  const handleOpen = (data) => {
    opened_dirPaths = {};
    if (data.type == 'folder') {
      //this works
      opened_dirPaths = clone(openedfolders);
      newId = uuid();
      opened_dirPaths[newId] = data;
      setopenedfolders(opened_dirPaths);
    } else if (data.type == 'exe' || data.type == 'txt' || data.type == 'mp3' || data.type == 'mp4') {
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

  //==========

  return (
    <div className="Desktop">
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

      {showcolorpalatte && (
        <div className="Color_Palatte" style={{ backgroundColor: theme, zIndex: maxValue }}>
          <div className="Color_Palatte__First-div">Choose a Theme</div>
          <div className="Color_Palatte__Second-div">
            <div className="Pink" onClick={() => ChangeTheme('#F5CFCF')}></div>
            <div className="Purple" onClick={() => ChangeTheme('#D7BDE2 ')}></div>
            <div className="Teal" onClick={() => ChangeTheme('#40e0d0')}></div>
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
      />
    </div>
  );
};
export default Desktop;
