import React,{useState,useEffect,useRef,useContext} from "react";
import {clone} from "ramda";
import "./Desktop.scss";
//import bgvideo from "../../assets/videos/bgvideo.mp4"


import {ThemeContext} from "../../Contexts/ThemeContext/ThemeContext";
import {DirectoryContext} from "../../Contexts/DirectoryContext/DirectoryContext";


import Taskbar from "../../Components/TaskBar/Taskbar";
import Particular_File from "../../Components/File/File";
import File_Explorer from "../../Components/File_Explorer/File_Explorer";


import {Folder,File} from "../../Classes/Classes";

import {handleIcon} from "../../Utility/functions";

const Desktop = (props)=>
{
    const {theme,ChangeTheme}=useContext(ThemeContext);
    const {dirPaths,UpdatedirPaths}=useContext(DirectoryContext);

    const [openedfiles,setopenedfiles]=useState([]);
    const [openedfolders,setopenedfolders]=useState([]);

    //Utility Variables 
    var newdir ; //type:String
    var obj;
    var array=[];
    //=================

    //taskbar States============================================
    //const [showtaskbarfloatingcontents,setshowtaskbarfloatingcontents]=useState(false);
    const [showcolorpalatte,setshowcolorpalatte]=useState(false)
    const [showmenu,setshowmenu]=useState(false);
    //taskbar states==============================

    useEffect(()=>
    {
        const file =new Folder("Demo",Date.now(),Date.now(),{},"root#a",'folder');
        console.log(file);
    },[])
   
    //Functions
    const handleOpen = (data)=>
    {
        array=[];
        if(data.type=='folder')  //this works
        {   
            array=clone(openedfolders);
            obj=array.find((object)=>object.path===data.path); 
            if(!obj)
            {
                setopenedfolders([...openedfolders,data]);

            }
        }
        else if( (data.type=='.exe' || data.type=='.txt' ||  data.type=='.mp3' ||  data.type=='.mp4' ) )
        {
            
            array=clone(openedfiles);
            obj=array.find((object)=>object.path===data.path);  //tells that the application is already opened!
            if(!obj)
            {
                setopenedfiles([...openedfiles,data]);
            }

            
        }

    }

    const updatefilearray = (array)=>
    {
        setopenedfiles(array);
    }
    const updatefolderarray = (array) =>
    {
        setopenedfolders(array);
    }
    //==========
   
    return(
        <div className="Desktop" >
            


            {/* <div className="bg-video">
                 <video className="bg-video-content" autoPlay muted loop>
                    <source src={bgvideo} type="video/mp4"/>
                     <source src={bgvideo} type="video/webm"/>
                            Browser is NOt Supported!!
                 </video>
            </div> */}

            {dirPaths!==null && (
                <div className="Desktop_Icons_div">
                   {Object.keys(dirPaths).map((dir)=>{
                       newdir=dir.toString().split('#');
                       newdir.pop();
                       newdir.join('#');
                       if(newdir=='root')
                        return (
                            <div className="Icons" key={dirPaths[dir].path}>
                                <img src={handleIcon(dirPaths[dir])} onClick={()=>handleOpen(dirPaths[dir])}/>
                                <div>{dirPaths[dir].name}</div>
                            </div>

                        )
                   })}
                </div>
            )}

           {openedfolders.length!==0 && (
               <div className="Folders_Window_div">
                   {openedfolders.map((folder,index)=>(
                       <File_Explorer
                        data={folder}
                        folderarray={openedfolders}
                        updatefolderarray={updatefolderarray}
                        filearray={openedfiles}
                        updatefilearray={updatefilearray}
                        key={index}
                       />
                   ))}
               </div> 
           )}

           {openedfiles.length!==0 && (
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
           )}

            {
                showcolorpalatte && (
                    <div className="Color_Palatte" style={{backgroundColor:theme}}> 
                        <div className="Color_Palatte__First-div">
                            Choose a Theme
                        </div>
                        <div className="Color_Palatte__Second-div">
                            <div className="Pink" onClick={()=>ChangeTheme('#F5CFCF')}></div>
                            <div className="Purple" onClick={()=>ChangeTheme('#D7BDE2 ')}></div>
                            <div className="Teal" onClick={()=>ChangeTheme('#40e0d0')}></div>
                        </div>
                        
                    </div>
                )
            }
            <Taskbar  
            togglecolorpalatte={()=>setshowcolorpalatte(!showcolorpalatte)}
             togglemenu={()=>setshowmenu(!showmenu)}
             filearray={openedfiles}
             updatefilearray={updatefilearray}
             folderarray={openedfolders}
             updatefolderarray={updatefolderarray}
             />
        </div>
    )
}
export default Desktop;