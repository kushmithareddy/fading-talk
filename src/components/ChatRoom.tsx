import { useEffect, useRef, useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";

declare global {
  interface Window {
    n8nChat?: {
      init: (config: {
        webhookUrl: string;
        target: string;
        mode: string;
        initialMessages?: string[];
      }) => void;
      open?: () => void;
    };
  }
}

export const ChatRoom = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load n8n chat script
    if (!scriptLoadedRef.current) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@n8n/chat@latest";
      script.async = true;
      
      script.onload = () => {
        // Wait a bit for the script to be ready
        setTimeout(() => {
          try {
            if (window.n8nChat && chatContainerRef.current) {
              window.n8nChat.init({
                webhookUrl: "https://saitejareddy.app.n8n.cloud/webhook/798b5980-d87e-4b1b-90dd-71d239d05faa/chat",
                target: "#n8n-chat",
                mode: "embedded",
                initialMessages: ["Hello! How can I help you today?"]
              });
              setIsLoading(false);
            } else {
              setError("Chat widget failed to initialize");
              setIsLoading(false);
            }
          } catch (err) {
            console.error("Error initializing chat:", err);
            setError("Failed to load chat interface");
            setIsLoading(false);
          }
        }, 500);
      };

      script.onerror = () => {
        setError("Failed to load chat script");
        setIsLoading(false);
      };

      document.body.appendChild(script);
      scriptLoadedRef.current = true;
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="glass border-b border-glass-border px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-gradient rounded-xl shadow-glow">
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI Chat Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Powered by n8n
              </p>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden p-6 min-h-0 flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading chat...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-destructive-foreground">{error}</p>
              </div>
            </div>
          )}
          <div 
            id="n8n-chat" 
            ref={chatContainerRef}
            className="w-full h-full"
            style={{ 
              minHeight: '500px',
              display: isLoading || error ? 'none' : 'block'
            }}
          />
        </div>
      </div>
    </div>
  );
};