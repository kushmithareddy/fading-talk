import { useState, useEffect } from "react";
import { Clock, Trash2 } from "lucide-react";
import { Message } from "./ChatRoom";

interface ChatMessageProps {
  message: Message;
  onDelete: (messageId: string) => void;
}

export const ChatMessage = ({ message, onDelete }: ChatMessageProps) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isVanishing, setIsVanishing] = useState(false);

  useEffect(() => {
    if (!message.vanishTime) return;

    setTimeLeft(message.vanishTime);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) {
          setIsVanishing(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [message.vanishTime]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const isSystem = message.username === "System";

  if (isSystem) {
    return (
      <div className="flex justify-center message-enter">
        <div className="px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground border border-muted">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`
      flex gap-3 message-enter group
      ${message.isOwn ? 'justify-end' : 'justify-start'}
      ${isVanishing ? 'message-vanish' : ''}
    `}>
      {/* Avatar */}
      {!message.isOwn && (
        <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-soft">
          {message.username.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Message Content */}
      <div className={`
        max-w-md lg:max-w-lg xl:max-w-xl space-y-1
        ${message.isOwn ? 'items-end' : 'items-start'}
      `}>
        {/* Username and Time */}
        <div className={`flex items-center gap-2 text-xs text-muted-foreground
          ${message.isOwn ? 'justify-end' : 'justify-start'}
        `}>
          {!message.isOwn && <span className="font-medium">{message.username}</span>}
          <span>{formatTime(message.timestamp)}</span>
          {message.isOwn && <span className="font-medium">You</span>}
        </div>

        {/* Message Bubble */}
        <div className={`
          px-4 py-3 rounded-2xl shadow-message transition-smooth relative
          ${message.isOwn 
            ? 'bg-primary-gradient text-primary-foreground' 
            : 'bg-secondary-gradient text-secondary-foreground'
          }
          ${timeLeft !== null && timeLeft <= 10 ? 'ring-2 ring-destructive animate-pulse' : ''}
        `}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Vanish Timer */}
          {timeLeft !== null && (
            <div className={`
              flex items-center gap-1 mt-2 pt-2 border-t text-xs
              ${message.isOwn 
                ? 'border-primary-foreground/20 text-primary-foreground/70' 
                : 'border-secondary-foreground/20 text-secondary-foreground/70'
              }
            `}>
              <Clock className="h-3 w-3" />
              <span>
                {timeLeft > 0 ? `Vanishes in ${timeLeft}s` : 'Vanishing...'}
              </span>
            </div>
          )}

          {/* Delete Button (for own messages) */}
          {message.isOwn && (
            <button
              onClick={() => onDelete(message.id)}
              className="absolute -right-2 -top-2 p-1.5 bg-destructive hover:bg-destructive-glow text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-smooth shadow-soft"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Avatar (own messages) */}
      {message.isOwn && (
        <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm shadow-soft">
          {message.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};