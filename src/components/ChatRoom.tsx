import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

declare global {
  interface Window {
    n8nChat?: {
      init: (config: {
        webhookUrl: string;
        target: string;
        mode: string;
      }) => void;
    };
  }
}

export const ChatRoom = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Load n8n chat script
    if (!scriptLoadedRef.current) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@n8n/chat@latest";
      script.async = true;
      script.onload = () => {
        // Initialize chat once script is loaded
        if (window.n8nChat && chatContainerRef.current) {
          window.n8nChat.init({
            webhookUrl: "https://saitejareddy.app.n8n.cloud/webhook/798b5980-d87e-4b1b-90dd-71d239d05faa/chat",
            target: "#n8n-chat",
            mode: "embedded"
          });
        }
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
        <div className="flex-1 overflow-hidden p-6">
          <div 
            id="n8n-chat" 
            ref={chatContainerRef}
            className="w-full h-full rounded-xl overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};