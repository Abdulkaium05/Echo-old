
// src/app/(app)/subscribe/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionCard } from '@/components/subscribe/subscription-card';
import { useToast } from '@/hooks/use-toast';
import { Crown, Check, PartyPopper, Ban, Loader2, Clock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useVIP } from '@/context/vip-context';
import { useAuth } from '@/context/auth-context';
import { 
    updateVIPStatus as mockUpdateVIPStatus,
    mockLocalUsers, // Import mockLocalUsers
    findChatBetweenUsers, // Import findChatBetweenUsers
    createChat, // Import createChat
    sendMessage, // Import sendMessage
    BOT_UID, // Import BOT_UID
    DEV_UID // Import DEV_UID
} from '@/services/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const subscriptionPlans = [
  { planName: 'Micro VIP', price: 1, durationDays: 1, features: ['VIP Badge', 'Priority Support', 'Exclusive Chat Access', 'Direct Dev Contact', 'Verified User Access'] },
  { planName: 'Mini VIP', price: 2, durationDays: 3, features: ['VIP Badge', 'Priority Support', 'Exclusive Chat Access', 'Direct Dev Contact', 'Verified User Access'] },
  { planName: 'Basic VIP', price: 3, durationDays: 7, features: ['VIP Badge', 'Priority Support', 'Exclusive Chat Access', 'Direct Dev Contact', 'Verified User Access'] },
  { planName: 'Starter VIP', price: 5, durationDays: 10, features: ['VIP Badge', 'Priority Support', 'Exclusive Chat Access', 'Direct Dev Contact', 'Verified User Access'] },
  { planName: 'Bronze VIP', price: 10, durationDays: 15, features: ['VIP Badge', 'Priority Support', 'Exclusive Chat Access', 'Early Feature Access', 'Direct Dev Contact', 'Verified User Access'] },
  { planName: 'Silver VIP', price: 25, durationDays: 30, features: ['VIP Badge', 'Priority Support', 'Exclusive Chat Access', 'Early Feature Access', 'Custom Theme', 'Direct Dev Contact', 'Verified User Access'], isPopular: true },
  { planName: 'Gold VIP', price: 50, durationDays: 75, features: ['VIP Badge', 'Dedicated Support', 'Exclusive Chat Access', 'Early Feature Access', 'Custom Theme', 'Increased Limits', 'Direct Dev Contact', 'Verified User Access'] },
  { planName: 'Platinum VIP', price: 100, durationDays: 180, features: ['VIP Badge', 'Dedicated Support', 'Exclusive Chat Access', 'Early Feature Access', 'Custom Theme', 'Increased Limits', 'Direct Dev Contact', 'Verified User Access'] },
];

export default function SubscribePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, userProfile, loading: authLoading, isUserProfileLoading, updateMockUserProfile } = useAuth();
  const { isVIP: contextVIP, setVIPStatus: setContextVIPStatus, vipPack: contextVipPack } = useVIP();

  const isVIP = userProfile ? userProfile.isVIP ?? false : contextVIP;
  const currentVipPack = userProfile ? userProfile.vipPack : contextVipPack;
  const vipExpiryTimestamp = userProfile?.vipExpiryTimestamp;

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [subscribedPlanName, setSubscribedPlanName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  const formatRemainingTime = (ms: number): string => {
    if (ms <= 0) return "Expired";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleSubscriptionExpired = useCallback(async () => {
    if (!user) return;
    setIsProcessing(true); 
    toast({
      title: "VIP Subscription Expired",
      description: "Your VIP benefits have ended. Renew to continue enjoying VIP features!",
      variant: "destructive",
    });
    try {
      await mockUpdateVIPStatus(user.uid, false);
      updateMockUserProfile(user.uid, { isVIP: false, vipPack: undefined, vipExpiryTimestamp: undefined });
      setContextVIPStatus(false);
      setRemainingTime(null); 
    } catch (error) {
      console.error("Error handling subscription expiry:", error);
      toast({
        title: "Error",
        description: "Could not update your subscription status after expiry.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user, updateMockUserProfile, setContextVIPStatus, toast]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isVIP && vipExpiryTimestamp) {
      const updateTimer = () => {
        const now = Date.now();
        const timeLeft = vipExpiryTimestamp - now;
        if (timeLeft <= 0) {
          setRemainingTime("Expired");
          if (intervalId) clearInterval(intervalId);
          handleSubscriptionExpired(); 
        } else {
          setRemainingTime(formatRemainingTime(timeLeft));
        }
      };
      updateTimer(); 
      intervalId = setInterval(updateTimer, 1000);
    } else {
      setRemainingTime(null);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isVIP, vipExpiryTimestamp, handleSubscriptionExpired]);


  const handleSubscribe = async (planName: string, price: number, durationDays: number) => {
    if (!user) {
       toast({ title: "Not Logged In", description: "You must be logged in to subscribe.", variant: "destructive"});
       router.push('/login');
       return;
    }
    setIsProcessing(true);
    setSubscribedPlanName(planName);

    toast({
      title: "Processing Payment...",
      description: `Processing payment for ${planName}. Please wait.`,
      variant: "default",
    });

    await new Promise(resolve => setTimeout(resolve, 2000)); 

    try {
      const expiry = Date.now() + durationDays * 24 * 60 * 60 * 1000;
      await mockUpdateVIPStatus(user.uid, true, planName, durationDays);
      // Do not automatically verify user on VIP purchase
      updateMockUserProfile(user.uid, { 
          isVIP: true, 
          vipPack: planName, 
          // isVerified: true, // Removed: VIP does not grant verification
          vipExpiryTimestamp: expiry 
      });
      setContextVIPStatus(true, planName);

      // Auto-add verified contacts and dev team
      let addedContactsCount = 0;
      for (const potentialContact of mockLocalUsers) {
        if (
          (potentialContact.isVerified || potentialContact.isDevTeam) &&
          potentialContact.uid !== user.uid && // Don't add self
          potentialContact.uid !== BOT_UID // Don't add bot
        ) {
          const existingChatId = await findChatBetweenUsers(user.uid, potentialContact.uid);
          if (!existingChatId) {
            await createChat(user.uid, potentialContact.uid);
            addedContactsCount++;
          }
        }
      }

      if (addedContactsCount > 0) {
        toast({
          title: "Contacts Added",
          description: `Chats with ${addedContactsCount} verified member(s)/dev team have been automatically started for you!`,
        });
      }
      
      // Auto-send congratulations messages from verified/dev team
      for (const senderProfile of mockLocalUsers) {
        if (
          (senderProfile.isVerified || senderProfile.isDevTeam) &&
          senderProfile.uid !== user.uid && // Sender is not the new VIP
          senderProfile.uid !== BOT_UID // Sender is not the bot
        ) {
          try {
            // Ensure chat exists (it should have been created in the previous step)
            let chatIdForCongrats = await findChatBetweenUsers(senderProfile.uid, user.uid);
            if (!chatIdForCongrats) {
               // This case should be rare if the previous loop worked, but as a fallback:
               chatIdForCongrats = await createChat(senderProfile.uid, user.uid);
            }
            const congratulatoryMessage = "."; // Changed to a single dot
            await sendMessage(chatIdForCongrats, senderProfile.uid, congratulatoryMessage);
            console.log(`Sent congrats message from ${senderProfile.name} to ${userProfile?.name}`);
          } catch (msgError) {
            console.error(`Error sending congrats message from ${senderProfile.name}:`, msgError);
          }
        }
      }


      toast({
        title: "Subscription Successful!",
        description: `You have subscribed to ${planName}. VIP access granted.`,
        variant: "default",
        action: <Check className="h-5 w-5 text-green-500" />,
      });
      setShowConfirmationDialog(true);
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Subscription Failed",
        description: "Could not update your VIP status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = () => {
     setShowCancelDialog(true);
  };

  const confirmCancelSubscription = async () => {
    if (!user) return;
    setIsProcessing(true);
    setShowCancelDialog(false);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        await mockUpdateVIPStatus(user.uid, false);
        updateMockUserProfile(user.uid, { isVIP: false, vipPack: undefined, vipExpiryTimestamp: undefined });
        setContextVIPStatus(false);
        setRemainingTime(null);

        toast({
          title: "Subscription Cancelled",
          description: "Your VIP benefits have been removed.",
          variant: "destructive",
          action: <Ban className="h-5 w-5 text-red-500" />,
        });
         router.push('/chat');

    } catch (error) {
        console.error("Error cancelling subscription:", error);
        toast({
          title: "Cancellation Failed",
          description: "Could not cancel your VIP status. Please try again.",
          variant: "destructive",
        });
    } finally {
        setIsProcessing(false);
    }
  };

  const closeConfirmationAndRedirect = () => {
    setShowConfirmationDialog(false);
    router.push('/chat');
  };

  if (authLoading || isUserProfileLoading) {
    return (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading Subscription Status...</span>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 h-full overflow-y-auto">
      {isVIP ? (
         <div className="flex flex-col items-center">
           <Card className="w-full max-w-md">
             <CardHeader className="text-center">
               <Crown className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-primary" />
               <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                 Manage Your VIP Membership
               </CardTitle>
               <CardDescription className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground">
                  You are currently a VIP member{currentVipPack ? ` (${currentVipPack})` : ''}!
               </CardDescription>
             </CardHeader>
             <CardContent className="text-center">
                {remainingTime && (
                    <div className="mb-4 p-3 bg-accent/50 rounded-md">
                        <p className="text-sm font-medium text-foreground flex items-center justify-center gap-2">
                            <Clock className="h-4 w-4"/> Time Remaining:
                        </p>
                        <p className="text-lg font-semibold text-primary">{remainingTime}</p>
                    </div>
                )}
               <p className="mb-4 text-muted-foreground">Want to change something? Contact support or cancel below.</p>
             </CardContent>
             <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" disabled={isProcessing} onClick={() => toast({title: "Support Contacted", description:"Our team will get back to you shortly."})}>Contact Support</Button>
               <Button variant="destructive" onClick={handleCancelSubscription} disabled={isProcessing}>
                 {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                 Cancel Subscription
               </Button>
             </CardFooter>
           </Card>
         </div>
       ) : (
         <>
           <div className="text-center mb-8 md:mb-12">
             <Crown className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-primary" />
             <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-4xl">
               Become a VIP Member
             </h1>
             <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground">
               Unlock exclusive features like the VIP theme, chat directly with developers & verified users, and support Echo Message.
             </p>
           </div>
           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
             {subscriptionPlans.map((plan, index) => (
               <SubscriptionCard
                 key={index}
                 {...plan}
                 onSubscribe={() => handleSubscribe(plan.planName, plan.price, plan.durationDays)}
               />
             ))}
           </div>
           <div className="mt-8 md:mt-12 text-center text-muted-foreground text-xs md:text-sm">
             <p>Payments are processed securely.</p>
             <p>Need help? <Button variant="link" className="p-0 h-auto text-xs md:text-sm" onClick={() => toast({title: "Support Contacted", description:"Contacting support..."})}>Contact Support</Button></p>
           </div>
         </>
       )}

        <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
               <div className="flex justify-center mb-4">
                   <PartyPopper className={cn("h-12 w-12 text-primary", showConfirmationDialog && "animate-pulse")} />
               </div>
              <AlertDialogTitle className="text-center text-xl font-semibold">Congratulations!</AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                You are now a VIP Member! You've subscribed to the{" "}
                <strong>{subscribedPlanName}</strong> plan. Enjoy your exclusive benefits!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                 <Button onClick={closeConfirmationAndRedirect}>Awesome!</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel VIP Subscription?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your VIP subscription? You will lose access to all VIP benefits.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowCancelDialog(false)} disabled={isProcessing}>Keep Subscription</AlertDialogCancel>
              <AlertDialogAction
                  onClick={confirmCancelSubscription}
                  className={buttonVariants({ variant: "destructive" })}
                  disabled={isProcessing}
               >
                 {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                 Confirm Cancellation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

