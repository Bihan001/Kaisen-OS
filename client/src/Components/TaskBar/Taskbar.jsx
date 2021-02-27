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
    var opened_dirPaths;
    var newpath;
    //===================

    const {theme,ChangeTheme}=useContext(ThemeContext);
    const [buttonthemes,setbuttonthemes]=useState({
        backgroundColor:'transparent'
    });

    const handlerestoresize=(data)=>
    {
        opened_dirPaths={};
        if(data.type=='folder')
        {
            opened_dirPaths=clone(folderarray);
            if(opened_dirPaths[data.path])
            {
                opened_dirPaths[data.path].minimized=false;
                updatefolderarray(opened_dirPaths);
            }

         
        }
        else
        {
          
            opened_dirPaths=clone(filearray);
            if(opened_dirPaths[data.path])
            {
                opened_dirPaths[data.path].minimized=false;
                updatefilearray(opened_dirPaths);
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
                    {Object.keys(filearray).map((dir)=>
                    {
                        if(filearray[dir].minimized)
                            return <img src={handleIcon(filearray[dir])} key={filearray[dir].path} onClick={()=>handlerestoresize(filearray[dir])}/>
                    })}
                
                    {Object.keys(folderarray).map((dir)=>
                    {
                        if(folderarray[dir].minimized)
                            return <img src={handleIcon(folderarray[dir])} key={folderarray[dir].path} onClick={()=>handlerestoresize(folderarray[dir])}/>
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