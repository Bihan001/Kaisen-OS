import React,{useState,useEffect,useContext,useRef} from "react";
import {ThemeContext} from "../../Contexts/ThemeContext/ThemeContext";

import {motion} from "framer-motion";
import {clone, set} from "ramda";
import "./File.scss";

import ReactTerminal from "../Terminal/Terminal";



const Particular_File = ({data,updatefilearray,filearray,handleZindex,id})=>
{
    const {theme}=useContext(ThemeContext);

    const [state,setState]=useState(null);
    const [draggable,setdraggable]=useState(false);

    const [Component,setComponent]=useState(<></>);

   

    //Utility Variables
    var tempfile;
    var opened_dirPaths;
    //var Component;
    //=================
    useEffect(()=>
    {

        setState(data);
         if(data.name=='terminal')
          setComponent(<ReactTerminal/>);
       // console.log(Component);
        
    },[])

    useEffect(()=>
    {
        if(Component!==<></>) 
            setState(data);
    },[data.minimized])

   

    useEffect(()=>  //Updating the minimizing function
    {
        if(state)
        {
            opened_dirPaths=clone(filearray);

            if(opened_dirPaths[id])
            {
                opened_dirPaths[id].minimized=state.minimized;
                updatefilearray(opened_dirPaths);
            }

           
        }
      

    },[state])
    const handleminizestatus = ()=> //Updating the minimiziing Function
    {
        tempfile=clone(state);
        tempfile.minimized=!tempfile.minimized;

       

        setState(tempfile);
    }
    const handlecloseapp=()=>
    {
        opened_dirPaths={};
        opened_dirPaths=clone(filearray);
        if(opened_dirPaths[id])
        {
            delete opened_dirPaths[id];
           //opened_dirPaths[state.path].closed=true;
            updatefilearray(opened_dirPaths);
        }
    }
    const FilehandleZindex=()=>
    {
        handleZindex(id,'file_div');
    }
    
    return(
        <>
            {state && <>
                {!state.minimized && <motion.div className="File"  style={{width:'fit-content',height:'fit-content',}}
                drag={draggable} 
                dragElastic={.3}
                dragConstraints={{ left:-150, right:500 ,top:-15,bottom:10}}
                >
                        <div className="Topbar" 
                        onFocus={()=>setdraggable(true)} 
                        onBlur={()=>setdraggable(false)}
                        style={{backgroundColor:theme}}
                        tabIndex="-1"
                        >
                            <div className="Topbar__Zindex_handler" onClick={FilehandleZindex}></div>
                            <div className="Window_Buttons"> 
                                <div className="Green" onClick={handleminizestatus}></div>
                                <div className="Yellow"> </div>
                                <div className="Red" onClick={handlecloseapp}></div>
                            </div>
                        </div>
                        <div className="File_Config_Window" onClick={FilehandleZindex}>
                            {Component}
                        </div>
                </motion.div>}
                </>}
        
        
        </>
        
    )
}
export default Particular_File;