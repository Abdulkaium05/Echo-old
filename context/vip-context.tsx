
// src/context/vip-context.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/auth-context'; // Import useAuth to access user profile

// --- Simulation Flag for Development ---
// Set to true to force VIP status and theme for easy testing of all features.
// Set to false for normal behavior based on userProfile.
const IS_DEV_SIMULATION_MODE = false; 
const DEV_SIMULATION_PACK_NAME = 'Simulated VIP Pack';
// ---------------------------------

interface VIPContextProps {
  isVIP: boolean;
  setVIPStatus: (status: boolean, pack?: string) => void;
}

const VIPContext = createContext<VIPContextProps | undefined>(undefined);

export const VIPProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile, isUserProfileLoading } = useAuth();
  const [isVIP, setIsVIP] = useState(IS_DEV_SIMULATION_MODE);

  useEffect(() => {
    if (IS_DEV_SIMULATION_MODE) {
      console.log("VIPProvider: Dev simulation active. Forcing VIP status and theme.");
      setIsVIP(true);
      setVipPack(DEV_SIMULATION_PACK_NAME);
      if (typeof window !== 'undefined') document.documentElement.classList.add('vip-theme');
      return;
    }

    if (!isUserProfileLoading && userProfile) {
       // Check expiry if VIP
       let currentVIPStatus = userProfile.isVIP ?? false;
       let currentVIPPack = userProfile.vipPack;

       if (currentVIPStatus && userProfile.vipExpiryTimestamp && Date.now() > userProfile.vipExpiryTimestamp) {
           console.log("VIPProvider: VIP subscription expired. Reverting to non-VIP.");
           currentVIPStatus = false;
           currentVIPPack = undefined;
           // Note: The actual update to userProfile (clearing vipExpiryTimestamp)
           // should happen in the subscribe page or a dedicated logic,
           // this context just reflects the current state.
       }
       
       console.log(`VIPProvider: Initializing VIP status from profile: ${currentVIPStatus}, Pack: ${currentVIPPack}`);
       setIsVIP(currentVIPStatus);
       if (typeof window !== 'undefined') {
           if (currentVIPStatus) {
               document.documentElement.classList.add('vip-theme');
           } else {
               document.documentElement.classList.remove('vip-theme');
           }
       }
    } else if (!isUserProfileLoading && !userProfile) {
        console.log("VIPProvider: No user profile found, setting VIP to false.");
        setIsVIP(false);
        if (typeof window !== 'undefined') document.documentElement.classList.remove('vip-theme');
    }
     else if (isUserProfileLoading) {
         console.log("VIPProvider: Waiting for user profile to load...");
     }
  }, [userProfile, isUserProfileLoading]);


  const setVIPStatus = useCallback((status: boolean, pack?: string) => {
    if (IS_DEV_SIMULATION_MODE) {
      setIsVIP(true);
      if (typeof window !== 'undefined') document.documentElement.classList.add('vip-theme');
      console.log("VIPProvider (setVIPStatus): Dev simulation active. VIP status remains true.");
      return;
    }

    // If status is true, but profile indicates expiry, we should respect expiry.
    // However, this function is usually called when status *changes*, e.g., user subscribes/cancels.
    let actualStatus = status;
    if (status && userProfile?.vipExpiryTimestamp && Date.now() > userProfile.vipExpiryTimestamp) {
        console.warn("VIPProvider (setVIPStatus): Attempting to set VIP to true, but subscription is expired. Setting to false.");
        actualStatus = false;
    }

    console.log(`VIPProvider (setVIPStatus): Setting VIP status to ${actualStatus}, Pack: ${actualStatus ? pack : undefined}`);
    setIsVIP(actualStatus);

    if (typeof window !== 'undefined') {
     if (actualStatus) {
        document.documentElement.classList.add('vip-theme');
     } else {
        document.documentElement.classList.remove('vip-theme');
     }
    }
  }, [userProfile]); // Add userProfile to dependencies

   const value = { isVIP, setVIPStatus };

  return (
    <VIPContext.Provider value={value}>
      {children}
    </VIPContext.Provider>
  );
};

export const useVIP = () => {
  const context = useContext(VIPContext);
  if (context === undefined) {
    throw new Error('useVIP must be used within a VIPProvider');
  }
  return context;
};
