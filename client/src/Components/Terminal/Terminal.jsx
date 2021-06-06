import React, { useState, useRef, useEffect, useContext } from 'react';
import firebase from '../../firebase';
import { clone, forEach } from 'ramda';
import axios from 'axios';
import { backendUrl } from '../../backendUrl';
import { ClassFile, ClassFolder } from '../../Classes/Classes';
import uuid from 'react-uuid';

import Terminal from 'terminal-in-react';
import './Terminal.scss';
import { DirectoryContext } from '../../Contexts/DirectoryContext/DirectoryContext';
import { ScreenContext } from '../../Contexts/ScreenContext';
import { AuthContext } from '../../Contexts/AuthContext';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';
import { NotificationContext } from '../../Contexts/NotificationContext';

//import fullscreen_icon from "../assets/fullscreen.svg";

const ReactTerminal = ({
  id,
  fullScreen,
  filearray,
  updatefilearray,
  folderarray,
  updatefolderarray,
  maxZindex,
  updateOnlyZindex,
}) => {
  //variables
  var obj;
  //=========

  const [String, setString] = useState('');
  const StringRef = useRef('');

  const { dirPaths, UpdatedirPaths } = useContext(DirectoryContext);
  const { screenState } = useContext(ScreenContext);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { addNotification } = useContext(NotificationContext);

  const [Folder, setFolder] = useState(null);
  const [FolderContents, setFolderContents] = useState([]);
  const newRef = useRef({
    Folder: {},
    FolderContents: [],
    dirPaths: {},
    user: {},
    filearray: [],
    folderarray: [],
  });

  const [requestCounter, setRequestCounter] = useState(0);
  const [requestTimerId, setRequestTimerId] = useState(null);
  const [disableReload, setDisableReload] = useState(false);

  //Configuring on change bash
  let html = document.getElementById(id + 'File');
  try {
    html.getElementsByClassName('lfnIny')[0].addEventListener('click', () => {
      setTimeout(() => {
        try {
          html.getElementsByClassName('sc-dnqmqq')[0].innerHTML = Folder.path.split('#').join('/') + ' > ';
          html.getElementsByClassName('sc-dnqmqq')[0].style.color = theme;
          if (fullScreen) {
            html.getElementsByClassName('terminal-base')[0].style.width = '100%';
            html.getElementsByClassName('terminal-base')[0].style.height = '100%';
            html.getElementsByClassName('terminal-base')[0].style.maxWidth = '100%';
            html.getElementsByClassName('sc-jTzLTM')[0].style.width = '100%';
            html.getElementsByClassName('lfnIny')[0].style.maxWidth = '100%';
            html.getElementsByClassName('gCWpcM')[0].style.maxWidth = '100%';
          } else {
            console.log('this ', screenState.mobileView);

            html.getElementsByClassName('terminal-base')[0].style.width = `${screenState.mobileView ? '100%' : '100%'}`;
            html.getElementsByClassName('terminal-base')[0].style.height = `${
              screenState.mobileView ? '100%' : '100%'
            }`;
            html.getElementsByClassName('terminal-base')[0].style.minHeight = `${
              screenState.mobileView ? '100%' : '100%'
            }`;
            html.getElementsByClassName('terminal-base')[0].style.maxWidth = `${
              screenState.mobileView ? '100%' : '100%'
            }`;
            html.getElementsByClassName('sc-jTzLTM')[0].style.width = `${screenState.mobileView ? '100%' : '100%'}`;
            html.getElementsByClassName('lfnIny')[0].style.maxWidth = `${screenState.mobileView ? '100%' : '100%'}`;
            html.getElementsByClassName('gCWpcM')[0].style.maxWidth = `${screenState.mobileView ? '100%' : '100%'}`;
          }
        } catch {}
      }, 10);
    });
  } catch {
    console.log('Opps didnt find html');
  }

  //==========================

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

  useEffect(() => {
    if (dirPaths) setFolder(dirPaths['root']);
  }, []);

  //Screen Configs==============================
  // useEffect(() => {
  //   let html;
  //   do {
  //     html = document.getElementById(id + 'File');
  //   } while (!html);

  //   if (fullScreen) {
  //     fullScreenTerminal(html);
  //   } else dualScreenTerminal(html);
  // }, [screenState.mobileView]);

  // const fullScreenTerminal = (html) => {
  //   try {
  //     html.style.width = '100vw';
  //     html.getElementsByClassName('terminal-base')[0].style.width = '100vw';
  //     html.getElementsByClassName('terminal-base')[0].style.height = '100%';
  //     html.getElementsByClassName('terminal-base')[0].style.maxWidth = '100vw';
  //     html.getElementsByClassName('sc-jTzLTM')[0].style.width = '100vw';
  //     html.getElementsByClassName('lfnIny')[0].style.maxWidth = '100vw';
  //     html.getElementsByClassName('gCWpcM')[0].style.maxWidth = '100vw';
  //   } catch (err) {
  //     console.log('fullScreenTerminal Fail');
  //   }
  // };

  // const dualScreenTerminal = (html) => {
  //   try {
  //     html.style.width = `${screenState.mobileView ? '90vw' : '90rem'}`;
  //     html.getElementsByClassName('terminal-base')[0].style.width = `${screenState.mobileView ? '90vw' : '90rem'}`;
  //     html.getElementsByClassName('terminal-base')[0].style.height = `${screenState.mobileView ? '70vh' : '90rem'}`;
  //     html.getElementsByClassName('terminal-base')[0].style.minHeight = `${screenState.mobileView ? '60vh' : '80vh'}`;
  //     html.getElementsByClassName('terminal-base')[0].style.maxWidth = `${screenState.mobileView ? '90vw' : '90rem'}`;
  //     html.getElementsByClassName('sc-jTzLTM')[0].style.width = `${screenState.mobileView ? '90vw' : '90rem'}`;
  //     html.getElementsByClassName('lfnIny')[0].style.maxWidth = `${screenState.mobileView ? '90vw' : '90rem'}`;
  //     html.getElementsByClassName('gCWpcM')[0].style.maxWidth = `${screenState.mobileView ? '90vw' : '90rem'}`;
  //   } catch {
  //     console.log('dualScreenTerminal Fail');
  //   }
  // };

  //===========================================

  useEffect(() => {
    if (Folder) loadfoldercontents(Folder);
  }, [Folder]);

  useEffect(() => {
    let html = document.getElementById(id + 'File');
    try {
      //console.log(html);
      html.getElementsByClassName('sc-dnqmqq')[0].innerHTML = Folder.path.split('#').join('/') + ' > ';
      html.getElementsByClassName('sc-dnqmqq')[0].style.color = theme;
    } catch {
      console.log('Opps Couldnt Find html');
    }
  }, [Folder, theme]);

  useEffect(() => {
    let html = document.getElementById(id + 'File');
    try {
      if (fullScreen) {
        html.getElementsByClassName('terminal-base')[0].style.width = '100%';
        html.getElementsByClassName('terminal-base')[0].style.height = '100%';
        html.getElementsByClassName('terminal-base')[0].style.maxWidth = '100%';
        html.getElementsByClassName('sc-jTzLTM')[0].style.width = '100%';
        html.getElementsByClassName('lfnIny')[0].style.maxWidth = '100%';
        html.getElementsByClassName('gCWpcM')[0].style.maxWidth = '100%';
      } else {
        html.getElementsByClassName('terminal-base')[0].style.width = `${screenState.mobileView ? '100%' : '100%'}`;
        html.getElementsByClassName('terminal-base')[0].style.height = `${screenState.mobileView ? '100%' : '100%'}`;
        html.getElementsByClassName('terminal-base')[0].style.minHeight = `${screenState.mobileView ? '100%' : '100%'}`;
        html.getElementsByClassName('terminal-base')[0].style.maxWidth = `${screenState.mobileView ? '100%' : '100%'}`;
        html.getElementsByClassName('sc-jTzLTM')[0].style.width = `${screenState.mobileView ? '100%' : '100%'}`;
        html.getElementsByClassName('lfnIny')[0].style.maxWidth = `${screenState.mobileView ? '100%' : '100%'}`;
        html.getElementsByClassName('gCWpcM')[0].style.maxWidth = `${screenState.mobileView ? '100%' : '100%'}`;
      }
    } catch {
      console.log('Opps an error occured!!');
    }
  }, [fullScreen]);

  useEffect(() => {
    newRef.current = {
      Folder: Folder,
      FolderContents: FolderContents,
      dirPaths: dirPaths,
      user: user,
      filearray: filearray,
      folderarray: folderarray,
      maxZindex: maxZindex,
      updateOnlyZindex: updateOnlyZindex,
    };
  }, [FolderContents, dirPaths, user, maxZindex, updateOnlyZindex]);

  useEffect(() => {
    newRef.current = {
      Folder: Folder,
      FolderContents: FolderContents,
      dirPaths: dirPaths,
      user: user,
      filearray: filearray,
      folderarray: folderarray,
      maxZindex: maxZindex,
      updateOnlyZindex: updateOnlyZindex,
    };
  }, [filearray, folderarray]);

  useEffect(() => {
    if (Folder) {
      let obj = clone(dirPaths);
      if (obj[Folder.path]) obj[Folder.path].minimized = Folder.minimized;
      setFolder(obj[Folder.path]);
    }
  }, [dirPaths]);

  useEffect(() => {
    StringRef.current = String;
  }, [String]);

  //Commands
  const commands = {
    cd: (args, print, runcommand) => {
      const data = args.slice(1).join('');
      if (data == '..') {
        let returnedValue = handleback(); //object { success:bool , currentdir:String }
        // if (returnedValue.success) print(`Current Directory ${returnedValue.currentDir}`);
        // else print('Opps Error Occured!');
      } else {
        let returnedValue = loadFolder(data.split('/').join('#'));
        // if (returnedValue.success) print(`Current Directory ${returnedValue.currentDir}`);
        // else print('Directory Incorrect!');
      }
    },
    mkdir: (args, print, runcommand) => {
      //has crashing errors and bugs ,need Fix!
      const data = args.slice(1).join(' ');
      if (data) {
        //alert(`Lets make ${text} Folder!!`)
        handleCreateFolder(data);
        //     console.log('returnedValue is : ', returnedValue);
        //     if (returnedValue) print(`${data} created!`);
        //     else print('Not Authorized!');
      }
    },
    pwd: (args, print, runcommand) => {
      print(newRef.current.Folder.path.split('#').join('/'));
    },
    ls: (args, print, runcommand) => {
      let data = handleLs();
      console.table(data);
      data.map((string) => {
        print(string + '\n');
      });
    },
    rm: (args, print, runcommand) => {
      const data = args.slice(1).join(' ');
      handleDelete(data);
    },
    open: (args, print, runcommand) => {
      const data = args.slice(1).join(' ');
      handleOpen(data);
    },
  };
  //Commands=

  //Descriptions
  const descriptions = {
    cd: 'Enters the Directory',
    mkdir: 'Creates a Folder',
    pwd: 'Shows current Directory',
    ls: 'Shows files and folders in this directory',
    rm: 'Remove a file or directory',
    open: 'Opens a File or Folder',
  };
  //===========

  //Terminal Functions=================
  const handleLs = () => {
    console.log('FOldercontents', newRef.current.FolderContents);
    return newRef.current.FolderContents.map((content) => {
      if (content.type == 'folder') return content.name;
      else return content.name + '.' + content.type;
    });
  };
  const handleback = () => {
    if (newRef.current.Folder) {
      let newpath = newRef.current.Folder.path.split('#');
      let dirRef = newRef.current.dirPaths;
      newpath.pop();
      newpath = newpath.join('#');

      obj = dirRef[newpath];
      console.log('newpath is :', newpath, 'obj is : ', obj);
      if (obj) {
        setFolder(obj);
        return {
          success: true,
          currentDir: obj.path.split('#').join('/'),
        };
      } else
        return {
          success: false,
          currentDir: '',
        };
    }
    return {
      success: false,
      currentDir: '',
    };
  };
  const loadFolder = (path) => {
    if (newRef.current.Folder) {
      obj = newRef.current.dirPaths[newRef.current.Folder.path + '#' + path];
      if (!path.includes('.') && obj) {
        setFolder(obj);
        return {
          success: true,
          currentDir: obj.path.split('#').join('/'),
        };
      }
      return {
        success: false,
        currentDir: '',
      };
    }
  };

  const handleOpen = (name) => {
    console.log(name);
    if (newRef.current.Folder && newRef.current.dirPaths) {
      let data = newRef.current.dirPaths[newRef.current.Folder.path + '#' + name];
      let newId;
      if (data) {
        if (data.type !== 'folder') {
          let opened_dirPaths = clone(newRef.current.filearray);
          newId = uuid();
          opened_dirPaths[newId] = data;
          opened_dirPaths[newId].zindex = newRef.current.maxZindex;
          newRef.current.updateOnlyZindex();
          updatefilearray(opened_dirPaths);
        } else {
          let opened_folderPaths = clone(newRef.current.folderarray);
          newId = uuid();
          opened_folderPaths[newId] = data;
          opened_folderPaths[newId].zindex = newRef.current.maxZindex;
          newRef.current.updateOnlyZindex();
          updatefolderarray(opened_folderPaths);
        }
      } else addNotification('error', 'Error', 'File Not Found !');
    }
  };

  const handleAuthorized = (name) => {
    let folder = newRef.current.Folder;
    let userRef = newRef.current.user;
    if (folder.path == 'root') {
      return userRef.isAdmin;
    } else {
      if (userRef.isAdmin) return true;
      else if (folder.path === 'root#public' && !name.includes('.')) return true;
      else return folder.editableBy.id === userRef.id;
    }
  };
  const handleCreateFolder = async (name) => {
    var folder = newRef.current.Folder;
    var userRef = newRef.current.user;
    console.log(userRef);
    if (handleAuthorized(name) && folder) {
      var newEditableBy = '';
      if (folder.path == 'root' && userRef.isAdmin) newEditableBy = userRef.id;
      else if (folder.editableBy.id === userRef.id) newEditableBy = userRef.id;
      else if (folder.path == 'root#public') newEditableBy = userRef.id;
      else if (userRef.isAdmin) newEditableBy = folder.editableBy.id;
      var reg = /[$&+,:;=?@#|'<>.^*()%!-]/;
      var success = true;
      if (name !== '' && !reg.test(name)) {
        let folderContents = newRef.current.FolderContents;
        for (var i = 0; i < folderContents.length; i++) {
          obj = folderContents[i];

          if (obj.name === name && obj.type == 'folder') {
            addNotification('warning', 'Warning', 'Folder With Same Name Exists in this Directory !');
            success = false;

            break;
          }
        }
        if (success) {
          try {
            let res = await axios({
              method: 'POST',
              data: {
                folderName: name,
                parentPath: folder.path,
                folderCreator: newEditableBy,
              },
              url: `${backendUrl}/api/folders/createFolder`,
            });
            if (res) {
              console.log(res);
              obj = clone(newRef.current.dirPaths);
              var newFolder = res.data.data.newFolder;

              obj[folder.path].children = [...obj[folder.path].children, newFolder.name];
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
              console.log('the new dirPath is : ', obj, 'and the newfolder is : ', obj[newFolder_ClassObj.path]);
              UpdatedirPaths(obj);
              addNotification('success', 'Success', 'Folder Created !');
            } else {
            }
          } catch (err) {
            addNotification('error', 'Error', err.message);
          }
        }
      } else {
        addNotification('warning', 'Warning', 'Enter A Valid Name !');
      }
    } else {
      addNotification('warning', 'Warning', 'Not Auhthorized !');
    }
  };

  const deleteAuthorized = (data) => {
    let userRef = newRef.current.user;
    if (userRef.isAdmin) return true;
    if (data) return data.editableBy.id === userRef.id;
    else return false;
  };

  const recursiveDelete = async (path, type, object) => {
    // console.log('path for :', path, 'lets see', object);
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
      } else {
        console.log('Not deleted', { path: path, obj: obj });
      }
    }
  };

  const handleDelete = (name) => {
    let folder = newRef.current.Folder;
    let userRef = newRef.current.user;
    let dirRef = newRef.current.dirPaths;
    let FolderContents = newRef.current.dirPaths;
    let data = dirRef[folder.path + '#' + name];
    if (deleteAuthorized(data) && data) {
      let paths = [data.path];
      let names = [name];
      let latestChildrenArray = folder.children.filter((childName) => childName !== name);
      if (paths.length > 0 && names.length > 0) {
        axios({
          method: 'post',
          data: {
            paths: paths,
            names: names,
          },
          url: `${backendUrl}/api/files/deleteFilesAndFolders`,
        })
          .then((res) => {
            let dirRef = newRef.current.dirPaths;
            let folder = newRef.current.Folder;
            console.log(res);
            let object = clone(dirRef);
            var type = '';
            paths.map(async (path) => {
              type = path.includes('.') ? 'file' : 'folder';
              await recursiveDelete(path, type, object);
            });
            console.log('The latest children array should be : ', latestChildrenArray);
            object[folder.path].children = latestChildrenArray;
            console.log('new obj is : ', object);
            UpdatedirPaths(object);
            addNotification('success', 'Success', 'Successfully Deleted !');
          })
          .catch((err) => {
            addNotification('error', 'Error', err.message);
          });
      } else {
        console.log('OPPS an error occured!');
      }
    } else {
      addNotification('warning', 'Warning', 'Not Auhthorized !');
    }
  };
  //=====================================

  //====Functions=====================
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

  //===================================

  return (
    <div className="Terminal">
      <Terminal
        color="#C4BFBF"
        backgroundColor="rgb(34, 34, 34)"
        barColor="rgb(17, 17, 17)"
        style={{ fontSize: '1.11em' }}
        commands={commands}
        descriptions={descriptions}
        startState={['open', 'maximised', 'minimised']}
        hideTopBar={true}
        msg="Type help for command list"
      />
    </div>
  );
};
export default ReactTerminal;
