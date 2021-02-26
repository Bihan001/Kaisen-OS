import React,{useState,useEffect,useContext} from "react";
import {clone} from "ramda";
import "./Taskbar.scss";

import k from "../../assets/icons/k.png";
import {handleIcon} from "../../Utility/functions";


import {ThemeContext} from "../../Contexts/ThemeContext/ThemeContext";

const Taskbar =({
    togglecolorpalatte,
    togglemenu,
    filearray,
    updatefilearray,
    folderarray,
    updatefolderarray
})=>
{

    //Utility Variables
    var obj;
    var array=[];
    var newpath;
    //===================

    const {theme,ChangeTheme}=useContext(ThemeContext);
    const [buttonthemes,setbuttonthemes]=useState({
        backgroundColor:'transparent'
    });

    const handlerestoresize=(data)=>
    {
        array=[];
        if(data.type=='folder')
        {
            array=clone(folderarray);
            obj=array.find((object)=>object.path===data.path)
            if(obj)
            {
                obj.minimized=false;
                updatefolderarray(array);
            }
        }
        else
        {
          
            array=clone(filearray);
            obj=array.find((object)=>object.path===data.path);
            if(obj)
            {
                obj.minimized=false;
                updatefilearray(array);
            }

        }
    }


    return(
        <div className="Taskbar Frosted_Glass" >
            <div className="Apps_N_Info">
                <div className="Kaisen_Button" 

                style={buttonthemes} 
                onMouseEnter={()=>setbuttonthemes({backgroundColor:theme})}
                onMouseLeave={()=>setbuttonthemes({backgroundColor:"transparent"})}
                ><img src={k}/>
                </div>

                <div className="Icons">
                    {filearray.map((file)=>
                    {
                        if(file.minimized)
                            return <img src={handleIcon(file)} key={file.path} onClick={()=>handlerestoresize(file)}/>
                    })}
                
                    {folderarray.map((folder)=>
                    {
                        if(folder.minimized)
                            return <img src={handleIcon(folder)} key={folder.path} onClick={()=>handlerestoresize(folder)}/>
                    })}
                </div>
            </div>

            <div className="Time_N_Color">
                <div className="Color_div">
                    <div className="palatte_icon" style={{backgroundColor:theme}} onClick={togglecolorpalatte}></div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}
export default Taskbar;