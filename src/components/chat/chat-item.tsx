
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VerifiedBadge } from '@/components/verified-badge';
import { cn } from '@/lib/utils';
import { Code, Crown, Wrench, Bot } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';
import { UserProfileDialog } from '@/components/profile/user-profile-dialog';
import { getUserProfile, type UserProfile } from '@/services/firestore';
import { useState } from 'react';

export interface ChatItemProps {
  id: string;
  name: string;
  contactUserId: string;
  avatarUrl?: string;
  lastMessage: string;
  timestamp: string;
  lastMessageTimestampValue: number;
  isVerified?: boolean;
  isContactVIP?: boolean;
  isDevTeam?: boolean;
  isBot?: boolean;
  isActive?: boolean;
  href: string;
  iconIdentifier?: string;
  isLastMessageSentByCurrentUser?: boolean;
  isOnline?: boolean;
}

// Inline SVG for Dev Team Icon (used in Avatar slot)
const DevTeamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

// Dev Team Badge Icon (used next to name)
const DevTeamBadge = () => (
    <Wrench className="h-3.5 w-3.5 text-blue-600 shrink-0" />
);

// Inline SVG for Blue Bird Bot Icon (used in Avatar slot)
const BlueBirdBotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-8 16-18 7 1 2.2 3.8 4.4 6.5 4.3 1.5-.1 2.7-1.1 3.5-2.2-1.3-.1-2.8-.8-3.5-2.2.8.1 1.5.1 2.2.1 1.2 0 2.3-.4 3.2-1.1-1.2-.2-2.5-1-3.2-2.6.4.1.8.1 1.2.1.9 0 1.7-.2 2.4-.7-1.1-.2-2.1-1.1-2.4-2.4.3.1.7.1 1 .1.7 0 1.4-.1 2.1-.4-1.3-.3-2.4-1.4-2.4-2.8s.2-2.8 1.1-3.8c0 0 4.5 5.6 10.5 5.9z"/>
  </svg>
);

// Blue Bird Bot Badge Icon (used next to name)
const BlueBirdBotBadge = () => (
    <Bot className="h-3.5 w-3.5 text-blue-500 shrink-0" />
);


export function ChatItem({
  id,
  name,
  contactUserId,
  avatarUrl,
  lastMessage,
  timestamp,
  isVerified, // This is isVerifiedForSectioning from mapChatToChatItem
  isContactVIP, // This is the contact's actual VIP status
  isDevTeam,
  isBot,
  isActive,
  href,
  iconIdentifier,
  isLastMessageSentByCurrentUser,
  isOnline,
}: ChatItemProps) {
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleAvatarClick = async (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent link navigation if avatar is clicked
    event.stopPropagation();
    const profile = await getUserProfile(contactUserId);
    if (profile) {
      setSelectedProfile(profile);
      setProfileDialogOpen(true);
    } else {
      console.error("Profile not found for user:", contactUserId);
      // TODO: Add toast notification for profile not found
    }
  };

  const fallbackInitials = name.substring(0, 2).toUpperCase();

  const renderAvatarOrIcon = () => {
    const avatarBaseClasses = "h-10 w-10";
    const iconWrapperClasses = `${avatarBaseClasses} flex items-center justify-center rounded-full bg-muted`;

    let avatarContent;

    if (iconIdentifier === 'blue-bird-icon' && avatarUrl && avatarUrl.includes('placehold.co')) {
      // If it's the bot and has a placeholder URL, use AvatarImage
       avatarContent = (
        <Avatar className={avatarBaseClasses}>
          <AvatarImage src={avatarUrl} alt={name} data-ai-hint="blue bird" />
          <AvatarFallback>{fallbackInitials}</AvatarFallback>
        </Avatar>
      );
    } else if (iconIdentifier === 'blue-bird-icon') {
      avatarContent = (
        <div className={cn(iconWrapperClasses, "text-primary")}>
          <BlueBirdBotIcon />
        </div>
      );
    } else if (iconIdentifier === 'dev-team-svg') {
      avatarContent = (
         <div className={cn(iconWrapperClasses, "text-muted-foreground")}>
           <DevTeamIcon />
         </div>
      );
    } else if (avatarUrl) {
      avatarContent = (
        <Avatar className={avatarBaseClasses}>
          <AvatarImage src={avatarUrl} alt={name} data-ai-hint="person face" />
          <AvatarFallback>{fallbackInitials}</AvatarFallback>
        </Avatar>
      );
    } else {
      avatarContent = (
        <Avatar className={avatarBaseClasses}>
          <AvatarFallback>{fallbackInitials}</AvatarFallback>
        </Avatar>
      );
    }

    return (
        // Avatar click opens profile
        <div className="relative mr-3 shrink-0 cursor-pointer" onClick={handleAvatarClick}>
            {avatarContent}
            {isOnline && (
                <span
                    className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"
                    title="Online"
                />
            )}
        </div>
    );
  };

  const displayLastMessage = isLastMessageSentByCurrentUser ? `You: ${lastMessage}` : lastMessage;

  return (
    <>
    <Link href={href} passHref>
      <div
        className={cn(
          "flex items-center p-3 hover:bg-accent/50 dark:hover:bg-sidebar-accent/50 cursor-pointer rounded-md transition-colors",
          isActive && "bg-accent dark:bg-sidebar-accent",
        )}
      >
        {renderAvatarOrIcon()}
        <div className="flex-1 min-w-0 overflow-hidden"> {/* Parent that constrains width */}
          <div className="flex justify-between items-center">
            {/* Name click does nothing */}
            <div className="flex items-center gap-1 flex-shrink min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{name}</p>
              {isBot && <BlueBirdBotBadge />}
              {!isBot && isDevTeam && <DevTeamBadge />}
              {!isBot && !isDevTeam && (
                <>
                  {isContactVIP && <Crown className="h-4 w-4 text-yellow-500 shrink-0" />}
                  {isVerified && <VerifiedBadge className="shrink-0"/>}
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground ml-1 shrink-0">{timestamp}</span>
          </div>
          <div className="w-full max-w-[70%]"> {/* Wrapper to constrain width */}
            <p className={cn(
              "text-sm text-muted-foreground truncate",
              !isLastMessageSentByCurrentUser && "font-semibold"
              )}>
                {displayLastMessage}
            </p>
          </div>
        </div>
      </div>
    </Link>
     {selectedProfile && (
        <UserProfileDialog
          isOpen={isProfileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          profile={selectedProfile}
        />
      )}
    </>
  );
}
