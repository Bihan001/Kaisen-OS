import React,{useState,useEffect,useContext} from "react";
import "./File_Explorer.scss";
import {ThemeContext} from "../../Contexts/ThemeContext/ThemeContext";
import {DirectoryContext} from "../../Contexts/DirectoryContext/DirectoryContext";

import {handleIcon} from "../../Utility/functions";

import back from "../../assets/icons/back.png"


import {motion} from "framer-motion";
import {clone} from "ramda";

const File_Explorer=({data,initialfolderpath,folderarray,updatefolderarray,filearray,updatefilearray})=>
{
    const {theme}=useContext(ThemeContext);
    const {dirPaths,UpdatedirPaths}=useContext(DirectoryContext);


    //Utility Variables
    var obj;
    var opened_dirPaths={};
    var newpath;
    var htmlelements;
    //===================

    //States====================
    const [draggable,setdraggable]=useState(false);
    const [Folder,setFolder]=useState(null);
    const [FolderContents,setFolderContents]=useState([]);

   // const [initialfolderpath,setinitialfolderpath]=useState("");
    //======================


    //UseEffects===========
    useEffect(()=>
    {
        setFolder(data);
        //setinitialfolderpath(data.path);
    },[])

    useEffect(()=>  //For updatng minimized
    {
        if(Folder && !data.minimized)
        {
            obj=clone(Folder);
            obj.minimized=data.minimized;
            setFolder(obj);
        }
            
    },[data.minimized])

    useEffect(()=>
    {  
        if(Folder)
        {
            
            loadfoldercontents(Folder);

        }
       
    },[Folder])

    //==================

    //Functions
    const handleSelectAll=(e)=>
    {
           if(FolderContents.length>0)
           {
              // htmlelements=[]
               FolderContents.map((content)=>
               {
                   obj=document.getElementById(content.name);
                   if(obj)
                   {
                    if(e.target.checked)
                        obj.checked=true;
                    else
                        obj.checked=false;

                    document.getElementById(content.name).innerHTML=obj;
                   }
                    
               })
               
           }

    }

    const handlecontentclicked=(data)=>
    {
        if(data.type=='folder')
        {
            setFolder(data);
            
        }
        else 
        {
            opened_dirPaths={};
            opened_dirPaths=clone(filearray);
            if(!opened_dirPaths[data.path])
            {
                opened_dirPaths[data.path]=data;
                updatefilearray(opened_dirPaths);
            }
            else
            {
                if(opened_dirPaths[data.path].closed)
                {
                    opened_dirPaths[data.path].closed=false;
                    updatefilearray(opened_dirPaths);
                }
            }

           
            
        }
    }
    
    const handleback=()=>
    {
        if(Folder)
        {
            newpath = Folder.path.split('#');
            newpath.pop();
            newpath=newpath.join('#');
           
            obj = dirPaths[newpath];
            
            if(obj)
            {
                setFolder(obj);
            }
               
        }
    }
    useEffect(()=> //handling minimize update
    { 
        if(Folder)
        {
            opened_dirPaths={}
            opened_dirPaths=clone(folderarray);
            if(opened_dirPaths[initialfolderpath])
            {
                opened_dirPaths[initialfolderpath].minimized=Folder.minimized;
                updatefolderarray(opened_dirPaths);
            }

            
        }
      
    },[Folder])
    const handleminizestatus=()=>
    {
        obj=clone(Folder);
        obj.minimized=!obj.minimized;
        setFolder(obj);
    }

    const handlecloseapp=()=>
    {
        opened_dirPaths={};
        opened_dirPaths=clone(folderarray);

        if(opened_dirPaths[initialfolderpath])
        {
            console.log(opened_dirPaths[initialfolderpath]);

           opened_dirPaths[initialfolderpath].closed=true;
            updatefolderarray(opened_dirPaths);
        }

        
    }

    const loadfoldercontents=(data)=>
    {
        if(data.children.length>0 && data.children[0]) //This Condition tells that data was already loaded in frontend
        {
            obj=dirPaths[data.children[0]]; // Just hecking the first obj in children array which will tell if the level is loaded or not
            if(obj)
            {
                var array=[]
                data.children.map((path)=>
                {
                    array.push(dirPaths[path]);
                })
                setFolderContents(array);
            }
            else 
            {
                //have to make axios request to get the folder contents!!
            }
        }
        else
            setFolderContents([]);
    }
    //=========

    return(
        <>
            {Folder && <>
            
                {!Folder.minimized && <motion.div className="File_Explorer"  style={{width:'fit-content',height:'fit-content',}}
                    drag={draggable} 
                    dragConstraints={{ left:-160, right:160 ,top:-30,bottom:50}}
                    dragElastic={0.1}
                    >
                        <div className="Topbar" 
                            onFocus={()=>setdraggable(true)} 
                            onBlur={()=>setdraggable(false)}
                            style={{backgroundColor:theme}}
                            tabIndex="-1"
                            >
                                <div className="Window_Buttons"> 
                                    <div className="Green" onClick={handleminizestatus}></div>
                                    <div className="Yellow"> </div>
                                    <div className="Red" onClick={handlecloseapp}></div>
                                </div>
                        </div>

                        {Folder && (
                            <div className="File_Explorer_Config_Window " >
                            <div className="Path">
                                <div onClick={handleback}><img src={back}/></div>
                                <div>{Folder.path.split('#').join('/')}</div>
                            </div>
                                <div className="Lower_Segment ">
                                    <div className="Row headings">
                                        <div className="First">
                                            <div className="form-group">
                                                <input type="checkbox" id="Select_All" onClick={(e)=>handleSelectAll(e)}/>
                                                <label htmlFor="Select_All">
                                                    Select all
                                                </label>
                                            </div>
                                        </div>
                                        <div className="Second">
                                            <div>Date Modified</div>
                                            <div>Type</div>
                                        </div>
                                    </div>
                                    {FolderContents.map((content,index)=>(
                                        <div className={index%2==0?"Row Content grey":"Row Content white"} onDoubleClick={()=>handlecontentclicked(content)} key={content.name}>
                                            <div className="form-group" >
                                                <input type="checkbox" id={content.name} value={content.path}/>
                                                <label htmlFor={content.name}>
                                                    <div>
                                                        <img src={handleIcon(content)}/>
                                                        <div>{content.name}</div>
                                                    </div>
                                                
                                                </label>
                                            </div>
                                            <div className="content-data">
                                                    <div>{content.date_modified.toISOString().substring(0, 10)}</div>   
                                                    <div>{content.type}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        

                </motion.div>}
            </>}
        
        </>
       
    )
}
export default File_Explorer;