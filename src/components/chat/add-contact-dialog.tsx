
// src/components/chat/add-contact-dialog.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { UserPlus, Loader2, ShieldAlert } from "lucide-react"; // Added ShieldAlert for VIP toast
import { useToast } from '@/hooks/use-toast';
import { findUserByEmail, findChatBetweenUsers, createChat, BOT_UID, DEV_UID } from '@/services/firestore'; // Added BOT_UID, DEV_UID
import { useVIP } from '@/context/vip-context'; // Added useVIP

interface AddContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

export function AddContactDialog({ isOpen, onOpenChange, currentUserId }: AddContactDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { isVIP } = useVIP(); // Get VIP status
  const [contactEmail, setContactEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddContact = async () => {
    if (!contactEmail.trim() || !/\S+@\S+\.\S+/.test(contactEmail)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    if (!currentUserId) {
       toast({ title: "Error", description: "Cannot add contact. User not identified.", variant: "destructive" });
       return;
    }

    setIsLoading(true);
    console.log(`AddContactDialog: Adding contact ${contactEmail} for user ${currentUserId}. Current user VIP status: ${isVIP}`);

    try {
      const targetUser = await findUserByEmail(contactEmail);

      if (!targetUser) {
        toast({ title: "User Not Found", description: `No user found with email ${contactEmail}.`, variant: "destructive" });
        setIsLoading(false);
        return;
      }

      if (targetUser.uid === currentUserId) {
          toast({ title: "Cannot Add Self", description: "You cannot add yourself as a contact.", variant: "destructive" });
          setIsLoading(false);
          return;
      }

      // Check if free user is trying to add a regular verified user
      const isTargetRegularVerifiedUser = targetUser.isVerified && targetUser.uid !== BOT_UID && targetUser.uid !== DEV_UID;
      if (isTargetRegularVerifiedUser && !isVIP) {
        toast({
          title: "VIP Required",
          description: "To add this user you need to become VIP.",
          variant: "default", // Using default variant, can be destructive if preferred
          action: <ShieldAlert className="h-5 w-5 text-primary" />,
        });
        setIsLoading(false);
        return;
      }


      const existingChatId = await findChatBetweenUsers(currentUserId, targetUser.uid);

      if (existingChatId) {
         toast({ title: "Chat Exists", description: `You already have a chat with ${targetUser.name || 'this user'}. Redirecting...`, variant: "default" });
         onOpenChange(false);
         router.push(`/chat/${existingChatId}`);
      } else {
         const newChatId = await createChat(currentUserId, targetUser.uid);
         toast({
           title: "Chat Created!",
           description: `Started a chat with ${targetUser.name || 'this user'}. Redirecting...`,
           action: <UserPlus className="h-5 w-5 text-green-500" />,
         });
         onOpenChange(false);
         router.push(`/chat/${newChatId}`);
      }
      setContactEmail('');
    } catch (error: any) {
      console.error("AddContactDialog: Error adding contact:", error);
      toast({
        title: "Error Adding Contact",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
     setContactEmail('');
     onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) onOpenChange(open); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
             <UserPlus className="h-5 w-5" /> Add Contact by Email
          </DialogTitle>
          <DialogDescription>
            Enter the email address of the user you want to chat with.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="contact-email-dialog">Email Address</Label>
            <Input
              id="contact-email-dialog"
              type="email"
              placeholder="name@example.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
           <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={handleCancel} disabled={isLoading}>
                  Cancel
              </Button>
           </DialogClose>
           <Button type="button" onClick={handleAddContact} disabled={isLoading || !contactEmail.trim()}>
             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
             {isLoading ? 'Adding...' : 'Add Contact'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

