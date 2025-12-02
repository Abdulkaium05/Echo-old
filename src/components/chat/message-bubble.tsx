import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MessageBubbleProps {
  text: string;
  imageUrl?: string;
  timestamp: string;
  isSentByCurrentUser: boolean;
}

export function MessageBubble({ text, imageUrl, timestamp, isSentByCurrentUser }: MessageBubbleProps) {
  return (
    <div className={cn(
      "flex mb-2",
      isSentByCurrentUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] px-3 py-2 rounded-lg shadow-md flex flex-col", 
        isSentByCurrentUser
          ? "bg-primary text-primary-foreground rounded-br-none"
          : "bg-card text-card-foreground rounded-bl-none"
      )}>
        {text && <p className="text-sm break-words">{text}</p>}
        {imageUrl && (
          <div className="mt-1 max-w-xs h-auto relative">
            <Image
              src={imageUrl}
              alt="Sent image"
              width={300} // Provide a base width, it will be responsive
              height={200} // Provide a base height
              className="rounded-md object-contain"
              style={{ maxWidth: '100%', height: 'auto' }} // Ensure responsiveness
              data-ai-hint="chat image"
            />
          </div>
        )}
        <span className={cn(
          "text-xs mt-1 block text-right self-end", // Ensure timestamp is at the bottom right
          isSentByCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}
