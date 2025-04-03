import { useNavigate, useSearchParams } from "react-router-dom";
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

const CreateLink = ({ redirectUrl }) => {
  let [searchParams, setSearchParams] = useSearchParams();
  
  // Fallback to searchParams if prop is not provided
  const resolvedRedirectUrl = redirectUrl || searchParams.get("createNew") || "";
  console.log("resolvedUrl:",resolvedRedirectUrl)

  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    redirectUrl: resolvedRedirectUrl,
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
      defaultOpen={!!resolvedRedirectUrl}
      onOpenChange={(res) => {
        if (!res) {
          let newParams = new URLSearchParams(searchParams);
          newParams.delete("createNew"); // Remove only createNew, keep others
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
        <Input id="title" placeholder="Short URL's Title" value={formData.title} onChange={handleChange} />
        <ErrorMessage message={error.title} />
        <Input id="redirectUrl" placeholder="Enter your long URL" value={formData.redirectUrl} onChange={handleChange} />
        <ErrorMessage message={error.redirectUrl} />
        <div className="flex items-center gap-2 ">
          <Card className="p-1 rounded-sm">urlshortener.vercel.app</Card>
          <Input id="customUrl" placeholder="Enter your custom URL (optional)" value={formData.customUrl} onChange={handleChange} />
        </div>
        <ErrorMessage message={error.customUrl} />
        <DialogFooter className="sm:justify-start">
          <Button variant="destructive" className="hover:cursor-pointer hover:bg-red-500">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
