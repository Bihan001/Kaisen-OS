import React, { useState, useEffect, createContext, useContext } from 'react';
import { ClassFolder, ClassFile } from '../../Classes/Classes';
import axios from 'axios';
import { clone } from 'ramda';
import { backendUrl } from '../../backendUrl';
import { AuthContext } from '../AuthContext';

export const DirectoryContext = createContext();

export const DirectoryProvider = (props) => {
  const { user } = useContext(AuthContext);
  const [dirPaths, setdirPaths] = useState({
    /*"root":new ClassFolder("root",new Date(),new Date(),{name:'Ankur'},"root","folder",["root#a","root#terminal.exe","root#x"]),
        "root#a":new ClassFolder("a",new Date(),new Date(),{name:'Ankur'},"root#a","folder",["root#a#b.txt","root#a#c"]),
        "root#x":new ClassFolder("x",new Date(),new Date(),{name:'Ankur'},"root#x","folder",[]),
        "root#terminal.exe":new ClassFile("terminal",new Date(),new Date(),{name:'Ankur'},"root#terminal.exe",".exe",""),
       
        "root#a#c":new ClassFolder("c",new Date(),new Date(),{name:'Ankur'},"root#a#c","folder",["root#a#c#d.txt"]),
        "root#a#c#d.txt":new ClassFile("d",new Date(),new Date(),{name:'Ankur'},"root#a#c#d.txt",".txt","Hello World!"),
        "root#a#b.txt":new ClassFile("b",new Date(),new Date(),{name:'Ankur'},"root#a#b.txt",".txt","Hello World! f"),*/
  });

  const UpdatedirPaths = (array) => {
    setdirPaths(array);
  };

  /*useEffect(()=>
    {
        axios({
            method:'POST',
            data:{
                folderName:'root',
                parentPath:''
            },
            url:`${backendUrl}/api/folders/createFolder`
        }).then((res)=>{
            console.log(res);
        }).catch((err)=>console.log(err));
    },[])*/

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${backendUrl}/api/folders/getRootSubFolders`,
    })
      .then((res) => {
        console.log(res);
        var dirObj = {};
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
        setdirPaths(dirObj);
        //console.log(dirObj);
      })
      .catch((err) => console.log(err));
  }, [user]);

  return (
    <DirectoryContext.Provider
      value={{
        dirPaths: dirPaths,
        UpdatedirPaths: UpdatedirPaths,
      }}>
      {props.children}
    </DirectoryContext.Provider>
  );
};
