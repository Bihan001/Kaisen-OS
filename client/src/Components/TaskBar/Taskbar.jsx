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

    const handlerestoresize=(data,id)=>
    {
        opened_dirPaths={};
        if(data.type=='folder')
        {
            opened_dirPaths=clone(folderarray);
            if(opened_dirPaths[id])
            {
                opened_dirPaths[id].minimized=false;
                updatefolderarray(opened_dirPaths);
            }

         
        }
        else
        {
          
            opened_dirPaths=clone(filearray);
            if(opened_dirPaths[id])
            {
                opened_dirPaths[id].minimized=false;
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
                    {Object.keys(filearray).map((id)=>
                    {
                        if(filearray[id].minimized)
                            return <img src={handleIcon(filearray[id])} key={id} onClick={()=>handlerestoresize(filearray[id],id)}/>
                    })}
                
                    {Object.keys(folderarray).map((id)=>
                    {
                        if(folderarray[id].minimized)
                            return <img src={handleIcon(folderarray[id])} key={id} onClick={()=>handlerestoresize(folderarray[id],id)}/>
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