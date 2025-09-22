import { Users, Circle } from "lucide-react";
import { User } from "./ChatRoom";

interface UserListProps {
  users: User[];
  currentUser: User | null;
}

export const UserList = ({ users, currentUser }: UserListProps) => {
  const onlineUsers = users.filter(user => user.isOnline);
  const offlineUsers = users.filter(user => !user.isOnline);

  const renderUser = (user: User, isCurrentUser = false) => (
    <div
      key={user.id}
      className={`
        flex items-center gap-3 p-3 rounded-xl transition-smooth
        ${isCurrentUser 
          ? 'bg-primary/10 border border-primary/20' 
          : 'hover:bg-secondary/30'
        }
      `}
    >
      <div className="relative">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-soft
          ${isCurrentUser 
            ? 'bg-accent text-accent-foreground' 
            : user.isOnline 
              ? 'bg-primary-gradient text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }
        `}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        
        <div className={`
          absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card flex items-center justify-center
          ${user.isOnline ? 'bg-accent online-pulse' : 'bg-muted'}
        `}>
          <Circle className={`h-2 w-2 ${user.isOnline ? 'fill-current' : ''}`} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`
            font-medium truncate
            ${isCurrentUser ? 'text-primary' : 'text-foreground'}
          `}>
            {user.username}
          </span>
          {isCurrentUser && (
            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
        <span className={`
          text-xs
          ${user.isOnline ? 'text-accent' : 'text-muted-foreground'}
        `}>
          {user.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-glass-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent rounded-xl shadow-soft">
            <Users className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Users</h2>
            <p className="text-sm text-muted-foreground">
              {onlineUsers.length} online, {offlineUsers.length} offline
            </p>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Current User */}
        {currentUser && (
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              You
            </h3>
            {renderUser(currentUser, true)}
          </div>
        )}

        {/* Online Users */}
        {onlineUsers.filter(user => user.id !== currentUser?.id).length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Circle className="h-2 w-2 fill-accent text-accent" />
              Online ({onlineUsers.filter(user => user.id !== currentUser?.id).length})
            </h3>
            <div className="space-y-2">
              {onlineUsers
                .filter(user => user.id !== currentUser?.id)
                .map(user => renderUser(user))
              }
            </div>
          </div>
        )}

        {/* Offline Users */}
        {offlineUsers.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Circle className="h-2 w-2 text-muted-foreground" />
              Offline ({offlineUsers.length})
            </h3>
            <div className="space-y-2">
              {offlineUsers.map(user => renderUser(user))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No users online</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-glass-border shrink-0">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Real-time chat • Auto-vanish messages
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-xs text-accent font-medium">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};