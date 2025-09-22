import { useState, useEffect, useRef } from "react";
import { MessageInput } from "./MessageInput";
import { ChatMessage } from "./ChatMessage";
import { UserList } from "./UserList";
import { MessageCircle, Users } from "lucide-react";

export interface Message {
  id: string;
  content: string;
  username: string;
  timestamp: Date;
  isOwn: boolean;
  vanishTime?: number; // seconds until vanish
}

export interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

export const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate a random username for demo
  useEffect(() => {
    const adjectives = ["Cool", "Happy", "Swift", "Bright", "Kind", "Smart", "Bold", "Calm"];
    const nouns = ["Tiger", "Eagle", "Wolf", "Fox", "Lion", "Bear", "Hawk", "Owl"];
    const username = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 100)}`;
    
    const user: User = {
      id: Math.random().toString(36).substring(7),
      username,
      isOnline: true,
    };
    
    setCurrentUser(user);
    setUsers([user, 
      { id: "2", username: "SwiftEagle42", isOnline: true },
      { id: "3", username: "BrightWolf88", isOnline: true },
      { id: "4", username: "KindTiger15", isOnline: false },
    ]);

    // Demo messages
    const demoMessages: Message[] = [
      {
        id: "1",
        content: "Welcome to the chat room! 🎉",
        username: "System",
        timestamp: new Date(Date.now() - 300000),
        isOwn: false,
      },
      {
        id: "2", 
        content: "Hey everyone! Great to be here!",
        username: "SwiftEagle42",
        timestamp: new Date(Date.now() - 120000),
        isOwn: false,
      },
      {
        id: "3",
        content: "This chat looks amazing! Love the design 🔥",
        username: "BrightWolf88", 
        timestamp: new Date(Date.now() - 60000),
        isOwn: false,
      },
    ];
    setMessages(demoMessages);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string, vanishTime?: number) => {
    if (!currentUser || !content.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      content: content.trim(),
      username: currentUser.username,
      timestamp: new Date(),
      isOwn: true,
      vanishTime,
    };

    setMessages(prev => [...prev, newMessage]);

    // Handle auto-vanish
    if (vanishTime && vanishTime > 0) {
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      }, vanishTime * 1000);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="glass border-b border-glass-border px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-gradient rounded-xl shadow-glow">
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Live Chat Room</h1>
                <p className="text-sm text-muted-foreground">
                  {users.filter(u => u.isOnline).length} online
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowUserList(!showUserList)}
              className="lg:hidden p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-smooth"
            >
              <Users className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onDelete={handleDeleteMessage}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="shrink-0 px-6 pb-6">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* User List Sidebar */}
      <div className={`
        w-80 border-l border-glass-border glass shrink-0 transition-transform duration-300
        ${showUserList ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        lg:relative absolute right-0 top-0 h-full z-10
      `}>
        <UserList users={users} currentUser={currentUser} />
      </div>

      {/* Overlay for mobile */}
      {showUserList && (
        <div
          className="lg:hidden fixed inset-0 bg-background/50 backdrop-blur-sm z-0"
          onClick={() => setShowUserList(false)}
        />
      )}
    </div>
  );
};