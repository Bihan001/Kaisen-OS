import React, { useState, useEffect, useContext, useRef } from 'react';
import firebase from '../../firebase';
import uuid from 'react-uuid';
import axios from 'axios';
import './File_Explorer.scss';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';
import { DirectoryContext } from '../../Contexts/DirectoryContext/DirectoryContext';
import { AuthContext } from '../../Contexts/AuthContext';
import { NotificationContext } from '../../Contexts/NotificationContext';
import { ScreenContext } from '../../Contexts/ScreenContext';

import { ClassFile, ClassFolder } from '../../Classes/Classes';

import {
  checkFileType,
  findFileType,
  handleIcon,
  typeArray,
  getLayout,
  getPureLayoutValues,
} from '../../Utility/functions';
import { backendUrl } from '../../backendUrl';

import back from '../../assets/icons/back.png';
import plus from '../../assets/icons/plus.png';
import reload from '../../assets/icons/reload.png';
import delete_icon from '../../assets/icons/delete.png';

import { motion, useDragControls } from 'framer-motion';
import { clone } from 'ramda';
import FrostedGlass from '../../Utility/frosted-glass';

import Tooltip from '../Tooltip/Tooltip';

const File_Explorer = ({
  data,
  initialfolderpath,
  folderarray,
  updatefolderarray,
  filearray,
  updatefilearray,
  handleZindex,
  id,
  zIndex,
  maxZindex,
  updateOnlyZindex,
}) => {
  const { theme } = useContext(ThemeContext);
  const { dirPaths, UpdatedirPaths } = useContext(DirectoryContext);
  const { addNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const { screenState } = useContext(ScreenContext);

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
  var fileChecker = /txt|png|jpg|mpeg|mp3|mp4|pdf|csv|html|jpeg|webapp|exe/;
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
  const [storageRef] = useState(firebase.storage().ref());

  const [fullScreen, setfullScreen] = useState(false);

  const [requestCounter, setRequestCounter] = useState(0);
  const [requestTimerId, setRequestTimerId] = useState(null);
  const [disableReload, setDisableReload] = useState(false);

  const [dragConstrains, setDragConstrains] = useState({});
  const [initialTop, setInitialTop] = useState(0);
  const [initialLeft, setInitialLeft] = useState(0);

  //New File and Folder States====
  const [name, setname] = useState('');
  const [content, setcontent] = useState('');
  const [file, setFile] = useState(null);
  const [uploadDetails, setUploadDetails] = useState({
    uploadState: '',
    uploadTask: null,
    uploadPercentage: 0,
  });
  //==============================

  //Animation Class States===
  const [reloadClass, setreloadClass] = useState('reload');
  const [showDeleteIcon, setshowDeleteIcon] = useState(false);
  //==========================

  const [tooltipTimerId, setTooltipTimerId] = useState(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const [tooltipData, setTooltipData] = useState({
    name: '',
    dateModified: '',
    createdBy: '',
  });

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // const [initialfolderpath,setinitialfolderpath]=useState("");
  //======================

  //UseEffects===========
  useEffect(() => {
    setFolder(data);
    //setinitialfolderpath(data.path);

    setTimeout(() => {
      handleRandomPosition();
    }, 10);
  }, []);

  useEffect(() => {
    if (screenState.screenWidth && screenState.screenHeight) {
      let layout = getPureLayoutValues(fullScreen, screenState);
      setDragConstrains({
        left: initialLeft * (screenState.screenWidth / 100) * -1,
        top: initialTop * (screenState.screenHeight / 100) * -1,
        right: screenState.screenWidth - initialLeft * (screenState.screenWidth / 100) - layout.width,
        bottom: screenState.screenHeight - initialTop * (screenState.screenHeight / 100) - layout.height,
      });
    }
  }, [screenState, initialLeft, initialTop]);

  const handleRandomPosition = () => {
    let element = document.getElementById(id + 'File_Explorer');
    let top, left;
    if (element) {
      if (!screenState.mobileView) {
        top = Math.random() * (10 - 5) + 5;
        left = Math.random() * (30 - 10) + 10;
        element.style.top = `${top}%`;
        element.style.left = `${left}%`;
      } else {
        top = Math.random() * (20 - 10) + 10;
        left = Math.random() * (5 - 2) + 2;
        element.style.top = `${top}%`;
        element.style.left = `${left}%`;
      }
      setInitialTop(top);
      setInitialLeft(left);
    } else console.log('element not found', id);
  };

  //Auto Diagnose useEffects and Functions
  useEffect(() => {
    if (requestCounter > 10 && !disableReload) {
      setDisableReload(true);
      addNotification('error', 'Error', 'Kaisen OS ran into some Problems! Auto Fix Started !');
      startDiagnose();
    }
  }, [requestCounter]);

  const startDiagnose = async () => {
    try {
      let res = await axios.post(`${backendUrl}/api/folders/diagnoseFolder`, {
        folderPath: Folder.path,
      });
      if (res) {
        let dirObj = clone(dirPaths);
        let newObj;
        let data = res.data.data;
        console.log('Diagnosed data is : ', res);
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
        UpdatedirPaths(dirObj);

        setDisableReload(false);

        addNotification('success', 'Success', 'Diagnose Completed !');
      }
    } catch (err) {
      console.log(err);
      addNotification('error', 'Error', err.message);
    }
  };

  //=================================

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

  useEffect(() => {
    if (uploadDetails.uploadTask != null) {
      htmlElement = document.getElementById(id + 'Progress');
      uploadDetails.uploadTask.on(
        'state_changed',
        (snap) => {
          console.log(snap);
          setUploadDetails({
            ...uploadDetails,
            uploadPercentage: Math.round((snap.bytesTransferred / snap.totalBytes) * 100),
          });
          if (htmlElement) {
            htmlElement.style.width = Math.round((snap.bytesTransferred / snap.totalBytes) * 100) + '%';
          }
        },
        (err) => console.log(err),
        () => {
          uploadDetails.uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            handleAddFileType3(url);
          });
        }
      );
    }
  }, [uploadDetails.uploadTask]);

  //==================

  //Functions
  const handleSelectAll = (e) => {
    if (FolderContents.length > 0) {
      // htmlelements=[]
      FolderContents.map((content) => {
        obj = document.getElementById(id + content.path);
        if (obj) {
          if (e.target.checked) obj.checked = true;
          else obj.checked = false;

          document.getElementById(id + content.path).innerHTML = obj;
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
      opened_dirPaths[newId].zindex = maxZindex;
      updateOnlyZindex();
      updatefilearray(opened_dirPaths);
    }
  };

  const handleback = () => {
    if (!disableReload) {
      if (Folder) {
        newpath = Folder.path.split('#');
        newpath.pop();
        newpath = newpath.join('#');

        obj = dirPaths[newpath];

        if (obj) {
          setFolder(obj);
        }
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
          if (dirPaths[data.path + '#' + name]) array.push(dirPaths[data.path + '#' + name]);
        });
        setFolderContents(array);
      } else {
        //have to make axios request to get the folder contents!!
        if (disableReload) {
          setRequestCounter(0);
          setRequestTimerId(null);
        }

        if (!disableReload) {
          //Diagnose requestCounter =====================
          setRequestCounter(requestCounter + 1);
          if (requestTimerId) clearTimeout(requestTimerId);
          setRequestTimerId(
            setTimeout(() => {
              setRequestCounter(0);
              setRequestTimerId(null);
            }, 2000)
          );
          //==============================================
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
      }
    } else setFolderContents([]);
  };

  const FolderhandleZindex = () => {
    handleZindex(id, 'folder_div');
  };

  const closeStates = () => {};

  const handleRotate = (classname) => {
    const div = document.getElementsByClassName(classname)[0];
    if (div.classList.contains('rotate-backwards') || !div.classList.contains('rotate-forwards')) {
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
      else if (Folder.path === 'root#public' && CreateWindow.data.type == 'folder') return true;
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
              addNotification('warning', 'Warning', 'Folder name already exists');
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

                obj[Folder.path].children = [...obj[Folder.path].children, newFolder.name];
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
                addNotification('success', 'Success', 'Folder Created !');
                //=============================

                console.log(res);
              })
              .catch((err) => addNotification('error', 'Error', err.message));
          }
        } else {
          const blankTextFile = new Blob([''], { type: 'text/plain;charset=utf-8' });
          const fileType = findFileType('text/plain');
          const metadata = { contentType: fileType };
          storageRef
            .child(Date.now().toString() + '_' + name + '.txt')
            .put(blankTextFile, metadata)
            .then((snap) => {
              snap.ref.getDownloadURL().then((url) => {
                var newEditableBy = '';
                if (Folder.editableBy.id === user.id) newEditableBy = user.id;
                else if (Folder.path == 'root#public') newEditableBy = user.id;
                else if (user.isAdmin) newEditableBy = Folder.editableBy.id;
                axios({
                  method: 'POST',
                  data: {
                    parentPath: Folder.path,
                    fileName: name,
                    fileType: findFileType('text/plain').split('/')[1],
                    fileSize: blankTextFile.size,
                    fileContent: url,
                    fileCreator: newEditableBy,
                  },
                  url: `${backendUrl}/api/files/createFile`,
                })
                  .then((res) => {
                    console.log(res);
                    obj = clone(dirPaths);
                    var newFile = res.data.data.newFile;
                    obj[Folder.path].children = [...obj[Folder.path].children, newFile.name + '.' + newFile.type];
                    var newFile_ClassObj;
                    newFile_ClassObj = new ClassFile(
                      newFile.name,
                      newFile.dateCreated,
                      newFile.dateModified,
                      newFile.editableBy,
                      newFile.path,
                      newFile.type,
                      newFile.content
                    );
                    obj[newFile_ClassObj.path] = newFile_ClassObj;
                    UpdatedirPaths(obj);
                    htmlElement = document.getElementById(id + 'Progress');
                    htmlElement.style.width = '0%';
                    addNotification('success', 'Success', 'Text File Created !');
                  })
                  .catch((err) => {
                    addNotification('error', 'Error', err.message);
                  });
              });
            });
        }
      } else {
        addNotification('warning', 'Warning', 'Enter a valid Name');
      }
    } else {
      addNotification('warning', 'Warning', 'You are Not Authorized !');
    }
  };

  const handleCreateType2 = () => {
    //Only for webapp!!
    if (handleAuthorized()) {
      console.log('Webapp name:', name, 'webapp  url:', content);
      var isPresent = false;
      for (var i in FolderContents) {
        if (FolderContents[i].name === name) {
          isPresent = true;
          break;
        }
      }
      var reg = /[$&+,:;=?@#|'<>.^*()%!-]/;
      var urlMatcher = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
      if (!isPresent && !name.includes('.') && !reg.test(name)) {
        if (content.match(urlMatcher)) {
          var newEditableBy = '';
          if (Folder.editableBy.id === user.id) newEditableBy = user.id;
          else if (Folder.path == 'root#public') newEditableBy = user.id;
          else if (user.isAdmin) newEditableBy = Folder.editableBy.id;
          axios({
            method: 'POST',
            data: {
              parentPath: Folder.path,
              fileName: name,
              fileType: 'webapp',
              fileSize: 1,
              fileContent: content,
              fileCreator: newEditableBy,
            },
            url: `${backendUrl}/api/files/createFile`,
          })
            .then((res) => {
              console.log('Now  data is : ', res);
              obj = clone(dirPaths);
              var newFile = res.data.data.newFile;
              obj[Folder.path].children = [...obj[Folder.path].children, newFile.name + '.' + newFile.type];
              var newFile_ClassObj;
              newFile_ClassObj = new ClassFile(
                newFile.name,
                newFile.dateCreated,
                newFile.dateModified,
                newFile.editableBy,
                newFile.path,
                newFile.type,
                newFile.content
              );
              obj[newFile_ClassObj.path] = newFile_ClassObj;
              UpdatedirPaths(obj);
              addNotification('success', 'Success', 'WebApp Created !');
            })
            .catch((err) => console.log(err));
        } else {
          addNotification('warning', 'Warning', 'Enter a Url !');
        }
      } else {
        addNotification('warning', 'Warning', 'Enter a Valid Name !');
      }
    } else {
      addNotification('warning', 'Warning', 'You are Not Authorized !');
    }
  };
  const handleCreateType3 = () => {
    //Meant for other Files like pdf.png,mp3,mp4 etc..
    if (handleAuthorized()) {
      if (file && name) {
        var isPresent = false;
        for (var i in FolderContents) {
          if (
            FolderContents[i].name + '.' + FolderContents[i].type ===
            name + '.' + findFileType(file.type).split('/')[1]
          ) {
            isPresent = true;
            break;
          }
        }
        console.log('the file is :', file);
        var reg = /[$&+,:;=?@#|'<>.^*()%!-]/;
        if (!isPresent && !reg.test(name)) {
          const fileType = findFileType(file.type); // application/pdf, text/html, video/mp4, image/jpeg etc.
          if (!checkFileType(fileType)) return alert('File type not supported');
          const fileSize = file.size; // number - in bytes
          // if (fileSize > 15 * 1024 * 1024) return alert('File size shouldnt exceed 15mb');
          console.log(name, fileType, fileSize);
          const metadata = { contentType: fileType };
          setUploadDetails({
            ...uploadDetails,
            uploadState: 'uploading',
            uploadTask: storageRef.child(Date.now().toString() + '_' + file.name).put(file, metadata),
          });
        } else {
          addNotification('warning', 'Warning', 'Enter a Valid Name !');
        }
      }
    } else {
      addNotification('warning', 'Warning', 'Not Authorized !');
    }
  };

  const handleAddFileType3 = (url) => {
    // upload to nodejs
    console.log(name, findFileType(file.type), file.size, url);
    var newEditableBy = '';
    if (Folder.editableBy.id === user.id) newEditableBy = user.id;
    else if (Folder.path == 'root#public') newEditableBy = user.id;
    else if (user.isAdmin) newEditableBy = Folder.editableBy.id;
    axios({
      method: 'POST',
      data: {
        parentPath: Folder.path,
        fileName: name,
        fileType: findFileType(file.type).split('/')[1],
        fileSize: file.size,
        fileContent: url,
        fileCreator: newEditableBy,
      },
      url: `${backendUrl}/api/files/createFile`,
    })
      .then((res) => {
        console.log(res);
        obj = clone(dirPaths);
        var newFile = res.data.data.newFile;
        obj[Folder.path].children = [...obj[Folder.path].children, newFile.name + '.' + newFile.type];
        var newFile_ClassObj;
        newFile_ClassObj = new ClassFile(
          newFile.name,
          newFile.dateCreated,
          newFile.dateModified,
          newFile.editableBy,
          newFile.path,
          newFile.type,
          newFile.content
        );
        obj[newFile_ClassObj.path] = newFile_ClassObj;
        UpdatedirPaths(obj);
        htmlElement = document.getElementById(id + 'Progress');
        htmlElement.style.width = '0%';
        addNotification('success', 'Success', 'File Created !');
      })
      .catch((err) => {
        addNotification('error', 'Error', err.message);
      });
  };

  const toggleDeleteIcon = () => {
    var flag = false;
    for (var i in FolderContents) {
      htmlelements = document.getElementById(id + FolderContents[i].path);
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

  const recursiveDelete = async (path, type, object) => {
    if (type == 'file') {
      const file = object[path];
      if (file) {
        if (file.type !== 'webapp' && file.type !== 'exe') {
          const oldFileRef = firebase.storage().refFromURL(file.content);
          await oldFileRef.delete();
        }
      }
      delete object[path];
    } else {
      var childType = '';
      const obj = object[path];

      if (obj) {
        obj.children.map((name) => {
          childType = name.includes('.') ? 'file' : 'folder';

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
      htmlElement = document.getElementById(id + content.path);
      if (htmlElement) {
        if (htmlElement.checked) {
          array.push(content);
          paths.push(content.path);
          if (content.type !== 'folder') {
            names.push(content.name + '.' + content.type);
          } else {
            names.push(content.name);
          }
        } else {
          if (content.type == 'folder') latestChildrenArray.push(content.name);
          else latestChildrenArray.push(content.name + '.' + content.type);
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
            type = path.includes('.') ? 'file' : 'folder';

            await recursiveDelete(path, type, object);
          });
          console.log('The latest children array should be : ', latestChildrenArray);
          object[Folder.path].children = latestChildrenArray;
          console.log('new obj is : ', object);
          UpdatedirPaths(object);
          setshowDeleteIcon(false);
          addNotification('success', 'Success', 'Successfully Deleted !');
        })
        .catch((err) => {
          addNotification('error', 'Error', err.message);
        });
    } else {
      addNotification('error', 'Error', 'Not Authorized !');
    }

    //==================================
  };

  const getTop = () => {
    htmlElement = document.getElementById(id + 'File_Explorer');

    if (htmlElement) {
      try {
        if (htmlElement.style.transform !== undefined) {
          var top = htmlElement.style.transform.split(',')[1].split('px')[0];
          return -1 * top + 'px';
        }
      } catch {
        return '0px';
      }
    }
  };
  const getLeft = () => {
    htmlElement = document.getElementById(id + 'File_Explorer');

    if (htmlElement) {
      try {
        if (htmlElement.style.transform !== undefined) {
          var left = htmlElement.style.transform.split(',')[0].split('(')[1].split('px')[0];

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

  //=========

  return (
    <>
      {Folder && (
        <>
          <motion.div
            className="File_Explorer"
            id={id + 'File_Explorer'}
            style={
              !fullScreen
                ? {
                    width: getLayout(fullScreen, screenState).width,
                    height: getLayout(fullScreen, screenState).height,
                    zIndex: zIndex,
                    display: !Folder.minimized ? 'initial' : 'none',
                  }
                : {
                    width: getLayout(fullScreen, screenState).width,
                    height: getLayout(fullScreen, screenState).height,
                    position: 'fixed',

                    boxShadow: '0 0 0 black',
                    zIndex: zIndex,
                    display: !Folder.minimized ? 'initial' : 'none',
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
            transition={{ type: 'spring', stiffness: 300, damping: 35, duration: 3 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            drag={!fullScreen ? draggable : false}
            dragControls={dragControls}
            dragConstraints={!fullScreen ? dragConstrains : {}}
            dragElastic={false}
            dragMomentum={false}>
            <div
              className="Topbar Frosted_Glass"
              // onMouseEnter={() => setdraggable(true)}
              // onFocus={() => setdraggable(true)}
              // onBlur={() => setdraggable(false)}
              onPointerDown={(e) => startDrag(e)}
              id={'topbar' + id}
              tabIndex="-1">
              <FrostedGlass frostId={'topbar' + id} opacityHex="99" showMargin={false} />
              <div className="Topbar__Zindex_handler" onClick={FolderhandleZindex}>
                <div className="Topbar__Zindex_handler_Icon">
                  <img src={handleIcon(data)} />
                </div>
                <div className="Topbar__Zindex_handler_Name">File Explorer</div>
              </div>
              <div className="Window_Buttons">
                <div className="Green" onClick={handleminizestatus}></div>
                <div className="Yellow" onClick={() => setfullScreen(!fullScreen)}>
                  {' '}
                </div>
                <div className="Red" onClick={handlecloseapp}></div>
              </div>
            </div>
            <div className="Progress_Bar">
              <div className="Progress" id={id + 'Progress'}></div>
            </div>
            {Folder && (
              <div
                className="File_Explorer_Config_Window "
                onClick={FolderhandleZindex}
                onPointerDown={(e) => setdraggable(false)}>
                <Tooltip showTooltip={showTooltip} tooltipPosition={tooltipPosition} tooltipData={tooltipData} />

                <div className="Path">
                  <div onClick={handleback} className="back">
                    <img src={back} />
                  </div>
                  <div
                    className={reloadClass}
                    onClick={() => {
                      if (!disableReload) handelReload();
                    }}>
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
                      {!screenState.mobileView && <div>Date Modified</div>}
                      <div>Type</div>
                    </div>
                  </div>
                  <div className="Scrollable">
                    {FolderContents.map((content, index) => (
                      <div
                        className={index % 2 == 0 ? 'Row Content grey' : 'Row Content white'}
                        onMouseOver={(e) => {
                          clearTimeout(tooltipTimerId);
                          setTooltipTimerId(
                            setTimeout(() => {
                              setShowTooltip(true);
                              setTooltipData({
                                name: content.name,
                                type: content.type,
                                createdBy: content.editableBy.name,
                                dateModified: content.dateModified,
                              });
                              setTooltipPosition({ x: e.clientX, y: e.clientY });
                            }, 500)
                          );
                        }}
                        onMouseOut={(e) => {
                          setShowTooltip(false);
                          clearTimeout(tooltipTimerId);
                        }}
                        onDoubleClick={() => {
                          if (!screenState.mobileView) {
                            setShowTooltip(false);
                            clearTimeout(tooltipTimerId);
                            if (!disableReload) handlecontentclicked(content);
                          }
                        }}
                        key={id + content.path}>
                        <div className="form-group">
                          <input
                            type="checkbox"
                            id={id + content.path}
                            value={content.path}
                            onClick={() => toggleDeleteIcon()}
                          />
                          <label htmlFor={id + content.path}></label>
                        </div>
                        <div
                          className="file-folder-name"
                          onClick={() => {
                            if (screenState.mobileView) {
                              setShowTooltip(false);
                              clearTimeout(tooltipTimerId);
                              if (!disableReload) handlecontentclicked(content);
                            }
                          }}>
                          <img src={handleIcon(content)} />
                          <div>{content.name}</div>
                        </div>
                        <div
                          className="content-data"
                          onClick={() => {
                            if (screenState.mobileView) {
                              setShowTooltip(false);
                              clearTimeout(tooltipTimerId);
                              if (!disableReload) handlecontentclicked(content);
                            }
                          }}>
                          {/* <div>{content.dateModified.toISOString().substring(0, 10)}</div>    */}
                          {!screenState.mobileView && <div>{new Date(content.dateModified).toDateString()}</div>}
                          <div>{content.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {CreateWindow.shown && !showDeleteIcon && (
                  <>
                    {(CreateWindow.data.type == 'folder' || CreateWindow.data.type == 'txt') && (
                      <div className="CreateWindow type-uni" style={{ backgroundColor: theme }}>
                        <div className="Input_div">
                          <div>Name : </div>
                          <input type="text" value={name} onChange={(e) => setname(e.target.value)} />
                        </div>
                        <div className="Type">Type : {CreateWindow.data.type}</div>
                        <div className="Create">
                          <div className="button" onClick={handleCreateType1}>
                            Create
                          </div>
                        </div>
                      </div>
                    )}

                    {CreateWindow.data.type == 'webapp' && (
                      <div className="CreateWindow type-uni" style={{ backgroundColor: theme }}>
                        <div className="Input_div">
                          <div>Name : </div>
                          <input type="text" value={name} onChange={(e) => setname(e.target.value)} />
                        </div>
                        <div className="Input_div">
                          <div>Url : </div>
                          <input type="text" value={content} onChange={(e) => setcontent(e.target.value)} />
                        </div>

                        <div className="Type">Type : {CreateWindow.data.type}</div>
                        <div className="Create">
                          <div className="button" onClick={handleCreateType2}>
                            Create
                          </div>
                        </div>
                      </div>
                    )}

                    {CreateWindow.data.type == 'other' && (
                      <div className="CreateWindow type-uni" style={{ backgroundColor: theme }}>
                        <div className="Input_div">
                          <div>Name : </div>
                          <input type="text" value={name} onChange={(e) => setname(e.target.value)} />
                        </div>
                        <div className="Input_div file-input">
                          <input type="file" id="file-input" hidden onChange={(e) => setFile(e.target.files[0])} />
                          <label className="button" htmlFor="file-input">
                            Choose File
                          </label>
                          <span id="file-chosen">{file ? file.name : 'No file chosen'}</span>
                        </div>

                        {/* <div className="Type">Type : {CreateWindow.data.type}</div> */}
                        <div className="Create">
                          <div className="button" onClick={handleCreateType3}>
                            Create
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {showTypeList && !showDeleteIcon && (
                  <div className="TypeList" style={{ backgroundColor: 'rgba(41, 45, 48 ,.5)' }}>
                    {typeArray.map((data) => (
                      <img src={data.icon} onClick={() => handleCreateWindow(data)} />
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
                    }}>
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
                    }}>
                    <img src={delete_icon} />
                  </div>
                )}
                <div className="Settings_Config_Button"></div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </>
  );
};
export default File_Explorer;
