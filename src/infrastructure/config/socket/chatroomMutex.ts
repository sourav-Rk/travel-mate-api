interface ChatroomLock {
  key: string;
  timestamp: number;
  timeout: number;
}

const chatroomLocks = new Map<string, ChatroomLock>();
const LOCK_TIMEOUT = 5000; // 5 seconds timeout

// Generate a unique key for chatroom participants and context
function generateLockKey(
  participants: { userId: string; userType: string }[],
  contextType: string,
  contextId: string
): string {
  // Sort participants by userId to ensure consistent key generation
  const sortedParticipants = participants
    .map(p => ({ userId: p.userId, userType: p.userType }))
    .sort((a, b) => a.userId.localeCompare(b.userId));
  
  return `${contextType}:${contextId}:${sortedParticipants.map(p => `${p.userId}:${p.userType}`).join(',')}`;
}

// Acquire a lock for chatroom creation
// Returns true if lock was acquired, false if already locked
export function acquireChatroomLock(
  participants: { userId: string; userType: string }[],
  contextType: string,
  contextId: string
): boolean {
  const key = generateLockKey(participants, contextType, contextId);
  const now = Date.now();
  
  // Clean up expired locks
  for (const [lockKey, lock] of chatroomLocks.entries()) {
    if (now - lock.timestamp > lock.timeout) {
      chatroomLocks.delete(lockKey);
    }
  }
  
  // Check if lock already exists
  if (chatroomLocks.has(key)) {
    return false;
  }
  
  // Acquire lock
  chatroomLocks.set(key, {
    key,
    timestamp: now,
    timeout: LOCK_TIMEOUT
  });
  return true;
}

// Release a lock for chatroom creation
export function releaseChatroomLock(
  participants: { userId: string; userType: string }[],
  contextType: string,
  contextId: string
): void {
  const key = generateLockKey(participants, contextType, contextId);
  chatroomLocks.delete(key);
}

//Check if a lock exists for the given parameters
export function isChatroomLocked(
  participants: { userId: string; userType: string }[],
  contextType: string,
  contextId: string
): boolean {
  const key = generateLockKey(participants, contextType, contextId);
  return chatroomLocks.has(key);
}

