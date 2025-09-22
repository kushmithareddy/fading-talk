import { useState } from "react";
import { Send, Clock, Zap } from "lucide-react";
import { Button } from "./ui/button";

interface MessageInputProps {
  onSendMessage: (content: string, vanishTime?: number) => void;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [vanishTime, setVanishTime] = useState<number | null>(null);
  const [showVanishOptions, setShowVanishOptions] = useState(false);

  const vanishOptions = [
    { label: "10s", value: 10, icon: "⚡" },
    { label: "30s", value: 30, icon: "🔥" },
    { label: "1m", value: 60, icon: "⏱️" },
    { label: "5m", value: 300, icon: "🕐" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message, vanishTime || undefined);
    setMessage("");
    setVanishTime(null);
    setShowVanishOptions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="glass rounded-2xl p-4 space-y-3 shadow-soft">
      {/* Vanish Time Options */}
      {showVanishOptions && (
        <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Auto-vanish after:
          </span>
          {vanishOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setVanishTime(option.value)}
              className={`
                px-3 py-1 rounded-lg text-xs font-medium transition-smooth
                ${vanishTime === option.value
                  ? 'bg-destructive text-destructive-foreground shadow-sm'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {option.icon} {option.label}
            </button>
          ))}
          <button
            onClick={() => setVanishTime(null)}
            className={`
              px-3 py-1 rounded-lg text-xs font-medium transition-smooth
              ${vanishTime === null
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
              }
            `}
          >
            ∞ Forever
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send)"
            className="w-full bg-input/50 border border-input-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground resize-none transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px] max-h-32"
            rows={1}
            style={{
              resize: 'none',
              height: 'auto',
              minHeight: '44px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
          
          {/* Vanish indicator */}
          {vanishTime && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-destructive">
              <Clock className="h-3 w-3" />
              {vanishTime}s
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowVanishOptions(!showVanishOptions)}
            className={`
              h-11 w-11 transition-smooth
              ${showVanishOptions || vanishTime ? 'bg-destructive/10 border-destructive text-destructive' : ''}
            `}
          >
            {vanishTime ? <Clock className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
          </Button>

          <Button
            type="submit"
            size="icon"
            disabled={!message.trim()}
            className="h-11 w-11 bg-primary-gradient hover:shadow-glow transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Character count */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>
          {vanishTime 
            ? `Message will vanish after ${vanishTime}s` 
            : "Message will stay forever"
          }
        </span>
        <span className={message.length > 500 ? 'text-destructive' : ''}>
          {message.length}/500
        </span>
      </div>
    </div>
  );
};