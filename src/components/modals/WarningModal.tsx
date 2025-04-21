"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WarningModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userName: string;
  onSendWarning: (message: string) => void;
}

export function WarningModal({ 
  isOpen,
  onOpenChange,
  userName,
  onSendWarning,
}: WarningModalProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) { // Only send if message is not empty
      onSendWarning(message);
      setMessage(""); // Clear message after sending
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setMessage(""); // Clear message on cancel
  };

  // Close modal if isOpen becomes false (e.g., clicking outside)
  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setMessage(""); // Clear message when closing
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Uyarı Gönder: {userName}</DialogTitle>
          <DialogDescription>
            {userName} kullanıcısına göndermek istediğiniz uyarı mesajını girin.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="warning-message">Mesaj</Label>
            <Textarea 
              placeholder="Uyarı mesajınızı buraya yazın..."
              id="warning-message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>İptal</Button>
          <Button onClick={handleSend} disabled={!message.trim()}>Gönder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 