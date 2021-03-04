const handleIcon=(data)=>
{
    //console.log(data);
    if(data.type==='folder')
        return 'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1614057434/folder-icon_uv8y4m.png';
    else 
    {
        if(data.name=='terminal' && data.type=='.exe')
        return 'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1614061685/terminal-icon_ac2sdv.png' 

        if(data.type=='.txt')
            return 'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1614060786/ba31ac1ab88b5c17cc84283621a6e702_m4cirp.png'
    }
}



const typeArray=[
    {
        type:'.txt',
        icon:'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1614060786/ba31ac1ab88b5c17cc84283621a6e702_m4cirp.png',
        
    },
    {
        type:'folder',
        icon:'https://res.cloudinary.com/drolmjcot/image/upload/q_auto:good/v1614057434/folder-icon_uv8y4m.png'
    }
]



export {
    handleIcon,
    typeArray
}