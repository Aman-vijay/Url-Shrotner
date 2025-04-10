import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { BackendUrl } from '@/utils/Urls';
import useFetch from '@/hooks/useFetch';
import { BarLoader } from 'react-spinners';
import { LinkIcon } from 'lucide-react';
import CustomAlert from "../components/CustomAlert"; 
import { toast, Toaster } from "react-hot-toast"; 
import { downloadQr } from '@/utils/DownloadQr';
import { Copy,Trash,Download } from "lucide-react";
import { Button } from '@/components/ui/button';




const Link = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, { position: "bottom-left" });
    } else {
      toast.error(message, { position: "bottom-left" });
    }
  };

  


  const handleDelete = async (urlId) => {
    try {
      const res = await fetch(`${BackendUrl}/api/deleteUrl/${urlId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete the URL');
      }
      
      const data = await res.json();
      showToast("URL deleted successfully", "success");
      
      
      return data;
    }
    catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete URL", "error");
    }
  }
    
  

  
  const copyToClipboard = (text) => {  
    navigator.clipboard.writeText(text);  
    showToast("Link copied to clipboard!","success");
  };
  
  const fetchUrlById = async ()=>{
    try{
      const response = await fetch(`${BackendUrl}/api/url/${id}`,{
        method:"GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"}
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const res = await response.json();
         return res;
    }
    catch(err){
      throw new Error(`HTTP error! status: ${err}`);

    }
  }

  const fetchAnalytics = async () => {
    try {
    
      
      const response = await fetch(`${BackendUrl}/api/analytics/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const res = await response.json();
       return res;
  
   
    } catch (err) {
    
      console.error('Error fetching analytics:', err);
    }
  };
  

  const { error,data:analytics, loading, fetchData} = useFetch(fetchAnalytics);
  const { error:urlError,data:url,  fetchData:fetchUrl} = useFetch(fetchUrlById);

  useEffect(() => {
   

    if (id) {
      fetchData();
      fetchUrl();
    }
  }, [id]);

  if (loading) {
    return <BarLoader className='mb-4' width={"100%"} color=''/>;
  }

  if (error || urlError) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }
  

  return (
    <div className='mx-auto p-4'>
      <h1 className="text-2xl font-bold mb-4">Analytics for: {id}</h1>
      <div className=" flex flex-col  gap-8   sm:flex-row justify-between">
         <Toaster position="top-left" reverseOrder={false} />
<div className='p-4 items-start gap-8 sm:w-2/5'>
      {url &&(
        <div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition  ">
            {url.map((item)=>{
              return(
               <div className='flex flex-col gap-4' key={item?.id}>
                <div className='text-2xl font-extrabold hover:underline cursor-pointer'>{item?.title}</div>
                <a className='text-3xl sm:text-xl text-blue-200 font-bold hover:underline cursor-pointer' href={`${BackendUrl}/${item?.shortUrl}`} target='_blank'> {BackendUrl}/{item?.shortUrl}</a>
                <div className='flex items-center text-lg sm:text-sm gap-1 hover:underline cursor-pointer'><LinkIcon className='p-1'/>{item?.redirectUrl}</div>
                <img src={item?.qr} className='w-40 h-40'/>
                <div className='flex items-end font-extralight text-sm'>Created: {new Date(item?.createdAt).toLocaleDateString()}</div>

                <div className="flex gap-2 mt-2 sm:mt-0 cursor-pointer">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`${BackendUrl}/${item?.shortUrl}`)}
                      className="flex items-center gap-1"
                    >
                      <Copy size={16} /> 
                    </Button>
                    

                    <Button
                    variant="secondary"
                    size="sm"
                    onClick={()=>downloadQr(item,showToast)}
                     className="flex items-center gap-1 hover:bg-black">
                        <Download size={16}/> 
                    </Button>
                    <CustomAlert
  message="Are you sure you want to delete this link? This action cannot be undone."
  confirmText="Yes, Delete"
  cancelText="Cancel"
  onConfirm={() => handleDelete(item?._id)}
  onCancel={() => showToast("Cancelled deletion", "error")}
  triggerText={<Trash size={16} />} 
  variant="destructive" 
/>

      </div>
                 
               </div>
              )
            })}
            </div>
        </div>
      )}
      </div>
     
     
<div className='p-4'>
      {analytics && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition">
              <h2 className="text-lg font-semibold">Total Clicks</h2>
              <p className="text-3xl font-bold">{analytics.totalClicks}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition">
              <h2 className="text-lg font-semibold">Original URL</h2>
              <p className="text-sm break-all">{analytics.url}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition">
              <h2 className="text-lg font-semibold">Created At</h2>
              <p>{new Date(analytics.createdAt).toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/15 transition">
              <h2 className="text-lg font-semibold">Last Clicked</h2>
              <p>{analytics.lastClickedAt ? new Date(analytics.lastClickedAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Clicks Per Day</h2>
            {analytics.clicksPerDay && Object.keys(analytics.clicksPerDay).length > 0 ? (
              <div className="overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(analytics.clicksPerDay).map(([date, count], index) => (
                      <tr key={date} className={index % 2 === 0 ? "bg-white/5" : ""}>
                        <td className="px-4 py-3">{date}</td>
                        <td className="px-4 py-3">{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="bg-white/10 p-4 rounded-lg">No daily click analytics available</p>
            )}
          </div>
        </div>
      )}
      </div>
      </div>
    </div>
  );
};


export default Link;