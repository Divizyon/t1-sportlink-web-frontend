import { useState, useEffect, useMemo } from "react";
import { User } from "@/types";
import { USERS } from "@/mocks/users";
import { useToast } from "@/components/ui/use-toast";

// Define types for messaging
interface Message {
  id: string | number;
  senderId: string | number;
  recipientId: string | number;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

interface Conversation {
  id: string | number;
  participantIds: (string | number)[];
  lastMessageId: string | number;
  lastMessageTimestamp: string;
  unreadCount: number;
}

// Mock data
const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    senderId: 1, // Admin
    recipientId: 2, // User
    content: "Merhaba, son etkinlik hakkında bilgi almak istiyorum.",
    timestamp: "2023-09-15T09:30:00",
    read: true,
  },
  {
    id: 2,
    senderId: 2, // User
    recipientId: 1, // Admin
    content: "Tabii, hangi etkinlik hakkında bilgi almak istiyorsunuz?",
    timestamp: "2023-09-15T09:35:00",
    read: true,
  },
  {
    id: 3,
    senderId: 1, // Admin
    recipientId: 2, // User
    content: "15 Ekim'deki basketbol turnuvası hakkında.",
    timestamp: "2023-09-15T09:40:00",
    read: true,
  },
  {
    id: 4,
    senderId: 2, // User
    recipientId: 1, // Admin
    content:
      "Turnuva saat 14:00'de başlayacak. Katılımcı listesi yakında yayınlanacak.",
    timestamp: "2023-09-15T09:45:00",
    read: false,
  },
  {
    id: 5,
    senderId: 1, // Admin
    recipientId: 3, // Another user
    content:
      "Merhaba, sisteme yeni bir duyuru ekledim, kontrol edebilir misiniz?",
    timestamp: "2023-09-16T10:15:00",
    read: false,
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    participantIds: [1, 2],
    lastMessageId: 4,
    lastMessageTimestamp: "2023-09-15T09:45:00",
    unreadCount: 1,
  },
  {
    id: 2,
    participantIds: [1, 3],
    lastMessageId: 5,
    lastMessageTimestamp: "2023-09-16T10:15:00",
    unreadCount: 1,
  },
];

export function useMessages(currentUserId: string | number) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeConversation, setActiveConversation] = useState<
    number | string | null
  >(null);

  // Fetch messages, conversations and users
  useEffect(() => {
    const fetchMessagingData = async () => {
      setLoading(true);
      try {
        // In a real application, these would be API calls
        // const messagesResponse = await fetch(`/api/messages?userId=${currentUserId}`);
        // const messagesData = await messagesResponse.json();
        // setMessages(messagesData);

        // const conversationsResponse = await fetch(`/api/conversations?userId=${currentUserId}`);
        // const conversationsData = await conversationsResponse.json();
        // setConversations(conversationsData);

        // Using mock data for now
        setMessages(MOCK_MESSAGES);
        setConversations(MOCK_CONVERSATIONS);
        setUsers(USERS);

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch messages")
        );
        setLoading(false);
      }
    };

    fetchMessagingData();
  }, [currentUserId]);

  // Get messages for active conversation
  const activeConversationMessages = useMemo(() => {
    if (!activeConversation) return [];

    const conversation = conversations.find(
      (conv) => conv.id === activeConversation
    );
    if (!conversation) return [];

    return messages
      .filter(
        (message) =>
          conversation.participantIds.includes(message.senderId) &&
          conversation.participantIds.includes(message.recipientId)
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }, [activeConversation, conversations, messages]);

  // Get conversation partner details
  const getConversationPartner = (
    conversationId: string | number
  ): User | undefined => {
    const conversation = conversations.find(
      (conv) => conv.id === conversationId
    );
    if (!conversation) return undefined;

    const partnerId = conversation.participantIds.find(
      (id) => id !== currentUserId
    );
    return users.find((user) => user.id === partnerId);
  };

  // Get all user conversations with preview details
  const conversationsWithPreview = useMemo(() => {
    return conversations
      .map((conversation) => {
        const partner = getConversationPartner(conversation.id);
        const lastMessage = messages.find(
          (msg) => msg.id === conversation.lastMessageId
        );

        return {
          ...conversation,
          partner,
          preview: lastMessage
            ? lastMessage.content.substring(0, 50) +
              (lastMessage.content.length > 50 ? "..." : "")
            : "",
          lastMessageTime: lastMessage ? new Date(lastMessage.timestamp) : null,
        };
      })
      .sort((a, b) => {
        if (!a.lastMessageTime || !b.lastMessageTime) return 0;
        return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
      });
  }, [conversations, messages, users]);

  // Get unread messages count
  const unreadCount = useMemo(() => {
    return messages.filter(
      (msg) => msg.recipientId === currentUserId && !msg.read
    ).length;
  }, [messages, currentUserId]);

  // Send a new message
  const sendMessage = async (
    recipientId: string | number,
    content: string,
    attachments?: string[]
  ) => {
    if (!content.trim()) {
      toast({
        title: "Mesaj Boş",
        description: "Boş mesaj gönderilemiyor.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare the new message
      const newMessage: Omit<Message, "id"> = {
        senderId: currentUserId,
        recipientId,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        attachments,
      };

      // In a real application, this would be an API call
      // const response = await fetch('/api/messages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newMessage)
      // });
      // const sentMessage = await response.json();

      // Simulating API response
      const sentMessage: Message = {
        ...newMessage,
        id: Date.now(), // Generate a temporary ID
      };

      // Update messages state
      setMessages((prevMessages) => [...prevMessages, sentMessage]);

      // Find or create conversation
      const existingConversation = conversations.find(
        (conv) =>
          conv.participantIds.includes(currentUserId) &&
          conv.participantIds.includes(recipientId)
      );

      if (existingConversation) {
        // Update existing conversation
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === existingConversation.id
              ? {
                  ...conv,
                  lastMessageId: sentMessage.id,
                  lastMessageTimestamp: sentMessage.timestamp,
                  unreadCount: conv.unreadCount, // No change for sender
                }
              : conv
          )
        );
      } else {
        // Create new conversation
        const newConversation: Conversation = {
          id: Date.now(),
          participantIds: [currentUserId, recipientId],
          lastMessageId: sentMessage.id,
          lastMessageTimestamp: sentMessage.timestamp,
          unreadCount: 0, // No unread for sender
        };

        setConversations((prevConversations) => [
          ...prevConversations,
          newConversation,
        ]);

        // Set as active conversation
        setActiveConversation(newConversation.id);
      }

      setLoading(false);
      return sentMessage;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to send message")
      );
      setLoading(false);

      toast({
        title: "Mesaj Gönderilemedi",
        description: "Bir hata oluştu.",
        variant: "destructive",
      });

      throw err;
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (messageIds: (string | number)[]) => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      // await fetch('/api/messages/read', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ messageIds })
      // });

      // Update messages state
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, read: true } : msg
        )
      );

      // Update conversation unread counts
      setConversations((prevConversations) => {
        return prevConversations.map((conv) => {
          const conversationMessageIds = messages
            .filter(
              (msg) =>
                conv.participantIds.includes(msg.senderId) &&
                conv.participantIds.includes(msg.recipientId)
            )
            .map((msg) => msg.id);

          const markedIds = messageIds.filter((id) =>
            conversationMessageIds.includes(id)
          );

          if (markedIds.length > 0) {
            return {
              ...conv,
              unreadCount: Math.max(0, conv.unreadCount - markedIds.length),
            };
          }

          return conv;
        });
      });

      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to mark messages as read")
      );
      setLoading(false);
      throw err;
    }
  };

  // Mark conversation as read
  const markConversationAsRead = async (conversationId: string | number) => {
    const conversation = conversations.find(
      (conv) => conv.id === conversationId
    );
    if (!conversation) return;

    const unreadMessageIds = messages
      .filter(
        (msg) =>
          conversation.participantIds.includes(msg.senderId) &&
          conversation.participantIds.includes(msg.recipientId) &&
          msg.recipientId === currentUserId &&
          !msg.read
      )
      .map((msg) => msg.id);

    if (unreadMessageIds.length > 0) {
      await markMessagesAsRead(unreadMessageIds);
    }
  };

  // Set active conversation and mark as read
  const selectConversation = async (conversationId: string | number) => {
    setActiveConversation(conversationId);
    await markConversationAsRead(conversationId);
  };

  return {
    messages,
    conversations: conversationsWithPreview,
    activeConversation,
    activeConversationMessages,
    unreadCount,
    loading,
    error,
    sendMessage,
    markMessagesAsRead,
    markConversationAsRead,
    selectConversation,
    getConversationPartner,
  };
}
