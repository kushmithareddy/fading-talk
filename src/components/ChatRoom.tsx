import { useEffect, useRef, useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";

interface CreateChatOptions {
  webhookUrl: string;
  mode?: string;
  initialMessages?: string[];
  target?: string;
}

declare global {
  interface Window {
    createChat?: (options: CreateChatOptions) => void;
  }
}

export const ChatRoom = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const styleLoadedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load n8n chat CSS
    if (!styleLoadedRef.current) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/style.css";
      document.head.appendChild(link);
      styleLoadedRef.current = true;
    }

    // Load n8n chat script
    if (!scriptLoadedRef.current) {
      const script = document.createElement("script");
      script.type = "module";
      script.innerHTML = `
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/chat.bundle.es.js';
        
        window.addEventListener('DOMContentLoaded', () => {
          try {
            createChat({
              webhookUrl: 'https://saitejareddy.app.n8n.cloud/webhook/798b5980-d87e-4b1b-90dd-71d239d05faa/chat',
              mode: 'fullscreen',
              initialMessages: ['Hello! How can I help you today?']
            });
            window.dispatchEvent(new Event('chatLoaded'));
          } catch (err) {
            console.error('Error initializing chat:', err);
            window.dispatchEvent(new Event('chatError'));
          }
        });
      `;
      document.body.appendChild(script);
      scriptLoadedRef.current = true;

      // Listen for chat loaded event
      const handleChatLoaded = () => {
        setIsLoading(false);
      };

      const handleChatError = () => {
        setError("Failed to initialize chat");
        setIsLoading(false);
      };

      window.addEventListener('chatLoaded', handleChatLoaded);
      window.addEventListener('chatError', handleChatError);

      // Set a timeout in case events don't fire
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => {
        window.removeEventListener('chatLoaded', handleChatLoaded);
        window.removeEventListener('chatError', handleChatError);
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-background">
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading chat assistant...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20">
              <MessageCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive-foreground font-semibold mb-2">Chat Unavailable</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};