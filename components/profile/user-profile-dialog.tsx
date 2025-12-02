
// src/components/profile/user-profile-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/context/auth-context";
import { Crown, CheckCircle, Mail, MessageSquare, Loader2, ShieldAlert, Wrench, Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { findChatBetweenUsers, createChat } from '@/services/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface UserProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile | null;
}

export function UserProfileDialog({ isOpen, onOpenChange, profile }: UserProfileDialogProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [isProcessingChat, setIsProcessingChat] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!profile) return null;

  const fallbackInitials = profile.name ? profile.name.substring(0, 2).toUpperCase() : '??';

  const handleStartOrViewChat = async () => {
    if (!currentUser || !profile) {
      toast({ title: "Error", description: "Cannot start chat. User information missing.", variant: "destructive" });
      return;
    }
    if (currentUser.uid === profile.uid) {
        toast({ title: "Cannot Chat Self", description: "You cannot start a chat with yourself.", variant: "default" });
        onOpenChange(false);
        return;
    }

    setIsProcessingChat(true);
    try {
      let chatId = await findChatBetweenUsers(currentUser.uid, profile.uid);
      if (!chatId) {
        chatId = await createChat(currentUser.uid, profile.uid);
        toast({ title: "Chat Created!", description: `Started a new chat with ${profile.name}.` });
      } else {
        toast({ title: "Chat Found", description: `Opening existing chat with ${profile.name}.` });
      }
      onOpenChange(false); // Close dialog
      router.push(`/chat/${chatId}`);
    } catch (error: any) {
      toast({ title: "Error", description: `Could not start/find chat: ${error.message}`, variant: "destructive" });
    } finally {
      setIsProcessingChat(false);
    }
  };

  const getProfileStatus = () => {
    if (profile.isBot) return "Automated Assistant";
    if (profile.isDevTeam) return "Echo Message Development Team";
    if (profile.isVIP && profile.isVerified) return "VIP & Verified User";
    if (profile.isVIP) return "VIP User";
    if (profile.isVerified) return "Verified User";
    return "Community Member";
  }

  const avatarHint = profile.isBot ? "blue bird" : "person face";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <div className={cn(
            "h-24 bg-gradient-to-br rounded-t-lg",
            profile.isVIP ? "from-primary/80 to-primary/60" : "from-muted to-secondary"
          )}>
          {/* Header background */}
        </div>
        <div className="p-6 pt-0 -mt-12">
            <DialogHeader className="items-center text-center mb-4">
                <Avatar className="h-24 w-24 mb-3 border-4 border-background shadow-md">
                    <AvatarImage src={profile.avatarUrl} alt={profile.name} data-ai-hint={avatarHint} />
                    <AvatarFallback className="text-3xl">{fallbackInitials}</AvatarFallback>
                </Avatar>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2 justify-center">
                    {profile.name}
                    {profile.isDevTeam && <Wrench className="h-5 w-5 text-blue-600" />}
                    {profile.isBot && <Bot className="h-5 w-5 text-primary" />}
                    {!profile.isDevTeam && !profile.isBot && profile.isVIP && <Crown className="h-5 w-5 text-yellow-500" />}
                    {!profile.isDevTeam && !profile.isBot && profile.isVerified && <CheckCircle className="h-5 w-5 text-primary" />}
                </DialogTitle>
                {profile.email && (
                    <DialogDescription className="flex items-center gap-1.5 justify-center text-muted-foreground">
                    <Mail className="h-4 w-4" /> {profile.email}
                    </DialogDescription>
                )}
            </DialogHeader>
            <div className="space-y-3 text-center mb-6">
                 <p className="text-sm font-medium text-foreground">{getProfileStatus()}</p>
                 <p className="text-xs text-muted-foreground">
                    Joined: {isClient && profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : "Date not available"}
                 </p>
                 {profile.isVIP && profile.vipPack && (
                    <p className="text-xs text-primary font-semibold">VIP Pack: {profile.vipPack}</p>
                 )}
            </div>
            <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            {currentUser?.uid !== profile.uid && (
                <Button onClick={handleStartOrViewChat} disabled={isProcessingChat} className="w-full">
                    {isProcessingChat ? <Loader2 className="animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                    {isProcessingChat ? 'Processing...' : `Chat with ${profile.name}`}
                </Button>
            )}
            <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full">
                Close
                </Button>
            </DialogClose>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
