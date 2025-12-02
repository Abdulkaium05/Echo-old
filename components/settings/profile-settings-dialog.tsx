
// src/components/settings/profile-settings-dialog.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Upload, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth, type UserProfile } from '@/context/auth-context';
import { uploadAvatar as mockUploadAvatar } from '@/services/storage';

interface ProfileSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
  onProfileUpdate: (updatedData: { name: string; avatarUrl?: string }) => Promise<void>;
}

export function ProfileSettingsDialog({ isOpen, onOpenChange, user, onProfileUpdate }: ProfileSettingsDialogProps) {
  const { toast } = useToast();
  const { user: authContextUser } = useAuth(); // Renamed to avoid conflict with prop 'user'
  const [currentUserName, setCurrentUserName] = useState(user?.name || '');
  const [currentUserAvatar, setCurrentUserAvatar] = useState(user?.avatarUrl); // This will hold the current avatar URL/DataURI
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatarUrl); // For UI preview
  const [newAvatarFile, setNewAvatarFile] = useState<string | null>(null); // Stores new avatar as base64 DataURI
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      setCurrentUserName(user.name || '');
      const currentAvatar = user.avatarUrl;
      setCurrentUserAvatar(currentAvatar);
      setAvatarPreview(currentAvatar);
      setNewAvatarFile(null); // Reset any pending new avatar
      setIsLoading(false);
    }
  }, [isOpen, user]);


  const handleSave = async () => {
    if (!authContextUser || !user) {
      toast({ title: "Error", description: "User not found.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
     if (!currentUserName.trim()) {
        toast({ title: "Invalid Input", description: "Username cannot be empty.", variant: "destructive" });
        setIsLoading(false);
        return;
     }

    setIsLoading(true);
    let finalAvatarUrl = currentUserAvatar; // Start with the existing avatar

    try {
      if (newAvatarFile) { // If a new avatar file (DataURI) was selected
          console.log("[ProfileSettingsDialog] Uploading new avatar (DataURI).");
          // mockUploadAvatar in demo context just returns the DataURI or a placeholder
          finalAvatarUrl = await mockUploadAvatar(authContextUser.uid, newAvatarFile, 'image/png');
          console.log("[ProfileSettingsDialog] New avatar 'uploaded', final URL/Data:", finalAvatarUrl);
          toast({title: "Avatar Processed", description: "Your new avatar has been processed."});
      }

      console.log("[ProfileSettingsDialog] Calling onProfileUpdate with name:", currentUserName.trim(), "and avatarUrl:", finalAvatarUrl);
      await onProfileUpdate({ name: currentUserName.trim(), avatarUrl: finalAvatarUrl });
      setCurrentUserAvatar(finalAvatarUrl); // Update dialog's internal state for consistency
      console.log("[ProfileSettingsDialog] onProfileUpdate completed.");

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
        action: <Check className="h-5 w-5 text-green-500" />,
      });
      onOpenChange(false);

    } catch (error: any) {
      console.error("[ProfileSettingsDialog] Error saving profile:", error);
      toast({
        title: "Save Failed",
        description: error.message || "Could not update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please select an image file.' });
        return;
      }
       if (file.size > 2 * 1024 * 1024) { // 2MB limit
           toast({ variant: 'destructive', title: 'File Too Large', description: 'Avatar image must be smaller than 2MB.' });
           return;
       }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string; // This will be a base64 DataURI
        setAvatarPreview(result); // Update UI preview
        setNewAvatarFile(result); // Store DataURI for "upload"
         toast({
           title: "Avatar Preview Updated",
           description: "Click 'Save changes' to apply.",
         });
      };
      reader.onerror = () => {
         toast({ variant: 'destructive', title: 'Error Reading File', description: 'Could not read file.' });
      }
      reader.readAsDataURL(file);
    }
    event.target.value = ''; // Reset file input to allow selecting the same file again
  };

  const fallbackInitials = currentUserName.substring(0, 2).toUpperCase() || user?.name?.substring(0,2).toUpperCase() || '??';

  const isSaveDisabled = isLoading || 
    (!newAvatarFile && currentUserName.trim() === (user?.name || '') && avatarPreview === (user?.avatarUrl));


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) onOpenChange(open); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Manage your public profile information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={avatarPreview} alt={currentUserName || user?.name} data-ai-hint="person face"/>
              <AvatarFallback>{fallbackInitials}</AvatarFallback>
            </Avatar>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={isLoading} />
            <Button variant="outline" size="sm" onClick={handleChangeAvatarClick} disabled={isLoading}>
               <Upload className="mr-2 h-4 w-4" /> Change Avatar
            </Button>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username-dialog" className="text-right col-span-1">
              Username
            </Label>
            <Input
              id="username-dialog"
              value={currentUserName}
              onChange={(e) => setCurrentUserName(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email-dialog" className="text-right col-span-1">
                Email
              </Label>
              <Input
                id="email-dialog"
                value={user?.email || ''}
                className="col-span-3 bg-muted border-muted"
                disabled
                readOnly
              />
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isLoading}>Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={isSaveDisabled}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
