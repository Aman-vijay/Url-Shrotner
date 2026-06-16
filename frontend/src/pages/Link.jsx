import React, { useEffect,lazy,Suspense, useRef } from 'react';
import { useParams,useNavigate } from "react-router-dom";
import { BackendUrl } from '@/utils/Urls';
import useFetch from '@/hooks/useFetch';
import { urlsSchema, analyticsSchema, parseOrThrow } from '@/lib/schemas';
import { BarLoader } from 'react-spinners';
import { LinkIcon } from 'lucide-react';
import CustomAlert from "../components/CustomAlert"; 
import { toast, Toaster } from "react-hot-toast"; 
import { downloadQr } from '@/utils/DownloadQr';
import { QRCodeCanvas } from "qrcode.react";
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
const ClicksPerDay = lazy(()=> import("../components/ClicksPerDay"))

const Link = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const qrCanvasRef = useRef(null);
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
      navigate("/dashboard")
      
      
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
         return parseOrThrow(urlsSchema, res, "Link response");
    }
    catch(err){
      throw new Error(`HTTP error! status: ${err}`, { cause: err });

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
       return parseOrThrow(analyticsSchema, res, "Analytics response");
  
    
    } catch (err) {
      console.error('Error fetching analytics:', err);
      throw err;
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
    return <BarLoader className='mb-4' width={"100%"} color="oklch(0.72 0.17 165)"/>;
  }

  if (error || urlError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-destructive font-medium">{error?.message || urlError?.message || "Something went wrong loading analytics."}</p>
        <Button variant="outline" className="mt-6" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  const linkItem = url?.[0];
  const shortUrl = linkItem ? `${BackendUrl}/${linkItem?.customUrl ? linkItem.customUrl : linkItem.shortUrl}` : "";
  const clicksPerDay = analytics?.clicksPerDay
    ? Object.entries(analytics.clicksPerDay).map(([date, count]) => ({ date, count }))
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
    <Toaster position="bottom-left" reverseOrder={false} />
    <h1 className="text-2xl font-extrabold mb-6 text-balance">
      {linkItem?.title ? `Analytics for: ${linkItem.title}` : `Analytics for: ${id}`}
    </h1>

    <div className="flex flex-col gap-10 sm:flex-row justify-between">
      {/* URL Card Section */}
      <div className="sm:w-2/5 space-y-8">
        {linkItem && (
          <div className="space-y-6">
            <div
              key={linkItem?.id}
              className="bg-card border border-border p-6 rounded-xl"
            >
              <div className="flex flex-col gap-4">
                <div className="text-xl font-bold">
                  {linkItem?.title}
                </div>

                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg text-primary font-semibold hover:underline break-all"
                >
                  {shortUrl}
                </a>

                <div className="flex items-center text-sm gap-2 text-muted-foreground">
                  <LinkIcon className="w-4 h-4" aria-hidden="true" />
                  <span className="break-all">{linkItem?.redirectUrl}</span>
                </div>

                <QRCodeCanvas
                  value={shortUrl}
                  size={160}
                  className="w-32 self-center sm:self-start rounded-md border border-border p-1 bg-white"
                  ref={qrCanvasRef}
                />

                <div className="text-xs text-muted-foreground">
                  Created: {new Date(linkItem?.createdAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(shortUrl)
                    }
                    className="flex items-center gap-1"
                  >
                    <Copy size={16} aria-hidden="true" />
                    Copy
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadQr(qrCanvasRef.current, linkItem?.title, showToast)}
                    className="flex items-center gap-1"
                  >
                    <Download size={16} aria-hidden="true" />
                    Download
                  </Button>

                  <CustomAlert
                    message="Are you sure you want to delete this link? This action cannot be undone."
                    confirmText="Yes, Delete"
                    cancelText="Cancel"
                    onConfirm={() => handleDelete(linkItem?._id)}
                    onCancel={() => showToast("Cancelled deletion", "error")}
                    triggerText={<Trash size={16} aria-hidden="true" />}
                    triggerLabel="Delete link"
                    triggerSize="icon"
                    variant="destructive"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div> 
     
     
      <div className="sm:w-3/5">
        {analytics && (
          <Card className="bg-card border border-border rounded-xl p-6 space-y-6">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Analytics Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-secondary/60 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold">Total Clicks</h2>
                  <p className="text-3xl font-bold">{analytics.totalClicks}</p>
                </div>
                {analytics.clicks && analytics.clicks.length > 0 ? (
  <Tabs defaultValue="location" className="w-full mt-6">
    <TabsList className="flex flex-wrap justify-start bg-secondary mb-4">
   
      <TabsTrigger value="location">Location Stats</TabsTrigger>
      <TabsTrigger value="device">Device Stats</TabsTrigger>
    </TabsList>
    <Suspense fallback = {<div className="text-muted-foreground">Loading chart...</div>}>
    <TabsContent value="location">
      <CardTitle className="text-xl font-semibold mb-4">
        Top Cities
      </CardTitle>
      <LocationStats stats={analytics.clicks} />
    </TabsContent>

    <TabsContent value="device">
      <CardTitle className="text-xl font-semibold mb-4">
        Devices
      </CardTitle>
      <DeviceStats stats={analytics.clicks} />
    </TabsContent>
    </Suspense>
  </Tabs>
) : (
  <>
    <p className="text-muted-foreground">No location analytics available yet.</p>
    <p className="text-muted-foreground">No device analytics available.</p>
  </>
)}

                <div className="bg-secondary/60 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold">Last Clicked</h2>
                  <p className="text-muted-foreground">
                    {analytics.lastClickedAt
                      ? new Date(analytics.lastClickedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Clicks Per Day</h2>
                {clicksPerDay.length > 0 ? (
                  <div className="rounded-lg bg-secondary/60 p-4">
                    <Suspense fallback={<div className="text-muted-foreground py-12 text-center">Loading chart...</div>}>
                      <ClicksPerDay clicksPerDay={clicksPerDay} />
                    </Suspense>
                  </div>
                ) : (
                  <p className="bg-secondary/60 p-4 rounded-lg text-muted-foreground">
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
