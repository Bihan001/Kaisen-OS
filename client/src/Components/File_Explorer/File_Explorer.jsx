import React, { useState, useEffect, useContext } from 'react';
import uuid from 'react-uuid';
import axios from 'axios';
import './File_Explorer.scss';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';
import { DirectoryContext } from '../../Contexts/DirectoryContext/DirectoryContext';
import { AuthContext } from '../../Contexts/AuthContext';

import { ClassFile, ClassFolder } from '../../Classes/Classes';

import { handleIcon, typeArray } from '../../Utility/functions';
import { backendUrl } from '../../backendUrl';

import back from '../../assets/icons/back.png';
import plus from '../../assets/icons/plus.png';

import { motion } from 'framer-motion';
import { clone } from 'ramda';

const File_Explorer = ({
  data,
  initialfolderpath,
  folderarray,
  updatefolderarray,
  filearray,
  updatefilearray,
  handleZindex,
  id,
}) => {
  const { theme } = useContext(ThemeContext);
  const { dirPaths, UpdatedirPaths } = useContext(DirectoryContext);
  const { user } = useContext(AuthContext);

  //Utility Variables
  var obj;
  var opened_dirPaths = {};
  var newpath;
  var newId;
  var htmlelements;
  var presentFolderState;
  var newFolderState;
  //===================

  //States====================
  const [draggable, setdraggable] = useState(false);
  const [Folder, setFolder] = useState(null);
  const [FolderContents, setFolderContents] = useState([]);

  const [showTypeList, setshowTypeList] = useState(false);
  const [CreateWindow, setCreateWindow] = useState({
    shown: false,
    data: {},
  });

  //New File and Folder States====
  const [name, setname] = useState('');
  const [content, setcontent] = useState('');
  const [file, setfile] = useState(null);
  //==============================

  // const [initialfolderpath,setinitialfolderpath]=useState("");
  //======================

  //UseEffects===========
  useEffect(() => {
    setFolder(data);
    //setinitialfolderpath(data.path);
  }, []);

  useEffect(() =>
    //For updatng minimized
    {
      if (Folder && !data.minimized) {
        obj = clone(Folder);
        obj.minimized = data.minimized;
        setFolder(obj);
      }
    }, [data.minimized]);

  useEffect(() => {
    if (Folder) {
      loadfoldercontents(Folder);
    }
  }, [Folder]);

  // useEffect(() => {
  //   if (Folder) {
  //     /*presentFolderState = Folder;
  //     newFolderState = dirPaths[Folder.path];
  //     if (newFolderState.children.length !== presentFolderState.children.length)
  //       setFolder(newFolderState);
  //     else if (FolderContents.length === 0) setFolder(newFolderState);*/
  //     loadfoldercontents(Folder);
  //   }
  // }, [dirPaths]);

  useEffect(() => {
    if (Folder) {
      setFolder(dirPaths[Folder.path]);
    }
  }, [dirPaths]);

  //==================

  //Functions
  const handleSelectAll = (e) => {
    if (FolderContents.length > 0) {
      // htmlelements=[]
      FolderContents.map((content) => {
        obj = document.getElementById(id + content.name);
        if (obj) {
          if (e.target.checked) obj.checked = true;
          else obj.checked = false;

          document.getElementById(id + content.name).innerHTML = obj;
        }
      });
    }
  };

  const handlecontentclicked = (data) => {
    if (data.type == 'folder') {
      setFolder(data);
    } else {
      opened_dirPaths = {};
      opened_dirPaths = clone(filearray);
      newId = uuid();
      opened_dirPaths[newId] = data;
      updatefilearray(opened_dirPaths);
    }
  };

  const handleback = () => {
    if (Folder) {
      newpath = Folder.path.split('#');
      newpath.pop();
      newpath = newpath.join('#');

      obj = dirPaths[newpath];

      if (obj) {
        setFolder(obj);
      }
    }
  };
  useEffect(() =>
    //handling minimize update
    {
      if (Folder) {
        opened_dirPaths = {};
        opened_dirPaths = clone(folderarray);
        if (opened_dirPaths[id]) {
          opened_dirPaths[id].minimized = Folder.minimized;
          updatefolderarray(opened_dirPaths);
        }
      }
    }, [Folder]);
  const handleminizestatus = () => {
    obj = clone(Folder);
    obj.minimized = !obj.minimized;
    setFolder(obj);
  };

  const handlecloseapp = () => {
    opened_dirPaths = {};
    opened_dirPaths = clone(folderarray);

    if (opened_dirPaths[id]) {
      delete opened_dirPaths[id];
      updatefolderarray(opened_dirPaths);
    }
  };

  const loadfoldercontents = (data) => {
    if (data.children.length > 0 && data.children[0]) {
      //This Condition tells that data was already loaded in frontend
      obj = dirPaths[data.path + '#' + data.children[0]]; // Just hecking the first obj in children array which will tell if the level is loaded or not
      if (obj) {
        var array = [];
        data.children.map((name) => {
          array.push(dirPaths[data.path + '#' + name]);
        });
        setFolderContents(array);
      } else {
        //have to make axios request to get the folder contents!!

        axios({
          method: 'POST',
          data: {
            folderPaths: data.children.map((content) => {
              return data.path + '#' + content;
            }),
          },
          url: `${backendUrl}/api/folders/getFolderAndParents`,
        })
          .then((res) => {
            var dirObj = clone(dirPaths);
            var newObj;
            res.data.data.map((data) => {
              //"root#terminal.exe":new ClassFile("terminal",new Date(),new Date(),{name:'Ankur'},"root#terminal.exe",".exe",""),
              if (data.type == 'folder') {
                newObj = new ClassFolder(
                  data.name,
                  data.dateCreated,
                  data.dateModified,
                  data.editableBy,
                  data.path,
                  data.type,
                  data.children
                );
              } else {
                newObj = new ClassFile(
                  data.name,
                  data.dateCreated,
                  data.dateModified,
                  data.editableBy,
                  data.path,
                  data.type,
                  data.content
                );
              }
              dirObj[newObj.path] = newObj;
            });
            UpdatedirPaths(dirObj);
          })
          .catch((err) => console.log(err));
      }
    } else setFolderContents([]);
  };

  const FolderhandleZindex = () => {
    handleZindex(id, 'folder_div');
  };

  const closeStates = () => {};

  const handleRotate = (classname) => {
    const div = document.getElementsByClassName(classname)[0];
    if (
      div.classList.contains('rotate-backwards') ||
      !div.classList.contains('rotate-forwards')
    ) {
      div.classList.remove('rotate-backwards');
      div.classList.add('rotate-forwards');
      //console.log(div);
    } else {
      div.classList.remove('rotate-forwards');
      div.classList.add('rotate-backwards');
      //console.log(div);
    }
  };

  const handleCreateWindow = (data) => {
    setCreateWindow({
      shown: true,
      data: data,
    });
  };

  const handleAuthorized = () => {
    if (Folder.path == 'root') {
      return user.isAdmin;
    } else {
      if (user.isAdmin) return true;
      else if (
        Folder.path === 'root#public' &&
        CreateWindow.data.type == 'folder'
      )
        return true;
      else return Folder.editableBy.id === user.id ? true : false;
    }
  };

  const handleCreateType1 = () =>
    //Type 1 includes folders and text files
    {
      console.log(handleAuthorized());
      if (handleAuthorized()) {
        var newEditableBy = '';

        if (Folder.editableBy.id === user.id) newEditableBy = user.id;
        else if (Folder.path == 'root#public') newEditableBy = user.id;
        else if (user.isAdmin) newEditableBy = Folder.editableBy.id;

        var reg = /[$&+,:;=?@#|'<>.^*()%!-]/;
        //console.log(reg.test(name),name)
        var success = true;
        if (name !== '' && !reg.test(name)) {
          if (CreateWindow.data.type == 'folder') {
            for (var i = 0; i < FolderContents.length; i++) {
              obj = FolderContents[i];

              if (obj.name === name && obj.type == 'folder') {
                console.log('FOlder with Same Name already exists!!');
                success = false;
                break;
              }
            }
            if (success) {
              //making axios request!!
              axios({
                method: 'POST',
                data: {
                  folderName: name,
                  parentPath: Folder.path,
                  folderCreator: newEditableBy,
                },
                url: `${backendUrl}/api/folders/createFolder`,
              })
                .then((res) => {
                  var newFolder = res.data.data.newFolder;
                  var Parent = res.data.data.parentFolder;
                  var newFolder_ClassObj;
                  var Parent_ClassObj;
                  //making our own class object
                  obj = clone(dirPaths);
                  newFolder_ClassObj = new ClassFolder(
                    newFolder.name,
                    newFolder.dateCreated,
                    newFolder.dateModified,
                    newFolder.editableBy,
                    newFolder.path,
                    newFolder.type,
                    newFolder.children
                  );
                  Parent_ClassObj = new ClassFolder(
                    Parent.name,
                    Parent.dateCreated,
                    Parent.dateModified,
                    Parent.editableBy,
                    Parent.path,
                    Parent.type,
                    Parent.children
                  );

                  obj[Parent_ClassObj.path] = Parent_ClassObj;
                  obj[newFolder_ClassObj.path] = newFolder_ClassObj;
                  console.log('the new dirPath is : ', obj);
                  UpdatedirPaths(obj);
                  //=============================

                  console.log(res);
                })
                .catch((err) => console.log(err));
            }
          } else {
            console.log('text file will be handled soon!!');
          }
        } else {
          console.log('Enter a valid name');
        }
      }
    };
  //=========

  return (
    <>
      {Folder && (
        <>
          {!Folder.minimized && (
            <motion.div
              className="File_Explorer"
              style={{ width: 'fit-content', height: 'fit-content' }}
              drag={draggable}
              dragConstraints={{ left: -160, right: 160, top: -30, bottom: 50 }}
              dragElastic={0.1}
            >
              <div
                className="Topbar"
                onFocus={() => setdraggable(true)}
                onBlur={() => setdraggable(false)}
                style={{ backgroundColor: theme }}
                tabIndex="-1"
              >
                <div
                  className="Topbar__Zindex_handler"
                  onClick={FolderhandleZindex}
                ></div>
                <div className="Window_Buttons">
                  <div className="Green" onClick={handleminizestatus}></div>
                  <div className="Yellow"> </div>
                  <div className="Red" onClick={handlecloseapp}></div>
                </div>
              </div>

              {Folder && (
                <div
                  className="File_Explorer_Config_Window "
                  onClick={FolderhandleZindex}
                >
                  <div className="Path">
                    <div onClick={handleback}>
                      <img src={back} />
                    </div>
                    <div>{Folder.path.split('#').join('/')}</div>
                  </div>
                  <div className="Lower_Segment ">
                    <div className="Row headings">
                      <div className="First">
                        <div className="form-group">
                          <input
                            type="checkbox"
                            id={`${id}Select_All`}
                            onClick={(e) => handleSelectAll(e)}
                          />
                          <label htmlFor={`${id}Select_All`}>Select all</label>
                        </div>
                      </div>
                      <div className="Second">
                        <div>Date Modified</div>
                        <div>Type</div>
                      </div>
                    </div>
                    <div className="Scrollable">
                      {FolderContents.map((content, index) => (
                        <div
                          className={
                            index % 2 == 0
                              ? 'Row Content grey'
                              : 'Row Content white'
                          }
                          onDoubleClick={() => handlecontentclicked(content)}
                          key={id + content.name}
                        >
                          <div className="form-group">
                            <input
                              type="checkbox"
                              id={id + content.name}
                              value={content.path}
                            />
                            <label htmlFor={id + content.name}>
                              <div>
                                <img src={handleIcon(content)} />
                                <div>{content.name}</div>
                              </div>
                            </label>
                          </div>
                          <div className="content-data">
                            {/* <div>{content.dateModified.toISOString().substring(0, 10)}</div>    */}
                            <div>{content.dateModified}</div>
                            <div>{content.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {CreateWindow.shown && (
                    <>
                      {(CreateWindow.data.type == 'folder' ||
                        CreateWindow.data.type == '.txt') && (
                        <div
                          className="CreateWindow type-1"
                          style={{ backgroundColor: theme }}
                        >
                          <div className="Name">
                            <div>Name : </div>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setname(e.target.value)}
                            />
                          </div>
                          <div className="Type">
                            Type : {CreateWindow.data.type}
                          </div>
                          <div className="Create">
                            <div className="button" onClick={handleCreateType1}>
                              Create
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {showTypeList && (
                    <div
                      className="TypeList"
                      style={{ backgroundColor: 'rgba(41, 45, 48 ,.5)' }}
                    >
                      {typeArray.map((data) => (
                        <img
                          src={data.icon}
                          onClick={() => handleCreateWindow(data)}
                        />
                      ))}
                    </div>
                  )}

                  <div
                    className={`Create_Config_Button ${id}config`}
                    style={{ backgroundColor: theme }}
                    onClick={() => {
                      setshowTypeList(!showTypeList);
                      handleRotate(id + 'config');
                      if (CreateWindow.shown)
                        setCreateWindow({
                          shown: false,
                          data: {},
                        });
                    }}
                  >
                    <img src={plus} />
                  </div>
                  <div className="Settings_Config_Button"></div>
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </>
  );
};
export default File_Explorer;
