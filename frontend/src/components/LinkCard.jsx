
import {Link} from "react-router-dom"
import { Button } from "./ui/button";
import { Copy,Trash,Download } from "lucide-react";
import { toast } from "react-hot-toast";  

const customTitle=(title)=>{
    let hostname = new URL(title).hostname;

    hostname = hostname.replace(/^www\./,'');

    let newTitle = hostname.split(".")[0];

    return newTitle.charAt(0).toUpperCase()+newTitle.slice(1);
    

}

const copyToClipboard = (text) => {  
    navigator.clipboard.writeText(text);  
    toast.success("Link copied to clipboard!");  
  };

const downloadQr = ()=>{
    
}  
const LinkCard = ({url,fetchUrl,frontendUrl})=>{
    return(
        <div className="flex flex-col md:flex-row gap-5 shadow-lg rounded-md bg-gray-900 p-4 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-700">
            <img src={url?.qr} className="h-32 object-contain ring-blue-500 self-start" alt="qr-code"/>
            <Link to={`/link/${url?._id}`} className="flex flex-col flex-1">
            <span className='font-extrabold text-2xl cursor-pointer hover:underline'>{url?.title || customTitle(url?.redirectUrl) }</span>
             <span className='font-extrabold text-xl cursor-pointer hover:underline text-blue-400'> {frontendUrl}{url?.customUrl ? url.customUrl :url.shortUrl}</span>
            <span className=' flex items-center gap-1 hover:underline cursor-pointer truncate w-[90%]'>  {url?.redirectUrl}</span>
            <p className="flex items-end flex-1 text-gray-500 text-xs bottom-0">Created: {new Date(url?.createdAt).toLocaleDateString()}</p>
    
            </Link>

            <div className="flex gap-2 mt-2 sm:mt-0 cursor-pointer">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`${window.location.origin}/${url?.shortUrl}`)}
                      className="flex items-center gap-1"
                    >
                      <Copy size={16} /> 
                    </Button>

                    <Button
                    variant="secondary"
                    size="sm"
                     className="flex items-center gap-1 hover:bg-black">
                        <Download size={16}/> 
                    </Button>
                      <Button 
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1 hover:bg-red-500" >
                        <Trash size={16}/> 
                      </Button>
                   

                    </div>

        </div>
    )
}

export default LinkCard;