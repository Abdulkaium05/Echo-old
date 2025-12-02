
'use client';

import { useState, useEffect } from 'react';
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
// Remove Label and Switch imports
import { Check, Moon, Sun } from "lucide-react"; // Added Moon and Sun icons
import { useToast } from '@/hooks/use-toast';

interface AppearanceSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppearanceSettingsDialog({ isOpen, onOpenChange }: AppearanceSettingsDialogProps) {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to track client-side mount

  // Ensure dark mode logic runs only on the client after hydration
  useEffect(() => {
    setIsClient(true);
    // Check initial preference (e.g., from localStorage or system preference)
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Or check localStorage: const savedTheme = localStorage.getItem('theme');
    const initialDarkMode = document.documentElement.classList.contains('dark'); // Check if already set
    setDarkMode(initialDarkMode);
  }, []);

  // Toggle Dark Mode
   const toggleDarkMode = (newMode: boolean) => {
     setDarkMode(newMode);
     // Add logic to apply dark mode class to <html> or <body>
     if (newMode) {
       document.documentElement.classList.add('dark');
       // Optional: Save preference to localStorage
       localStorage.setItem('theme', 'dark');
     } else {
       document.documentElement.classList.remove('dark');
        // Optional: Save preference to localStorage
       localStorage.setItem('theme', 'light');
     }
     console.log("Dark mode toggled:", newMode);
     // Show toast notification for theme change
      toast({
        title: `Theme Changed to ${newMode ? 'Dark' : 'Light'} Mode`,
        description: "Your appearance settings have been updated.",
        action: <Check className="h-5 w-5 text-green-500" />,
      });
      // No need to "save" explicitly, the change is immediate. Close dialog.
      // Optionally keep it open if more appearance settings are added.
       // onOpenChange(false); // Close dialog immediately after toggle
   };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Appearance Settings</DialogTitle>
          <DialogDescription>
            Customize the look and feel of the application.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           {/* Replace Switch with Button */}
           <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                 Toggle Theme
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleDarkMode(!darkMode)}
                disabled={!isClient} // Disable until client mounted
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                {isClient ? ( // Only render icon client-side
                    darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                    // Placeholder or empty during SSR/initial render
                    <div className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
            </div>
            {/* Add more appearance settings like theme selection, font size etc. here */}
        </div>
        <DialogFooter>
          {/* No save button needed as changes are instant, just a close button */}
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
