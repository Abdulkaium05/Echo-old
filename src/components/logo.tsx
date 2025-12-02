import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  // Add any specific props if needed
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    // Updated viewBox and SVG elements to match the provided image
    <svg
      viewBox="0 0 160 40" // Keep viewBox reasonable, adjust elements within
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // Use primary color for the icon by default, height defaults to h-6
      className={cn("text-primary h-6", className)}
      {...props}
    >
      {/* Icon Group (Speech Bubble + Waveform) */}
      {/* Position the icon group */}
      <g transform="translate(0, 0)">
        {/* Speech Bubble Path (Sky Blue) */}
        {/* Updated path for a more standard speech bubble with bottom-left pointer */}
        <path
          d="M 9 4 L 37 4 A 5 5 0 0 1 42 9 L 42 25 A 5 5 0 0 1 37 30 L 15 30 L 10 36 L 10 30 L 9 30 A 5 5 0 0 1 4 25 L 4 9 A 5 5 0 0 1 9 4 Z"
          fill="currentColor" // Inherits text-primary color
        />
        {/* Waveform Elements (White) */}
        {/* Central Bar */}
        <rect x="21" y="12" width="4" height="16" rx="2" fill="hsl(var(--primary-foreground))" />
        {/* Left Bar */}
        <rect x="15" y="15" width="3" height="10" rx="1.5" fill="hsl(var(--primary-foreground))" />
        {/* Right Bar */}
        <rect x="28" y="15" width="3" height="10" rx="1.5" fill="hsl(var(--primary-foreground))" />
        {/* Left Dot */}
        <circle cx="11.5" cy="18" r="2" fill="hsl(var(--primary-foreground))" />
        {/* Right Dot */}
        <circle cx="34.5" cy="18" r="2" fill="hsl(var(--primary-foreground))" />
      </g>

      {/* Text "echo" (Sky Blue - matching the icon color) */}
      {/* Position the text relative to the icon */}
      <text
        x="55" // Adjusted X position to be next to the icon
        y="27" // Adjusted Y position for vertical alignment
        fontFamily="Arial, sans-serif" // Keeping a standard sans-serif font
        fontSize="26" // Adjusted font size
        fontWeight="bold"
        // Using currentColor here as well, assuming text should match icon color
        // If text needs to be foreground, change fill to 'hsl(var(--foreground))'
        fill="currentColor"
      >
        echo
      </text>
    </svg>
  );
}
