import React,{useState,useEffect,useContext,useRef} from "react";
import {ThemeContext} from "../../Contexts/ThemeContext/ThemeContext";

import {motion} from "framer-motion";
import {clone, set} from "ramda";
import "./File.scss";

import ReactTerminal from "../Terminal/Terminal";



const Particular_File = ({data,updatefilearray,filearray})=>
{
    const {theme}=useContext(ThemeContext);

    const [state,setState]=useState(null);
    const [draggable,setdraggable]=useState(false);

    const [Component,setComponent]=useState(<></>);

   

    //Utility Variables
    var tempfile;
    var filearray_clone;
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
            filearray_clone=clone(filearray);
            tempfile=filearray_clone.find((obj)=>obj.path===state.path);
            tempfile.minimized=state.minimized;
            updatefilearray(filearray_clone);
        }
      

    },[state])
    const handleminizestatus = ()=> //Updating the minimiziing Function
    {
        tempfile=clone(state);
        tempfile.minimized=!tempfile.minimized;

       

        setState(tempfile);
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
                            <div className="Window_Buttons"> 
                                <div className="Green" onClick={handleminizestatus}></div>
                                <div className="Yellow"> </div>
                                <div className="Red"></div>
                            </div>
                        </div>
                        <div className="File_Config_Window">
                            {Component}
                        </div>
                </motion.div>}
                </>}
        
        
        </>
        
    )
}
export default Particular_File;