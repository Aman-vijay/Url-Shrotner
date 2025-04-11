import React, { useEffect,lazy,Suspense } from 'react';
import { useParams,useNavigate } from "react-router-dom";
import { BackendUrl } from '@/utils/Urls';
import useFetch from '@/hooks/useFetch';
import { BarLoader } from 'react-spinners';
import { LinkIcon } from 'lucide-react';
import CustomAlert from "../components/CustomAlert"; 
import { toast, Toaster } from "react-hot-toast"; 
import { downloadQr } from '@/utils/DownloadQr';
import { Copy,Trash,Download } from "lucide-react";
import { Button } from '@/components/ui/button';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



const LocationStats = lazy(()=> import("../components/LocationStats"))
const DeviceStats = lazy(()=> import("../components/DeviceStats"))
const Link = () => {
  const navigate = useNavigate();
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
      setTimeout(()=>{
        navigate("/dashboard")
      },500)
      
      
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
      console.log(res)
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
    <div className="mx-auto max-w-7xl px-4 py-6">
    <Toaster position="top-left" reverseOrder={false} />
    <h1 className="text-3xl font-extrabold mb-6 text-white">
      Analytics for: <span className="text-blue-300">{id}</span>
    </h1>

    <div className="flex flex-col gap-10 sm:flex-row justify-between">
      {/* URL Card Section */}
      <div className="sm:w-2/5 space-y-8">
        {url && (
          <div className="space-y-6">
            {url.map((item) => (
              <div
                key={item?.id}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/15 transition shadow-lg"
              >
                <div className="flex flex-col gap-4">
                  <div className="text-2xl font-bold text-white hover:underline cursor-pointer">
                    {item?.title}
                  </div>

                  <a
                    href={`${BackendUrl}/${item?.shortUrl}`}
                    target="_blank"
                    className="text-xl sm:text-lg text-blue-300 font-semibold hover:underline break-all"
                  >
                    {BackendUrl}/{item?.shortUrl}
                  </a>

                  <div className="flex items-center text-sm gap-2 text-white/80 hover:underline cursor-pointer">
                    <LinkIcon className="w-4 h-4" />
                    {item?.redirectUrl}
                  </div>

                  <img
                    src={item?.qr}
                    className="w-full sm:w-3/4 self-center sm:self-start ring ring-blue-500 p-1 rounded-md object-contain"
                    alt="qr-code"
                  />

                  <div className="text-xs text-white/50">
                    Created: {new Date(item?.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(`${BackendUrl}/${item?.shortUrl}`)
                      }
                      className="flex items-center gap-1"
                    >
                      <Copy size={16} />
                      Copy
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadQr(item, showToast)}
                      className="flex items-center gap-1 hover:bg-black"
                    >
                      <Download size={16} />
                      Download
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
              </div>
            ))}
          </div>
        )}
      </div> 
     
     
      <div className="sm:w-3/5">
        {analytics && (
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 space-y-6">
            <CardHeader>
              <CardTitle className="text-white text-2xl font-semibold">
                Analytics Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-white">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/15 transition">
                  <h2 className="text-lg font-semibold">Total Clicks</h2>
                  <p className="text-3xl font-bold">{analytics.totalClicks}</p>
                </div>
                {analytics.clicks && analytics.clicks.length > 0 ? (
  <Tabs defaultValue="location" className="w-full mt-6">
    <TabsList className="flex flex-wrap justify-start bg-white/10 mb-4">
   
      <TabsTrigger value="location">Location Stats</TabsTrigger>
      <TabsTrigger value="device">Device Stats</TabsTrigger>
    </TabsList>
    <Suspense fallback = {<div>Loading chart...</div>}>
    <TabsContent value="location">
      <CardTitle className="text-white text-2xl font-semibold mb-4">
        Location Stats
      </CardTitle>
      <LocationStats stats={analytics.clicks} />
    </TabsContent>

    <TabsContent value="device">
      <CardTitle className="text-white text-2xl font-semibold mb-4">
        Device Stats
      </CardTitle>
      <DeviceStats stats={analytics.clicks} />
    </TabsContent>
    </Suspense>
  </Tabs>
) : (
  <>
    <p className="text-white">No location analytics available yet.</p>
    <p className="text-white">No device analytics available.</p>
  </>
)}

                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/15 transition">
                  <h2 className="text-lg font-semibold">Last Clicked</h2>
                  <p>
                    {analytics.lastClickedAt
                      ? new Date(analytics.lastClickedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/15 transition">
                  <h2 className="text-lg font-semibold">Location</h2>
                  <p>
                    {analytics?.locaion}
                  </p>
                </div>
             

              <div>
                <h2 className="text-xl font-semibold mb-3">Clicks Per Day</h2>
                {analytics.clicksPerDay &&
                Object.keys(analytics.clicksPerDay).length > 0 ? (
                  <div className="overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-white/10 text-left text-white">
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(analytics.clicksPerDay).map(
                          ([date, count], index) => (
                            <tr
                              key={date}
                              className={
                                index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                              }
                            >
                              <td className="px-4 py-3">{date}</td>
                              <td className="px-4 py-3">{count}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="bg-white/10 p-4 rounded-lg text-white">
                    No daily click analytics available.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </div>
  );
};




export default Link;
