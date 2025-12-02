
// src/components/chat/chat-window.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Timestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './message-bubble';
import { MessageInput } from './message-input';
import { VerifiedBadge } from '@/components/verified-badge';
import { ArrowLeft, Phone, Video, Loader2, ShieldAlert, RefreshCw, Wrench, Bot, Crown } from 'lucide-react'; 
import Link from 'next/link';
import { getChatMessages, sendMessage, type Message, formatTimestamp, getUserProfile as fetchChatPartnerProfile, type UserProfile } from '@/services/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { UserProfileDialog } from '@/components/profile/user-profile-dialog';

interface ChatWindowProps {
  chatId: string;
  chatPartnerId: string; 
  chatName: string;
  chatAvatarUrl?: string;
  chatIconIdentifier?: string;
  isVerified?: boolean;
  isVIP?: boolean; 
}

// SVG for Dev Team Icon in Avatar slot (larger)
const DevTeamAvatarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

// SVG for Blue Bird Bot Icon in Avatar slot (larger)
const BlueBirdBotAvatarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-8 16-18 7 1 2.2 3.8 4.4 6.5 4.3 1.5-.1 2.7-1.1 3.5-2.2-1.3-.1-2.8-.8-3.5-2.2.8.1 1.5.1 2.2.1 1.2 0 2.3-.4 3.2-1.1-1.2-.2-2.5-1-3.2-2.6.4.1.8.1 1.2.1.9 0 1.7-.2 2.4-.7-1.1-.2-2.1-1.1-2.4-2.4.3.1.7.1 1 .1.7 0 1.4-.1 2.1-.4-1.3-.3-2.4-1.4-2.4-2.8s.2-2.8 1.1-3.8c0 0 4.5 5.6 10.5 5.9z"/>
    </svg>
  );

export function ChatWindow({ chatId, chatPartnerId, chatName, chatAvatarUrl, chatIconIdentifier, isVerified, isVIP }: ChatWindowProps) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  const [isPartnerProfileDialogOpen, setPartnerProfileDialogOpen] = useState(false);
  const [partnerProfileDetails, setPartnerProfileDetails] = useState<UserProfile | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    requestAnimationFrame(() => { 
        const viewport = scrollViewportRef.current;
        if (viewport) {
              viewport.scrollTo({ top: viewport.scrollHeight, behavior });
        }
    });
  }, []);

   const fetchAndSetMessages = useCallback(() => {
     if (!chatId || !currentUser?.uid) {
       setLoadingMessages(false);
       setErrorMessages(currentUser?.uid ? "Chat ID is missing." : "User not identified.");
       return () => {}; 
     }

     setLoadingMessages(true);
     setErrorMessages(null);
     console.log(`ChatWindow: Fetching messages for chat ${chatId}`);

     const unsubscribe = getChatMessages(
       chatId,
       (fetchedMessages) => {
         console.log(`ChatWindow: Received messages for chat ${chatId}`, fetchedMessages);
         const processedMessages = fetchedMessages.map((msg) => ({
           ...msg,
           isSentByCurrentUser: msg.senderId === currentUser.uid,
         }));
         setMessages(processedMessages);
         setLoadingMessages(false);
       },
       (error) => {
         console.error("ChatWindow: Error fetching messages:", error);
         setErrorMessages(error.message || "Failed to load messages.");
         setLoadingMessages(false);
       }
     );
     return unsubscribe; 
   }, [chatId, currentUser?.uid]);

   useEffect(() => {
     const unsubscribe = fetchAndSetMessages();
     return () => unsubscribe(); 
   }, [fetchAndSetMessages]);

   useEffect(() => {
     if (messages.length > 0) {
        scrollToBottom('smooth');
     }
   }, [messages, scrollToBottom]);


  const handleSendMessage = async (newMessageText: string, newImageUrl?: string) => {
    if (!currentUser || !chatId) {
      toast({ title: "Error", description: "Could not send message. User or chat not identified.", variant: "destructive" });
      return;
    }
     if (isSending || (!newMessageText.trim() && !newImageUrl)) return;

    setIsSending(true);
    console.log(`ChatWindow: Sending message to chat ${chatId}. Image URL: ${newImageUrl ? 'Present' : 'Absent'}`);
    try {
      await sendMessage(chatId, currentUser.uid, newMessageText.trim(), newImageUrl);
    } catch (error: any) {
      console.error("ChatWindow: Error sending message:", error);
      toast({ title: "Send Failed", description: error.message || "Could not send message.", variant: "destructive" });
    } finally {
        setIsSending(false);
    }
  };

  const fallbackInitials = chatName.substring(0, 2).toUpperCase();

  const handleHeaderAvatarClick = async () => {
    const profile = await fetchChatPartnerProfile(chatPartnerId); 
    if (profile) {
      setPartnerProfileDetails(profile);
      setPartnerProfileDialogOpen(true);
    } else {
      console.error("Partner profile not found for:", chatPartnerId);
      toast({title: "Profile Not Found", description: "Could not load partner's profile details.", variant: "destructive"});
    }
  };

  const renderChatHeaderAvatar = () => {
     if (chatIconIdentifier === 'blue-bird-icon' && chatAvatarUrl && chatAvatarUrl.includes('placehold.co')) {
        return (
          <Avatar className="h-8 w-8 md:h-9 md:w-9 mr-2 md:mr-3 shrink-0 cursor-pointer" onClick={handleHeaderAvatarClick}>
            <AvatarImage src={chatAvatarUrl} alt={chatName} data-ai-hint="blue bird" />
            <AvatarFallback>{fallbackInitials}</AvatarFallback>
          </Avatar>
        );
     } else if (chatIconIdentifier === 'blue-bird-icon') {
        return (
          <div className="h-8 w-8 md:h-9 md:w-9 mr-2 md:mr-3 flex items-center justify-center rounded-full bg-muted shrink-0 cursor-pointer" onClick={handleHeaderAvatarClick}>
            <BlueBirdBotAvatarIcon />
          </div>
        );
     } else if (chatIconIdentifier === 'dev-team-svg') {
       return (
         <div className="h-8 w-8 md:h-9 md:w-9 mr-2 md:mr-3 flex items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0 cursor-pointer" onClick={handleHeaderAvatarClick}>
           <DevTeamAvatarIcon />
         </div>
       );
      } else if (chatAvatarUrl) {
       return (
         <Avatar className="h-8 w-8 md:h-9 md:w-9 mr-2 md:mr-3 shrink-0 cursor-pointer" onClick={handleHeaderAvatarClick}>
           <AvatarImage src={chatAvatarUrl} alt={chatName} data-ai-hint="person face"/>
           <AvatarFallback>{fallbackInitials}</AvatarFallback>
         </Avatar>
       );
     } else {
       return (
          <Avatar className="h-8 w-8 md:h-9 md:w-9 mr-2 md:mr-3 shrink-0 cursor-pointer" onClick={handleHeaderAvatarClick}>
             <AvatarFallback>{fallbackInitials}</AvatarFallback>
          </Avatar>
       );
     }
  };


  return (
    <>
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center p-2 md:p-3 border-b bg-secondary">
         <Link href="/chat" className="md:hidden mr-1">
           <Button variant="ghost" size="icon" className="h-8 w-8">
             <ArrowLeft className="h-5 w-5" />
           </Button>
         </Link>
         {/* Avatar click opens profile */}
         {renderChatHeaderAvatar()}
        {/* Name click does nothing */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
             <p className="text-sm font-medium text-foreground truncate whitespace-nowrap">{chatName}</p>
            {chatIconIdentifier === 'dev-team-svg' ? (
                <Wrench className="h-4 w-4 text-blue-600 shrink-0" />
            ) : chatIconIdentifier === 'blue-bird-icon' ? (
                <Bot className="h-4 w-4 text-primary shrink-0" />
            ) : (
                <>
                  {isVIP && <Crown className="h-4 w-4 text-yellow-500 shrink-0" />}
                  {isVerified && !isVIP && <VerifiedBadge className="shrink-0"/>} 
                  {isVerified && isVIP && <VerifiedBadge className="shrink-0 ml-1"/>}
                </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({title: "Call", description: "This feature is for demonstration purposes."})}>
            <Phone className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({title: "Video Call", description: "This feature is for demonstration purposes."})}>
            <Video className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <span className="sr-only">Video Call</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3 md:p-4" viewportRef={scrollViewportRef}>
         {loadingMessages && (
             <div className="flex flex-col justify-center items-center h-full text-center p-4">
                 <Loader2 className="h-6 w-6 animate-spin text-primary" />
                 <p className="mt-2 text-sm text-muted-foreground">Loading messages...</p>
             </div>
         )}
          {errorMessages && !loadingMessages && (
              <div className="flex flex-col justify-center items-center h-full text-center text-destructive p-4">
                  <ShieldAlert className="h-8 w-8 mb-2" />
                  <p className="text-sm font-medium">Error Loading Messages</p>
                  <p className="text-xs mt-1">{errorMessages}</p>
                  <Button onClick={fetchAndSetMessages} variant="outline" size="sm" className="mt-4">
                       <RefreshCw className="mr-2 h-4 w-4"/>
                       Try Again
                  </Button>
              </div>
          )}
        {!loadingMessages && !errorMessages && messages.length === 0 && (
            <div className="text-center text-muted-foreground p-4 mt-10">
                <p className="text-sm">No messages yet.</p>
                <p className="text-xs">Start the conversation!</p>
            </div>
        )}
        {!loadingMessages && !errorMessages && messages.map((msg) => (
          <MessageBubble
            key={msg.id || `msg-${msg.senderId}-${msg.timestamp?.seconds}-${msg.timestamp?.nanoseconds}`}
            text={msg.text}
            imageUrl={msg.imageUrl}
            timestamp={formatTimestamp(msg.timestamp)}
            isSentByCurrentUser={msg.isSentByCurrentUser ?? false}
          />
        ))}
      </ScrollArea>

      <MessageInput
         onSendMessage={handleSendMessage}
         disabled={loadingMessages || !!errorMessages || isSending}
         isSending={isSending}
       />
    </div>
     {partnerProfileDetails && (
        <UserProfileDialog
          isOpen={isPartnerProfileDialogOpen}
          onOpenChange={setPartnerProfileDialogOpen}
          profile={partnerProfileDetails}
        />
      )}
    </>
  );
}
