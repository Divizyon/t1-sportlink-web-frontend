/**
 * User Messages Mock Data
 *
 * This file provides mock data for user messaging functionality.
 *
 * Component Reference:
 * - MOCK_MESSAGES: Used in src/hooks/useMessages.ts for message management
 * - MOCK_CONVERSATIONS: Used in src/hooks/useMessages.ts for conversation threads
 * - getMessagesForConversation: Used in src/hooks/useMessages.ts for conversation filtering
 * - getUnreadMessageCount: Used in src/hooks/useMessages.ts and src/components/layout/UserMessages.tsx
 */

import { USER_SCHEMA } from "../../schemas/userSchema";

// Message interface
export interface MessageMock {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

// Conversation interface
export interface ConversationMock {
  id: string;
  participantIds: string[];
  lastMessageId: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

// Generate a set of mock messages between users
export const MOCK_MESSAGES: MessageMock[] = [
  {
    id: "msg-001",
    senderId: "usr-001", // Ali
    recipientId: "usr-002", // Ayşe
    content: "Merhaba, son etkinlik hakkında bilgi almak istiyorum.",
    timestamp: "2023-09-15T09:30:00Z",
    read: true,
  },
  {
    id: "msg-002",
    senderId: "usr-002", // Ayşe
    recipientId: "usr-001", // Ali
    content: "Tabii, hangi etkinlik hakkında bilgi almak istiyorsunuz?",
    timestamp: "2023-09-15T09:35:00Z",
    read: true,
  },
  {
    id: "msg-003",
    senderId: "usr-001", // Ali
    recipientId: "usr-002", // Ayşe
    content: "15 Ekim'deki basketbol turnuvası hakkında.",
    timestamp: "2023-09-15T09:40:00Z",
    read: true,
  },
  {
    id: "msg-004",
    senderId: "usr-002", // Ayşe
    recipientId: "usr-001", // Ali
    content:
      "Turnuva saat 14:00'de başlayacak. Katılımcı listesi yakında yayınlanacak.",
    timestamp: "2023-09-15T09:45:00Z",
    read: false,
  },
  {
    id: "msg-005",
    senderId: "usr-001", // Ali
    recipientId: "usr-003", // Another user
    content:
      "Merhaba, sisteme yeni bir duyuru ekledim, kontrol edebilir misiniz?",
    timestamp: "2023-09-16T10:15:00Z",
    read: false,
  },
];

// Generate a set of mock conversations
export const MOCK_CONVERSATIONS: ConversationMock[] = [
  {
    id: "conv-001",
    participantIds: ["usr-001", "usr-002"],
    lastMessageId: "msg-004",
    lastMessageTimestamp: "2023-09-15T09:45:00Z",
    unreadCount: 1,
  },
  {
    id: "conv-002",
    participantIds: ["usr-001", "usr-003"],
    lastMessageId: "msg-005",
    lastMessageTimestamp: "2023-09-16T10:15:00Z",
    unreadCount: 1,
  },
];

// Get users for a conversation
export const getUsersForConversation = (conversationId: string) => {
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  if (!conversation) return [];

  return conversation.participantIds
    .map((userId) => USER_SCHEMA.users.find((user) => user.id === userId))
    .filter(Boolean);
};

// Get conversation partner details
export const getConversationPartner = (
  conversationId: string,
  currentUserId: string
) => {
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  if (!conversation) return null;

  const partnerId = conversation.participantIds.find(
    (id) => id !== currentUserId
  );
  if (!partnerId) return null;

  return USER_SCHEMA.users.find((user) => user.id === partnerId);
};

// Get messages for a conversation
export const getMessagesForConversation = (conversationId: string) => {
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  if (!conversation) return [];

  return MOCK_MESSAGES.filter(
    (message) =>
      conversation.participantIds.includes(message.senderId) &&
      conversation.participantIds.includes(message.recipientId)
  ).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

// Get total unread message count for a user
export const getUnreadMessageCount = (userId: string) => {
  return MOCK_MESSAGES.filter((msg) => msg.recipientId === userId && !msg.read)
    .length;
};
