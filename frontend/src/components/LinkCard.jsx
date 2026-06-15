
import {Link} from "react-router-dom"
import { useRef } from "react";
import { Button } from "./ui/button";
import { Copy,Trash,Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { BackendUrl } from '@/utils/Urls';
import CustomAlert from "./CustomAlert"; 
import { downloadQr } from "@/utils/DownloadQr";


const customTitle=(title)=>{
    let hostname = new URL(title).hostname;

    hostname = hostname.replace(/^www\./,'');

    let newTitle = hostname.split(".")[0];

    return newTitle.charAt(0).toUpperCase()+newTitle.slice(1);
    

}


  
const LinkCard = ({url,showToast,deleteUrl,fetchData})=>{
  const qrCanvasRef = useRef(null);
  const shortUrl = `${BackendUrl}/${url?.customUrl ? url.customUrl : url.shortUrl}`;

 const handleDelete = async (urlId) => {
    try {
      await deleteUrl({ backendUrl: BackendUrl, token: localStorage.getItem("token"), urlId });
      showToast("URL deleted successfully!", "success");
      fetchData();
    } catch (error) {
      showToast("Failed to delete URL", error);
    }
  };
  
  const copyToClipboard = (text) => {  
    navigator.clipboard.writeText(text);  
    showToast("Link copied to clipboard!","success");
  };
 

    return(
        <div className="flex flex-col md:flex-row gap-5 rounded-lg bg-card border border-border p-4">
        
            <QRCodeCanvas
              value={shortUrl}
              size={128}
              className="h-24 w-24 self-start rounded-md border border-border p-1 bg-white"
              ref={qrCanvasRef}
            />
            <Link to={`/link/${url?.shortUrl}`} className="flex flex-col flex-1 min-w-0">
            <span className='font-bold text-xl'>{url?.title || customTitle(url?.redirectUrl) }</span>
             <span className='text-primary font-medium text-base'> {shortUrl}</span>
            <span className='flex items-center gap-1 truncate text-muted-foreground'>  {url?.redirectUrl}</span>
           
            <p className="flex items-end flex-1 text-muted-foreground text-xs mt-2">Created: {new Date(url?.createdAt).toLocaleDateString()}</p>
    
            </Link>
            <div className="flex gap-2 items-start">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(shortUrl)}
                      aria-label="Copy short link"
                    >
                      <Copy size={16} aria-hidden="true" />
                    </Button>
                    

                    <Button
                    variant="outline"
                    size="icon"
                    onClick={() => downloadQr(qrCanvasRef.current, url?.title, showToast)}
                    aria-label="Download QR code"
                    >
                        <Download size={16} aria-hidden="true" />
                    </Button>
                    <CustomAlert
  message="Are you sure you want to delete this link? This action cannot be undone."
  confirmText="Yes, Delete"
  cancelText="Cancel"
  onConfirm={() => handleDelete(url?._id)}
  onCancel={() => showToast("Cancelled deletion", "error")}
  triggerText={<Trash size={16} aria-hidden="true" />} 
  triggerLabel="Delete link"
  triggerSize="icon"
  variant="destructive" 
/>
            </div>

        </div>
    )
}

export default LinkCard;
