
// src/app/(app)/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Crown, Settings, User, LogOut, Palette, Edit, MessageSquare, Loader2 } from 'lucide-react';
import { ChatList } from '@/components/chat/chat-list';
import { cn } from '@/lib/utils';
import { VIPProvider, useVIP } from '@/context/vip-context';
import { ProfileSettingsDialog } from '@/components/settings/profile-settings-dialog';
import { AppearanceSettingsDialog } from '@/components/settings/appearance-settings-dialog';
import { Logo } from '@/components/logo';
import { useAuth, type UserProfile } from '@/context/auth-context';
import { VerifiedBadge } from '@/components/verified-badge'; // Import VerifiedBadge

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <VIPProvider>
      <AppLayout>{children}</AppLayout>
    </VIPProvider>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isVIP, setVIPStatus } = useVIP();
  const { user: currentUser, userProfile: currentUserProfile, loading: authLoading, isUserProfileLoading, logout, updateMockUserProfile } = useAuth();

  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
  const [isAppearanceDialogOpen, setAppearanceDialogOpen] = useState(false);

   useEffect(() => {
     if (currentUserProfile) {
        setVIPStatus(currentUserProfile.isVIP ?? false, currentUserProfile.vipPack);
     } else {
        setVIPStatus(false); // Default to false if no profile
     }
   }, [currentUserProfile, setVIPStatus]);

  const isViewingChat = /^\/chat\/[^/]+$/.test(pathname);
  const currentChatId = isViewingChat ? pathname.split('/')[2] : undefined;


  const handleLogout = async () => {
    console.log("AppLayout: Handling logout.");
    await logout();
    // The middleware should handle redirecting to /login after session data is cleared
    // router.replace('/login'); // No longer strictly needed if middleware is robust
    console.log("AppLayout: Logout processed. Middleware will redirect if necessary.");
  };

   const handleProfileUpdate = async (updatedData: { name: string; avatarUrl?: string }) => {
     if (!currentUser || !currentUserProfile) {
         console.error("AppLayout: Cannot update profile, current user or profile missing.");
         return;
     }
      console.log("AppLayout: Handling profile update.", updatedData);
      try {
          // updateMockUserProfile updates the AuthContext state and syncs with firestore.ts mock
          updateMockUserProfile(currentUser.uid, { 
              name: updatedData.name, 
              avatarUrl: updatedData.avatarUrl 
          });
          console.log("AppLayout: Profile update request sent to AuthContext.");
      } catch (error) {
          console.error("AppLayout: Error processing profile update:", error);
      }
   };

  // Moved redirect logic into useEffect
  useEffect(() => {
    if (!authLoading && !currentUser && !isUserProfileLoading) {
      console.warn("AppLayout: No authenticated user after load. Redirecting to login.");
      router.replace('/login');
    }
  }, [authLoading, currentUser, isUserProfileLoading, router]);


   if (authLoading || (currentUser && isUserProfileLoading)) {
       return (
           <div className="flex h-screen w-full items-center justify-center bg-background">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="ml-2 text-muted-foreground">Loading User Data...</p>
           </div>
       );
   }

    // If auth is done loading and there's no current user, show loading while redirect happens.
    if (!authLoading && !currentUser && !isUserProfileLoading) {
        console.warn("AppLayout: No authenticated user after load. Preparing redirect to login.");
         return (
             <div className="flex h-screen w-full items-center justify-center bg-background">
                 <Loader2 className="h-8 w-8 animate-spin text-destructive" />
                 <p className="ml-2 text-destructive">Redirecting to login...</p>
             </div>
         );
    }
  
    // If there is a user but no profile after loading, this is an error state.
    if (currentUser && !currentUserProfile && !isUserProfileLoading) {
         console.error("AppLayout: Authenticated user found but profile data is missing after load.");
         return (
             <div className="flex h-screen w-full items-center justify-center bg-background flex-col gap-4 p-4 text-center">
                 <Loader2 className="h-8 w-8 animate-spin text-destructive" />
                 <p className="text-destructive">Error: User profile data could not be loaded.</p>
                 <Button onClick={handleLogout} variant="outline" className="mt-2">Logout</Button>
             </div>
         );
    }
    
    // This case should ideally not be hit if the above logic is correct
    // but serves as a final fallback.
    if (!currentUserProfile && currentUser) { // Ensure currentUser exists before checking for profile again
        return (
          <div className="flex h-screen w-full items-center justify-center bg-background text-center p-4">
            <p className="text-destructive">Error: User profile is unexpectedly missing. Please try logging out and logging back in.</p>
            <Button onClick={handleLogout} variant="outline" className="mt-4">Logout</Button>
          </div>
        );
    }
    // Fallback if currentUserProfile is null, but authLoading and isUserProfileLoading are false, and currentUser is also null (should be handled by redirect)
    // This is a safeguard.
    if(!currentUserProfile && !currentUser && !authLoading && !isUserProfileLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="ml-2 text-muted-foreground">Finalizing authentication...</p>
            </div>
        );
    }


  return (
    <div className={cn(
        "flex h-screen w-full bg-background flex-col md:flex-row"
        )}>
      <aside className="hidden md:flex md:flex-col w-80 border-r bg-secondary shrink-0">
         <div className="flex items-center justify-between p-4 border-b">
             <Link href="/chat" className="flex items-center gap-2">
                <Logo className="h-8" />
             </Link>
             {currentUserProfile && (
                <UserMenu
                    user={currentUserProfile}
                    isVIP={isVIP} // isVIP from useVIP() hook
                    onLogout={handleLogout}
                    onOpenProfileSettings={() => setProfileDialogOpen(true)}
                    onOpenAppearanceSettings={() => setAppearanceDialogOpen(true)}
                />
             )}
         </div>
        {currentUser && <ChatList currentChatId={currentChatId} currentUserId={currentUser.uid} isVIP={isVIP} />}
      </aside>

      <header className="md:hidden flex items-center justify-between p-3 border-b bg-secondary sticky top-0 z-10 shrink-0">
         <Link href="/chat" className="flex items-center gap-2">
             <Logo className="h-8" />
         </Link>
         {currentUserProfile && (
            <UserMenu
                user={currentUserProfile}
                isVIP={isVIP} // isVIP from useVIP() hook
                onLogout={handleLogout}
                onOpenProfileSettings={() => setProfileDialogOpen(true)}
                onOpenAppearanceSettings={() => setAppearanceDialogOpen(true)}
            />
         )}
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile: Show ChatList if on /chat and no specific chat is open */}
          <div className={cn("h-full md:hidden", {
              'hidden': isViewingChat || pathname !== '/chat', // Hide if viewing a chat or not on /chat path
              'block': pathname === '/chat' && !isViewingChat,  // Show if on /chat and no specific chat is selected
          })}>
            {pathname === '/chat' && !isViewingChat && currentUser && <ChatList currentChatId={undefined} currentUserId={currentUser.uid} isVIP={isVIP} />}
          </div>

          {/* Mobile: Show specific chat content or other page content */}
          <div className={cn("h-full md:hidden", {
              'hidden': !isViewingChat && pathname === '/chat', // Hide if NOT viewing a specific chat AND on /chat (ChatList shown above)
              'block': isViewingChat || pathname !== '/chat', // Show if viewing a chat OR on any page other than /chat
          })}>
              {children}
          </div>

         {/* Desktop: Always show children in the main panel */}
         <div className="hidden md:flex h-full">
            {children}
         </div>
      </main>

      {currentUserProfile && (
        <>
          <ProfileSettingsDialog
            isOpen={isProfileDialogOpen}
            onOpenChange={setProfileDialogOpen}
            user={currentUserProfile} // Pass the currentUserProfile from AuthContext
            onProfileUpdate={handleProfileUpdate}
          />
          <AppearanceSettingsDialog
            isOpen={isAppearanceDialogOpen}
            onOpenChange={setAppearanceDialogOpen}
          />
        </>
      )}
    </div>
  );
}

interface UserMenuProps {
  user: UserProfile; // Use the UserProfile type
  isVIP: boolean; // This specific prop is for the VIP status, usually from useVIP() context
  onLogout: () => void;
  onOpenProfileSettings: () => void;
  onOpenAppearanceSettings: () => void;
}

function UserMenu({ user, isVIP, onLogout, onOpenProfileSettings, onOpenAppearanceSettings }: UserMenuProps) {
   const fallbackInitials = user.name ? user.name.substring(0, 2).toUpperCase() : '??';
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
           <Avatar className="h-8 w-8">
             <AvatarImage src={user.avatarUrl} alt={user.name || 'User Avatar'} data-ai-hint="person face"/>
             <AvatarFallback>{fallbackInitials}</AvatarFallback>
           </Avatar>
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent className="w-56" align="end" forceMount>
         <DropdownMenuLabel className="font-normal">
           <div className="flex flex-col space-y-1">
             <p className="text-sm font-medium leading-none flex items-center gap-1">
                {user.name || 'User'}
                {isVIP && <Crown className="h-4 w-4 text-yellow-500" />}
                {user.isVerified && <VerifiedBadge className="h-4 w-4" />}
             </p>
             <p className="text-xs leading-none text-muted-foreground">
               {user.email}
             </p>
           </div>
         </DropdownMenuLabel>
         <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
             <Link href="/chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Chats</span>
              </Link>
          </DropdownMenuItem>
           <DropdownMenuItem onClick={onOpenProfileSettings}>
             <Edit className="mr-2 h-4 w-4" />
             <span>Edit Profile</span>
           </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenAppearanceSettings}>
              <Palette className="mr-2 h-4 w-4" />
              <span>Appearance</span>
            </DropdownMenuItem>
           <DropdownMenuItem asChild>
             <Link href="/subscribe">
               <Crown className="mr-2 h-4 w-4 text-yellow-500" />
               <span>{isVIP ? 'Manage VIP' : 'Get VIP'}</span>
             </Link>
         </DropdownMenuItem>
         <DropdownMenuItem asChild>
             <Link href="/settings">
               <Settings className="mr-2 h-4 w-4" />
               <span>More Settings</span>
             </Link>
         </DropdownMenuItem>
         <DropdownMenuSeparator />
         <DropdownMenuItem onClick={onLogout}>
           <LogOut className="mr-2 h-4 w-4" />
           <span>Log out</span>
         </DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
   );
}
