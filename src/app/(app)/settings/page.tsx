
// src/app/(app)/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, Bell, Lock, Crown } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useVIP } from '@/context/vip-context';

export default function SettingsPage() {
  const { isVIP, vipPack } = useVIP();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showVipDialog, setShowVipDialog] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleSaveChanges = () => {
     console.log("Notification Settings saved:", { notificationsEnabled });
     toast({
       title: "Notification Settings Updated",
       description: "Your notification preferences have been saved.",
       action: <Check className="h-5 w-5 text-green-500" />,
     });
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 h-full overflow-y-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6 md:mb-8">
        More Settings
      </h1>

      <div className="grid gap-6 md:gap-8 md:grid-cols-1 lg:grid-cols-2">

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle>
            <CardDescription>Control how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications-switch" className="flex-1 mr-2 break-words">Enable Notifications</Label>
              <Switch
                id="notifications-switch"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                disabled={!isClient}
              />
            </div>
            <p className="text-sm text-muted-foreground">Configure sounds, pop-ups, etc.</p>
          </CardContent>
           <CardFooter>
             <Button onClick={handleSaveChanges} className="w-full sm:w-auto ml-auto">Save Notification Settings</Button>
           </CardFooter>
        </Card>

         <Card className="lg:col-span-1">
           <CardHeader>
             <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" /> Account & Security</CardTitle>
             <CardDescription>Manage password, linked accounts, etc.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <Button variant="outline" onClick={() => toast({title: "Feature In Development", description: "Changing password will be available soon."})}>Change Password</Button>
             <Button variant="outline" onClick={() => toast({title: "Feature In Development", description: "Managing linked accounts will be available soon."})}>Manage Linked Accounts</Button>
           </CardContent>
         </Card>

         <Card className="lg:col-span-2">
           <CardHeader>
             <CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-yellow-500" /> VIP Membership</CardTitle>
             <CardDescription>Manage your VIP subscription and benefits.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             {isVIP ? (
                <p className="text-sm text-green-600 font-semibold">You are currently a VIP member{vipPack ? ` (${vipPack})` : ''}!</p>
             ) : (
               <p className="text-sm text-muted-foreground">You are not currently a VIP member.</p>
             )}
             <Button onClick={() => setShowVipDialog(true)} variant="outline">
               {isVIP ? 'View VIP Details' : 'Learn about VIP'}
             </Button>
           </CardContent>
         </Card>
      </div>

      <Dialog open={showVipDialog} onOpenChange={setShowVipDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Crown className="h-6 w-6 text-yellow-500" /> VIP Information</DialogTitle>
            <DialogDescription>Details about your VIP membership.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isVIP ? (
              <>
                 <p>You are a VIP member!</p>
                 {vipPack && <p>Your current pack is: <span className="font-semibold">{vipPack}</span>.</p>}
              </>
            ) : (
              <p>Become a VIP member to unlock exclusive features and benefits!</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
