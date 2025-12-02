// src/components/chat/message-input.tsx
'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Paperclip, ImagePlus, VideoIcon } from 'lucide-react'; // Added Loader2
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (message: string, imageUrl?: string) => Promise<void>; // Expect async function
  disabled?: boolean; // Add disabled prop
  isSending?: boolean; // Add sending state prop
}

export function MessageInput({ onSendMessage, disabled = false, isSending = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (disabled || isSending || !message.trim()) return;
    const messageToSend = message.trim();
    setMessage('');
    await onSendMessage(messageToSend);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || isSending) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleAttachPhotoClick = () => {
    if (disabled || isSending) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please select an image file.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit for demo
        toast({ variant: 'destructive', title: 'File Too Large', description: 'Image must be smaller than 5MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        // Send image with current message text or empty if no text
        const currentMessageText = message.trim(); 
        setMessage(''); // Clear text input after preparing image
        await onSendMessage(currentMessageText, result); 
        toast({ title: "Image Selected", description: "Sending image with message..." });
      };
      reader.onerror = () => {
        toast({ variant: 'destructive', title: 'Error Reading File', description: 'Could not read the selected file.' });
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow selecting the same file again if needed
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleAttachVideoClick = () => {
    toast({
      title: "Feature in Development",
      description: "Sending videos will be available soon.",
    });
  };

  return (
    <div className="flex items-center p-2 md:p-4 border-t bg-secondary">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isSending}
      />
      <Button variant="ghost" size="icon" className="mr-1" onClick={handleAttachPhotoClick} disabled={disabled || isSending} aria-label="Attach photo">
         <ImagePlus className="h-5 w-5 text-muted-foreground" />
      </Button>
       <Button variant="ghost" size="icon" className="mr-2" onClick={handleAttachVideoClick} disabled={disabled || isSending} aria-label="Attach video">
         <VideoIcon className="h-5 w-5 text-muted-foreground" />
       </Button>
      <Input
        type="text"
        placeholder={disabled ? "Loading chat..." : "Type a message..."}
        className="flex-1 mr-2 bg-background"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={disabled || isSending}
        aria-disabled={disabled || isSending}
        autoComplete="off"
      />
      <Button onClick={handleSend} size="icon" disabled={(!message.trim() && !fileInputRef.current?.files?.length) || disabled || isSending}>
        {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
            <Send className="h-5 w-5" />
        )}
        <span className="sr-only">Send Message</span>
      </Button>
    </div>
  );
}
