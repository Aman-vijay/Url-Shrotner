import { useSearchParams } from "react-router-dom";
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
import { useState, useRef, useEffect } from "react";
import * as yup from "yup";
import { QRCodeCanvas } from "qrcode.react";
import { BackendUrl, FrontendUrl } from "@/utils/Urls";
import { BeatLoader } from "react-spinners";
import { toast, Toaster } from "react-hot-toast";

const CreateLink = ({ onSuccess }) => {
  const token = localStorage.getItem("token");
  const [searchParams, setSearchParams] = useSearchParams();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const [formData, setFormData] = useState({
    title: "",
    redirectUrl: "",
    customUrl: "",
  });

  useEffect(() => {
    const storedRedirect = localStorage.getItem("redirectUrl");
    if (storedRedirect) {
      setFormData((prev) => ({ ...prev, redirectUrl: storedRedirect }));
      setOpen(true);
    }
  }, []);

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    redirectUrl: yup.string().url("Must be a valid URL").required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (error[id]) {
      setError((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const submitUrl = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setError({});
      setLoading(true);
  
      const canvas = ref.current;
      const qrDataUrl = canvas?.toDataURL?.("image/png") || null;
  
      const payload = { ...formData, qr: qrDataUrl };
  
      const res = await fetch(`${BackendUrl}/api/createNewUrl`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        // Handle known error types
        if (data.error?.includes("Custom URL already in use")) {
          setError((prev) => ({ ...prev, customUrl: "This custom URL is already taken" }));
        } else if (data.error?.includes("URL already exists")) {
          setError((prev) => ({ ...prev, redirectUrl: "You’ve already shortened this URL" }));
        } else {
          toast.error(data.error || "Something went wrong", { position: "bottom-left" });
        }
        return;
      }
  
      toast.success("URL successfully created!", { position: "bottom-left" });
  
      setSuccess("URL successfully created!");
      setFormData({ title: "", redirectUrl: "", customUrl: "" });
  
      if (onSuccess) onSuccess();
  
      setTimeout(() => {
        setOpen(false);
        setSuccess("");
        setFormData({ title: "", redirectUrl: "", customUrl: "" });
        localStorage.removeItem("redirectUrl");
      }, 1500);
  
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setError(validationErrors);
      } else {
        toast.error(err.message || "Something went wrong", { position: "bottom-left" });
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setFormData({ title: "", redirectUrl: "", customUrl: "" });
          setError({});
          setSuccess("");
    
          localStorage.removeItem("redirectUrl");
        }
      }}
    >
      <Toaster position="top-left" reverseOrder={false} />
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New URL</DialogTitle>
        </DialogHeader>

        {formData.redirectUrl && <QRCodeCanvas value={formData.redirectUrl} size={250} ref={ref} />}

        <Input
          id="title"
          placeholder="Short URL's Title*"
          value={formData.title}
          onChange={handleChange}
        />
        <ErrorMessage message={error.title} />

        <Input
          id="redirectUrl"
          placeholder="Enter your long URL*"
          value={formData.redirectUrl}
          onChange={handleChange}
        />
        <ErrorMessage message={error.redirectUrl} />

        <div className="flex items-center gap-2">
          <Card className="p-1 text-muted-foreground">{FrontendUrl}</Card>
          <Input
            id="customUrl"
            placeholder="custom-path"
            value={formData.customUrl}
            onChange={handleChange}
          />
        </div>
        <ErrorMessage message={error.customUrl} />

        {success && <p className="text-green-500">{success}</p>}

        <DialogFooter className="sm:justify-start">
          <Button
            onClick={submitUrl}
            variant="destructive"
            className="hover:cursor-pointer hover:bg-red-500"
            disabled={loading}
          >
            {loading ? <BeatLoader size={8} color="#ffffff" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
