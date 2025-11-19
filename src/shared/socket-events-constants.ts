export const GROUP_CHAT_SOCKET_EVENTS = {
  CLIENT: {
    JOIN_GROUP_CHAT: "join_group_chat",
    LEAVE_GROUP_CHAT: "leave_group_chat",

    SEND_GROUP_MESSAGE: "send_group_message",
    GET_GROUP_MESSAGES: "get_group_messages",

    GROUP_CHAT_START_TYPING: "group_chat_start_typing",
    GROUP_CHAT_STOP_TYPING: "group_chat_stop_typing",

    GET_GROUP_ONLINE_MEMBERS: "get_group_online_members",
  },

  SERVER: {
    GROUP_CHAT_JOINED: "group_chat_joined",
    GROUP_CHAT_ERROR: "group_chat_error",

    NEW_GROUP_MESSAGE: "new_group_message",

    GROUP_CHAT_USER_TYPING: "group_chat_user_typing",
    GROUP_CHAT_USER_STOPPED_TYPING: "group_chat_user_stopped_typing",

    USER_JOINED_GROUP: "user_joined_group",
    USER_LEFT_GROUP: "user_left_group",
  },

  // System events
  SYSTEM: {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    ERROR: "error",
  },
} as const;

export const CHAT_SOCKET_EVENTS = {
  CLIENT: {
    CHECK_ONLINE_STATUS: "check_online_status",
    GET_ONLINE_USERS: "get_online_users",
    START_CHAT: "start_chat",
    SEND_MESSAGE: "send_message",
    MARK_MESSAGES_DELIVERED: "mark_messages_delivered",
    MARK_MESSAGES_READ: "mark_messages_read",
    START_TYPING: "start_typing",
    STOP_TYPING: "stop_typing",
    GUIDE_SERVICE_START_CHAT: "guide_service_start_chat",
    GUIDE_SERVICE_JOIN_ROOM: "guide_service_join_room",
    GUIDE_SERVICE_SEND_MESSAGE: "guide_service_send_message",
    GUIDE_SERVICE_MARK_DELIVERED: "guide_service_mark_delivered",
    GUIDE_SERVICE_MARK_READ: "guide_service_mark_read",
    GUIDE_SERVICE_CREATE_QUOTE: "guide_service_create_quote",
    GUIDE_SERVICE_ACCEPT_QUOTE: "guide_service_accept_quote",
    GUIDE_SERVICE_DECLINE_QUOTE: "guide_service_decline_quote",
  },

  SERVER: {
    USER_ONLINE: "user_online",
    USER_OFFLINE: "user_offline",
    CHAT_JOINED: "chat_joined",
    NEW_MESSAGE: "new_message",
    MESSAGES_DELIVERED: "messages_delivered",
    MESSAGES_READ: "messages_read",
    USER_TYPING: "user_typing",
    USER_STOPPED_TYPING: "user_stopped_typing",
    ERROR: "error",
    GUIDE_SERVICE_CHAT_READY: "guide_service_chat_ready",
    GUIDE_SERVICE_NEW_MESSAGE: "guide_service_new_message",
    GUIDE_SERVICE_MESSAGES_DELIVERED: "guide_service_messages_delivered",
    GUIDE_SERVICE_MESSAGES_READ: "guide_service_messages_read",
    GUIDE_SERVICE_QUOTE_CREATED: "guide_service_quote_created",
    GUIDE_SERVICE_QUOTE_ACCEPTED: "guide_service_quote_accepted",
    GUIDE_SERVICE_QUOTE_DECLINED: "guide_service_quote_declined",
  },

  SYSTEM: {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
  },
} as const;

export const NOTIFICATION_SOCKET_EVENTS = {
  SERVER: {
    NEW_NOTIFICATION: "new_notification",
  },
} as const;
