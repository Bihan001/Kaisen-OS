import React,{useState,createContext} from "react";
import {Folder,File} from "../../Classes/Classes";

export const DirectoryContext=createContext();

export const DirectoryProvider=(props)=>
{
  
    const [dirPaths,setdirPaths]=useState({
        "root":new Folder("root",new Date(),new Date(),{name:'Ankur'},"root","folder",["root#a","root#terminal.exe","root#x"]),
        "root#a":new Folder("a",new Date(),new Date(),{name:'Ankur'},"root#a","folder",["root#a#b.txt","root#a#c"]),
        "root#x":new Folder("x",new Date(),new Date(),{name:'Ankur'},"root#x","folder",[]),
        "root#terminal.exe":new File("terminal",new Date(),new Date(),{name:'Ankur'},"root#terminal.exe",".exe",""),
       
        "root#a#c":new Folder("c",new Date(),new Date(),{name:'Ankur'},"root#a#c","folder",["root#a#c#d.txt"]),
        "root#a#c#d.txt":new File("d",new Date(),new Date(),{name:'Ankur'},"root#a#c#d.txt",".txt","Hello World!"),
        "root#a#b.txt":new File("b",new Date(),new Date(),{name:'Ankur'},"root#a#b.txt",".txt","Hello World! f"),

    });

    const UpdatedirPaths = (array)=>
    {
        setdirPaths(array);
    }
    
    return(
        <DirectoryContext.Provider
            value={
                {
                   dirPaths:dirPaths,
                   UpdatedirPaths:UpdatedirPaths
                }
            }
        >
            {props.children}
        </DirectoryContext.Provider>
    )
}