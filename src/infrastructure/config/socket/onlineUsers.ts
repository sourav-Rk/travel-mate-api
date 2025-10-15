interface OnlineUser {
  userId: string;
  sockets: Set<string>;
}

const onlineUsers: Map<string, OnlineUser> = new Map();

//Add a socket for a user
export function userConnected(userId: string, socketId: string): boolean {
  let isFirstConnection = false;

  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, { userId, sockets: new Set() });
    isFirstConnection = true; // first time this user connected
  }

  onlineUsers.get(userId)!.sockets.add(socketId);
  return isFirstConnection;
}


// Remove a socket for a user
export function userDisconnected(userId: string, socketId: string): boolean {
  const user = onlineUsers.get(userId);
  if (!user) return false;

  user.sockets.delete(socketId);

  if (user.sockets.size === 0) {
    onlineUsers.delete(userId);
    return true; // last socket disconnected
  }

  return false;
}

// Check if a user is online
export function isUserOnline(userId: string) {
  return onlineUsers.has(userId);
}

//Get all online users (optional)
export function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}
