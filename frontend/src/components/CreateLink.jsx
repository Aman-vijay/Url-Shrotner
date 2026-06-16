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
import { createLinkSchema, getFormErrors } from "@/lib/schemas";
import { BackendUrl, FrontendUrl } from "@/utils/Urls";
import { BeatLoader } from "react-spinners";
import { toast, Toaster } from "react-hot-toast";

const CreateLink = ({ onSuccess }) => {
  const token = localStorage.getItem("token");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(() => !!localStorage.getItem("redirectUrl"));

  const [formData, setFormData] = useState(() => ({
    title: "",
    redirectUrl: localStorage.getItem("redirectUrl") || "",
    customUrl: "",
  }));

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
      const result = createLinkSchema.safeParse(formData);
      if (!result.success) {
        setError(getFormErrors(result.error) || {});
        return;
      }
      setError({});
      setLoading(true);

      const payload = { ...formData };
  
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
      toast.error(err.message || "Something went wrong", { position: "bottom-left" });
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
      <Toaster position="bottom-left" reverseOrder={false} />
      <DialogTrigger asChild>
        <Button>Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New URL</DialogTitle>
        </DialogHeader>

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
            className="hover:cursor-pointer"
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
