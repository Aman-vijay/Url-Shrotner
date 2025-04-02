import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "./ui/button";

const CustomAlert = ({ message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, triggerText, variant = "destructive" }) => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} onClick={() => setOpen(true)}>
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => { setOpen(false); onCancel && onCancel(); }}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => { setOpen(false); onConfirm && onConfirm(); }} className="bg-red-600 hover:bg-red-700">
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;
