
// src/components/chat/chat-list.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatItem, type ChatItemProps } from './chat-item';
import { Search, Users, MessageCircle, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AddContactDialog } from './add-contact-dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserChats, mapChatToChatItem, type Chat } from '@/services/firestore';

interface ChatListProps {
  currentChatId?: string;
  currentUserId: string | null | undefined;
  isVIP: boolean;
}

export function ChatList({ currentChatId, currentUserId, isVIP }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [chats, setChats] = useState<ChatItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setChats([]);

    if (!currentUserId) {
        console.warn("ChatList: No current user ID provided.");
        setLoading(false);
        return () => {};
    }

    console.log(`ChatList: Fetching chats for user ${currentUserId}`);
    const unsubscribe = getUserChats(
        currentUserId,
        (fetchedChats: Chat[]) => {
            console.log("ChatList: Received chats", fetchedChats);
            let chatItems = fetchedChats.map(chat => mapChatToChatItem(chat, currentUserId));
            
            // Sort chatItems by lastMessageTimestampValue in descending order
            chatItems.sort((a, b) => b.lastMessageTimestampValue - a.lastMessageTimestampValue);
            
            setChats(chatItems);
            setLoading(false);
        },
        (err) => {
            console.error("ChatList: Error fetching chats:", err);
            setError(err.message || "Failed to load chats.");
            setLoading(false);
        }
    );
    return () => unsubscribe();

  }, [currentUserId]);

  const allMatchingChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const verifiedPersons = isVIP
    ? allMatchingChats.filter(chat => chat.isVerified) // True if Dev, Bot, or userProfile.isVerified = true
    : [];

  const filteredRegularChats = allMatchingChats.filter(chat => !chat.isVerified);


    if (loading) {
        return (
            <div className="flex flex-col h-full bg-secondary items-center justify-center p-4">
                 <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                 <p className="text-sm text-muted-foreground">Loading Chats...</p>
            </div>
        );
    }

     if (error) {
         return (
             <div className="flex flex-col h-full bg-secondary items-center justify-center p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                  <p className="text-sm font-medium text-destructive">Error Loading Chats</p>
                  <p className="text-xs text-muted-foreground mt-1">{error}</p>
             </div>
         );
     }

     if (!currentUserId && !loading) {
         return (
             <div className="flex flex-col h-full bg-secondary items-center justify-center p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Please log in to view chats.</p>
             </div>
         );
     }


  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-secondary">
        <div className="p-4 border-b flex items-center gap-2 sticky top-0 bg-secondary z-10">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search chats or verified..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setIsAddContactOpen(true)}
                disabled={!currentUserId}
                aria-label="Add Contact by Email"
              >
                <UserPlus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Contact by Email</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <ScrollArea className="flex-1">
           {allMatchingChats.length === 0 && !loading && (
                <p className="p-4 text-center text-sm text-muted-foreground">
                    No chats found. Add a contact to start messaging!
                </p>
            )}

          {(filteredRegularChats.length > 0 || (isVIP && verifiedPersons.length > 0)) && allMatchingChats.length > 0 && (
            <div className="p-2 pt-3">
                <h2 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                   <MessageCircle className="h-3.5 w-3.5" />
                   Chats
                </h2>
            </div>
          )}

           {allMatchingChats.length > 0 && (
            <div className="p-2 space-y-1">
                {filteredRegularChats.length > 0 ? (
                filteredRegularChats.map((chat) => (
                    <ChatItem key={chat.id} {...chat} isActive={chat.id === currentChatId} />
                ))
                ) : (
                 isVIP && verifiedPersons.length > 0 && searchTerm && allMatchingChats.length > 0 && ( 
                    <p className="px-4 py-2 text-center text-xs text-muted-foreground">No regular chats found matching '{searchTerm}'.</p>
                 )
                )}
                  {isVIP && verifiedPersons.length > 0 && filteredRegularChats.length === 0 && !searchTerm && allMatchingChats.length > 0 && (
                       <p className="px-4 py-2 text-center text-xs text-muted-foreground">No regular chats yet.</p>
                  )}
            </div>
           )}


          {isVIP && allMatchingChats.length > 0 && (
            <>
              {(filteredRegularChats.length > 0 && verifiedPersons.length > 0) && <Separator className="mx-2 my-2" />}

              {verifiedPersons.length > 0 && (
                <div className="p-2 pt-1">
                   <h2 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                     <Users className="h-3.5 w-3.5" />
                     Verified Persons
                   </h2>
                </div>
              )}
              <div className={cn("p-2 space-y-1", verifiedPersons.length > 0 ? 'pb-2' : '')}>
                {verifiedPersons.length > 0 ? (
                  verifiedPersons.map((chat) => (
                    <ChatItem key={`${chat.id}-verified`} {...chat} isActive={chat.id === currentChatId} />
                  ))
                ) : (
                  searchTerm && filteredRegularChats.length === 0 && ( // Only show if search yields no regular and no verified
                     <p className="px-4 py-2 text-center text-xs text-muted-foreground">
                         No verified persons found{searchTerm ? ` matching '${searchTerm}'` : ''}.
                     </p>
                  )
                )}
              </div>
            </>
          )}

            {searchTerm && filteredRegularChats.length === 0 && (!isVIP || verifiedPersons.length === 0) && allMatchingChats.length > 0 && (
                 <p className="p-4 text-center text-sm text-muted-foreground">No results found matching '{searchTerm}'.</p>
            )}


        </ScrollArea>

        {currentUserId && (
            <AddContactDialog
                isOpen={isAddContactOpen}
                onOpenChange={setIsAddContactOpen}
                currentUserId={currentUserId}
            />
        )}
      </div>
    </TooltipProvider>
  );
}

