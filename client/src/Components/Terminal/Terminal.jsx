import React,{useState,useRef,useEffect} from "react";
import Terminal from "terminal-in-react";
import "./Terminal.scss";

//import fullscreen_icon from "../assets/fullscreen.svg";

const ReactTerminal = ()=>
{
    const [String,setString]=useState("");
    const StringRef=useRef('');
    
    useEffect(()=>
    {
        StringRef.current=String;
    },[String])

    //Commands
    const commands =  {
        'open-google': () => window.open('https://www.google.com/', '_blank'),
    
            popup: () => alert('Oni Chaan!!'),
    
         cd :(args,print,runcommand)=>
         {
             const text=args.slice(1).join(' ');
             if(text!=="..")
             {
                const directory=text.split("/").join('.');
                 print(`Inside ${(StringRef.current+'/'+directory).split('.').join('/')}`)
                // alert(`Lets go into ${text}`);
                    setString(StringRef.current+'.'+directory);
             }
             else
             {
                const directory=StringRef.current.split('.');
                directory.pop();
               
                print(`Inside ${directory.join('/')}`);
                setString(directory.join('.'));
             }
         },
         mkdir:(args,print,runcommand)=>
         {
             const text=args.slice(1).join(' ');
             if(text)
             {
                 //alert(`Lets make ${text} Folder!!`)
                 print(`${text} created!`)
                 setString(text);
             }
         }
         ,touch:(args,print,runcommand)=>
         {
             const text=args.slice(1).join(' ');
             if(text)
             {
                 //alert(`Lets make ${text} file!!`)
                 print(`${text} created!`)
                 setString(text);
             }
         }
    }
    //Commands=


    //Descriptions
    const descriptions={
        'open-google': '........opens google.com',
        showmsg: '........shows a message',
        alert: '........alert', popup: '........alert',
        cd:'........Enters the Directory',
        mkdir:'........Creates a Folder',
        touch:"........Creates a File"
    }
    //===========

    return(
        <div className="Terminal">
            
            <Terminal
            color='#C4BFBF   '
            backgroundColor='rgb(34, 34, 34)'
            barColor='rgb(17, 17, 17)'
            style={{  fontSize: "1.11em" }}

            commands={commands}
            descriptions={descriptions}
            
            startState={[
                'open', 'maximised', 'minimised'
            ]}
            hideTopBar={true}
            msg='You can write anything here. Example - Hello! My name is Ankur !!.'
            />
        </div>
    )
    
}
export default ReactTerminal;
