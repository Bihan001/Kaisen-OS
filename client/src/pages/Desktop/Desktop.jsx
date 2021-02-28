import React, { useState, useEffect, useRef, useContext } from 'react';
import { clone } from 'ramda';
import axios from 'axios';
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

  //Utility Variables
  var newdir; //type:String
  var obj;
  var opened_dirPaths = {}; //This is not an array but a dirPath!!!
  //=================

  //taskbar States============================================
  //const [showtaskbarfloatingcontents,setshowtaskbarfloatingcontents]=useState(false);
  const [showcolorpalatte, setshowcolorpalatte] = useState(false);
  const [showmenu, setshowmenu] = useState(false);
  //taskbar states==============================

  useEffect(() => {
    // if (!user) props.history.push('/login');
    const file = new Folder('Demo', Date.now(), Date.now(), {}, 'root#a', 'folder');
    console.log(file);
  }, []);

  //Functions
  const handleOpen = (data) => {
    opened_dirPaths = {};
    if (data.type == 'folder') {
      //this works
      opened_dirPaths = clone(openedfolders);

      if (!opened_dirPaths[data.path]) {
        opened_dirPaths[data.path] = data;
        setopenedfolders(opened_dirPaths);
      } //it exists (lets check if it is closed or not)
      else {
        if (opened_dirPaths[data.path].closed) {
          opened_dirPaths[data.path].closed = false;
          setopenedfolders(opened_dirPaths);
        }
      }
    } else if (data.type == '.exe' || data.type == '.txt' || data.type == '.mp3' || data.type == '.mp4') {
      opened_dirPaths = clone(openedfiles);

      if (!opened_dirPaths[data.path]) {
        opened_dirPaths[data.path] = data;
        setopenedfiles(opened_dirPaths);
      } else {
        if (opened_dirPaths[data.path].closed) {
          //console.log(opened_dirPaths[data.path].closed);
          opened_dirPaths[data.path].closed = false;
          setopenedfiles(opened_dirPaths);
        }
      }
    }
  };

  const updatefilearray = (dirObj) => {
    setopenedfiles(dirObj);
  };
  const updatefolderarray = (dirObj) => {
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

  //==========

  return (
    <div className='Desktop'>
      <button onClick={logout}>Logout</button>
      {/* <div className="bg-video">
                 <video className="bg-video-content" autoPlay muted loop>
                    <source src={bgvideo} type="video/mp4"/>
                     <source src={bgvideo} type="video/webm"/>
                            Browser is NOt Supported!!
                 </video>
            </div> */}

      {dirPaths !== null && (
        <div className='Desktop_Icons_div'>
          {Object.keys(dirPaths).map((dir) => {
            newdir = dir.toString().split('#');
            newdir.pop();
            newdir.join('#');
            if (newdir == 'root')
              return (
                <div className='Icons' key={dirPaths[dir].path}>
                  <img src={handleIcon(dirPaths[dir])} onClick={() => handleOpen(dirPaths[dir])} />
                  <div>{dirPaths[dir].name}</div>
                </div>
              );
          })}
        </div>
      )}

      {openedfolders && (
        <div className='Folders_Window_div'>
          {Object.keys(openedfolders).map((dir, index) => {
            if (!openedfolders[dir].closed)
              return (
                <File_Explorer
                  data={openedfolders[dir]}
                  initialfolderpath={dir}
                  folderarray={openedfolders}
                  updatefolderarray={updatefolderarray}
                  filearray={openedfiles}
                  updatefilearray={updatefilearray}
                  key={index}
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
        </div>
      )}

      {openedfiles && (
        <div className='Files_Window_div'>
          {Object.keys(openedfiles).map((dir, index) => {
            if (!openedfiles[dir].closed)
              return (
                <Particular_File
                  data={openedfiles[dir]}
                  filearray={openedfiles}
                  updatefilearray={updatefilearray}
                  key={index}
                />
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
        <div className='Color_Palatte' style={{ backgroundColor: theme }}>
          <div className='Color_Palatte__First-div'>Choose a Theme</div>
          <div className='Color_Palatte__Second-div'>
            <div className='Pink' onClick={() => ChangeTheme('#F5CFCF')}></div>
            <div className='Purple' onClick={() => ChangeTheme('#D7BDE2 ')}></div>
            <div className='Teal' onClick={() => ChangeTheme('#40e0d0')}></div>
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
