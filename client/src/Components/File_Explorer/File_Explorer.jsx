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
import reload from '../../assets/icons/reload.png';
import delete_icon from '../../assets/icons/delete.png';

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
  var array;
  var htmlelements;
  var htmlElement;
  var presentFolderState;
  var newFolderState;
  var handleRequest;
  var child;
  var fileChecker = /txt|png|jpg|mpeg|mp3|mp4|pdf|csv/;
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
  const [files, setfiles] = useState(null);
  //==============================

  //Animation Class States===
  const [reloadClass, setreloadClass] = useState('reload');
  const [showDeleteIcon, setshowDeleteIcon] = useState(false);
  //==========================

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
      obj = clone(dirPaths);
      if (obj[Folder.path]) obj[Folder.path].minimized = Folder.minimized;
      setFolder(obj[Folder.path]);
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

  const handelReload = () => {
    //console.log('reload');
    setreloadClass('reload reload-animation');
    setTimeout(() => {
      setreloadClass('reload');
    }, 500);
    axios({
      method: 'POST',
      data: {
        folderPaths: [Folder.path],
      },
      url: `${backendUrl}/api/folders/getFolderAndParents`,
    })
      .then((res) => {
        console.log('before reload dirPaths is : ', dirPaths);
        var dirObj = clone(dirPaths);
        var newObj;
        res.data.data.map((data) => {
          console.log('reload data is : ', res);
          newObj = new ClassFolder(
            data.name,
            data.dateCreated,
            data.dateModified,
            data.editableBy,
            data.path,
            data.type,
            data.children
          );

          dirObj[newObj.path] = newObj;
        });
        UpdatedirPaths(dirObj);
      })
      .catch((err) => console.log(err));
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
    let request = false;
    for (var i = 0; i < data.children.length; i++) {
      if (!dirPaths[data.path + '#' + data.children[i]]) {
        console.log(dirPaths[data.path + '#' + data.children[i]]);
        request = true;
        break;
      }
    }

    if (data.children.length > 0 && data.children[0]) {
      if (!request) {
        var array = [];
        data.children.map((name) => {
          if (dirPaths[data.path + '#' + name])
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

  const handleCreateType1 = () => {
    //Type 1 includes folders and text files
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
              .then(async (res) => {
                obj = clone(dirPaths);
                var newFolder = res.data.data.newFolder;

                obj[Folder.path].children = [
                  ...obj[Folder.path].children,
                  newFolder.name,
                ];
                var newFolder_ClassObj;

                //making our own class object

                newFolder_ClassObj = new ClassFolder(
                  newFolder.name,
                  newFolder.dateCreated,
                  newFolder.dateModified,
                  newFolder.editableBy,
                  newFolder.path,
                  newFolder.type,
                  newFolder.children
                );

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

  const handleCreateType2 = () => {
    //Only for webapp!!
    if (handleAuthorized()) {
      console.log('Webapp name:', name, 'webapp  url:', content);
    }
  };
  const handleCreateType3 = () => {
    //Meant for other Files like pdf.png,mp3,mp4 etc..
  };

  const toggleDeleteIcon = () => {
    var flag = false;
    for (var i in FolderContents) {
      htmlelements = document.getElementById(id + FolderContents[i].name);
      if (htmlelements) {
        if (htmlelements.checked) {
          flag = true;
          break;
        }
      }
    }
    flag ? setshowDeleteIcon(true) : setshowDeleteIcon(false);
  };

  const deleteAuthorized = (list) => {
    var isAuthorized = true;
    if (user.isAdmin) return true;
    else {
      for (var i in list) {
        if (list[i].editableBy.id !== user.id) {
          isAuthorized = false;
          break;
        }
      }
      return isAuthorized;
    }
  };

  const recursiveDelete = (path, type, object) => {
    if (type == 'file') {
      delete object[path];
    } else {
      var childType = '';
      obj = object[path];

      if (obj) {
        obj.children.map((name) => {
          childType = fileChecker.test(name) ? 'file' : 'folder';

          recursiveDelete(obj.path + '#' + name, childType, object);
        });
        delete object[path];
      }
    }
  };

  const handleDelete = () => {
    var paths = [];
    var latestChildrenArray = [];
    var names = [];
    array = [];
    FolderContents.map((content) => {
      htmlElement = document.getElementById(id + content.name);
      if (htmlElement) {
        if (htmlElement.checked) {
          paths.push(content.path);
          array.push(content);
          if (content.type !== 'folder') {
            names.push(content.name + '#' + content.type);
          } else names.push(content.name);
        } else {
          latestChildrenArray.push(content.name);
        }
      }
    });
    console.log('paths is :', paths, 'and name is : ', names);

    //making axios request to delete data
    if (paths.length > 0 && names.length > 0 && deleteAuthorized(array)) {
      axios({
        method: 'post',
        data: {
          paths: paths,
          names: names,
        },
        url: `${backendUrl}/api/files/deleteFilesAndFolders`,
      })
        .then((res) => {
          console.log(res);
          let object = clone(dirPaths);
          var type = '';
          paths.map(async (path) => {
            type = fileChecker.test(path) ? 'file' : 'folder';

            await recursiveDelete(path, type, object);
          });
          object[Folder.path].children = latestChildrenArray;
          console.log('new obj is : ', object);
          UpdatedirPaths(object);
        })
        .catch((err) => console.log(err));
    } else {
      console.log('You re not Authorized to delete the data');
    }

    //==================================
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
                    <div onClick={handleback} className="back">
                      <img src={back} />
                    </div>
                    <div className={reloadClass} onClick={() => handelReload()}>
                      <img src={reload} />
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
                            onClick={(e) => {
                              handleSelectAll(e);
                              toggleDeleteIcon();
                            }}
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
                              onClick={() => toggleDeleteIcon()}
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

                  {CreateWindow.shown && !showDeleteIcon && (
                    <>
                      {(CreateWindow.data.type == 'folder' ||
                        CreateWindow.data.type == '.txt') && (
                        <div
                          className="CreateWindow type-uni"
                          style={{ backgroundColor: theme }}
                        >
                          <div className="Input_div">
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

                      {CreateWindow.data.type == '.webapp' && (
                        <div
                          className="CreateWindow type-uni"
                          style={{ backgroundColor: theme }}
                        >
                          <div className="Input_div">
                            <div>Name : </div>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setname(e.target.value)}
                            />
                          </div>
                          <div className="Input_div">
                            <div>Url : </div>
                            <input
                              type="text"
                              value={content}
                              onChange={(e) => setcontent(e.target.value)}
                            />
                          </div>

                          <div className="Type">
                            Type : {CreateWindow.data.type}
                          </div>
                          <div className="Create">
                            <div className="button" onClick={handleCreateType2}>
                              Create
                            </div>
                          </div>
                        </div>
                      )}

                      {CreateWindow.data.type == 'other' && (
                        <div
                          className="CreateWindow type-uni"
                          style={{ backgroundColor: theme }}
                        ></div>
                      )}
                    </>
                  )}

                  {showTypeList && !showDeleteIcon && (
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

                  {!showDeleteIcon && (
                    <div
                      className={`Function_Button ${id}config`}
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
                  )}
                  {showDeleteIcon && (
                    <div
                      className={`Function_Button ${id}_delete_icon`}
                      style={{ backgroundColor: theme }}
                      onClick={(e) => {
                        handleDelete();
                        htmlelements = e.currentTarget;
                        htmlelements.classList.add('wobble');
                        setTimeout(() => {
                          htmlelements.classList.remove('wobble');
                        }, 700);
                      }}
                    >
                      <img src={delete_icon} />
                    </div>
                  )}
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