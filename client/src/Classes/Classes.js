
class MainFile
{
    constructor( name , date_created , date_modified , creator , path , type )
    {
        this.name=name;
        this.date_created=date_created;
        this.date_modified=date_modified;
        this.creator=creator;
        this.path=path;
        this.type=type;

        this.minimized=false;
        this.closed=false;
    }

   
   

}

class Folder extends MainFile
{
    constructor(name , date_created , date_modified , creator , path , type , children)
    {
        super(name , date_created , date_modified , creator , path , type);
        this.children=children;
    }
 
  
}

class File extends MainFile
{
  
    
    constructor(name , date_created , date_modified , creator , path , type, content)
    {
        super(name , date_created , date_modified , creator , path , type);
        this.content=content;
       
    }
}

export {Folder,File};