import {  useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import ErrorMessage from "./ErrorMessage";
import { useState } from "react";
import * as yup from "yup";
import {QRCodeCanvas} from 'qrcode.react';
import { useRef } from "react";
import { BackendUrl, FrontendUrl } from "@/utils/Urls";
import { BeatLoader } from "react-spinners";


const CreateLink = () => {
  const token = localStorage.getItem("token");
  let redirectUrl = localStorage.getItem("redirectUrl")
  let [searchParams, setSearchParams] = useSearchParams();
  const ref = useRef();
  
  const submitUrl = async () => {
    try {
      const canvas = ref.current;
  
    
      const qrDataUrl = canvas?.toDataURL?.("image/png"); // <-- base64 string
  
      
      const payload = {
        ...formData,
        qr: qrDataUrl,
      };
  
      // 4. Send to backend
      const res = await fetch(`${BackendUrl}/url/api/createNewUrl`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create URL");
  
      console.log("✅ URL and QR code saved successfully!", data);
  
    } catch (err) {
      console.error("❌ Error submitting:", err.message);
    }
  };
  

  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    redirectUrl: redirectUrl ? redirectUrl : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    redirectUrl: yup.string().url("Must be a valid URL").required("Long URL is Required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Dialog
      defaultOpen={!!redirectUrl}
      onOpenChange={(res) => {
        if (!res) {
          let newParams = new URLSearchParams(searchParams);
          newParams.delete("createNew");
          localStorage.removeItem("redirectUrl") 
          setSearchParams(newParams);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New URL</DialogTitle>
        </DialogHeader>
        {formData?.redirectUrl && <QRCodeCanvas value= {formData?.redirectUrl} size={250} ref={ref}/>} 
        <Input id="title" placeholder="Short URL's Title" value={formData.title} onChange={handleChange} />
        <ErrorMessage message={error.title} />
        <Input id="redirectUrl" placeholder="Enter your long URL" value={formData.redirectUrl} onChange={handleChange} />
        <ErrorMessage message={error.redirectUrl} />
        <div className="flex items-center gap-2 ">
          <Card className="p-1 rounded-sm">{FrontendUrl}</Card>
          <Input id="customUrl" placeholder="Enter your custom URL (optional)" value={formData.customUrl} onChange={handleChange} />
        </div>
        <ErrorMessage message={error.customUrl} />
        <DialogFooter className="sm:justify-start">
          <Button onClick={submitUrl} variant="destructive" className="hover:cursor-pointer hover:bg-red-500">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
