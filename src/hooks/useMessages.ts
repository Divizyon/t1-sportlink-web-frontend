import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  MOCK_MESSAGES,
  MOCK_CONVERSATIONS,
  MessageMock,
  ConversationMock,
  getUsersForConversation,
  getConversationPartner,
  getMessagesForConversation,
  getUnreadMessageCount,
} from "@/mockups";
import { USER_SCHEMA } from "@/mockups/schemas/userSchema";

// Type for the return value of a user from mockups
type MockupUser = (typeof USER_SCHEMA.users)[0];

export function useMessages(currentUserId: string) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<MessageMock[]>([]);
  const [conversations, setConversations] = useState<ConversationMock[]>([]);
  const [users, setUsers] = useState<MockupUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );

  // Fetch messages, conversations and users
  useEffect(() => {
    const fetchMessagingData = async () => {
      setLoading(true);
      try {
        // In a real application, these would be API calls
        // Using mock data from mockups structure
        setMessages(MOCK_MESSAGES);
        setConversations(MOCK_CONVERSATIONS);

        // Get users who are part of conversations with the current user
        const relevantUserIds = MOCK_CONVERSATIONS.filter((conv) =>
          conv.participantIds.includes(currentUserId)
        ).flatMap((conv) => conv.participantIds);

        // Get unique user IDs
        const uniqueUserIds = Array.from(new Set(relevantUserIds));

        // Find all users by ID
        const relevantUsers = uniqueUserIds
          .map((id) => USER_SCHEMA.users.find((user) => user.id === id))
          .filter((user): user is MockupUser => user !== undefined);

        setUsers(relevantUsers);
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
    return getMessagesForConversation(activeConversation);
  }, [activeConversation]);

  // Get conversation partner details
  const getPartnerDetails = (
    conversationId: string
  ): MockupUser | undefined => {
    const conversation = conversations.find(
      (conv) => conv.id === conversationId
    );
    if (!conversation) return undefined;

    const partnerId = conversation.participantIds.find(
      (id) => id !== currentUserId
    );
    if (!partnerId) return undefined;

    return users.find((user) => user.id === partnerId);
  };

  // Get all user conversations with preview details
  const conversationsWithPreview = useMemo(() => {
    return conversations
      .filter((conv) => conv.participantIds.includes(currentUserId))
      .map((conversation) => {
        const partner = getPartnerDetails(conversation.id);
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
  }, [conversations, messages, users, currentUserId]);

  // Get unread messages count
  const unreadCount = useMemo(() => {
    return messages.filter(
      (msg) => msg.recipientId === currentUserId && !msg.read
    ).length;
  }, [messages, currentUserId]);

  // Send a new message
  const sendMessage = async (
    recipientId: string,
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
      // Create new message
      const newMessage: MessageMock = {
        id: `msg-${Date.now()}`,
        senderId: currentUserId,
        recipientId,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        attachments,
      };

      // Update messages state
      setMessages((prev) => [...prev, newMessage]);

      // Find or create conversation
      const existingConversation = conversations.find(
        (conv) =>
          conv.participantIds.includes(currentUserId) &&
          conv.participantIds.includes(recipientId)
      );

      if (existingConversation) {
        // Update existing conversation
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === existingConversation.id
              ? {
                  ...conv,
                  lastMessageId: newMessage.id,
                  lastMessageTimestamp: newMessage.timestamp,
                  unreadCount: 0, // Reset unread count for the sender
                }
              : conv
          )
        );
      } else {
        // Create new conversation
        const newConversation: ConversationMock = {
          id: `conv-${Date.now()}`,
          participantIds: [currentUserId, recipientId],
          lastMessageId: newMessage.id,
          lastMessageTimestamp: newMessage.timestamp,
          unreadCount: 0,
        };

        setConversations((prev) => [...prev, newConversation]);
      }

      setLoading(false);
      toast({
        title: "Mesaj Gönderildi",
        description: "Mesajınız başarıyla gönderildi.",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to send message")
      );
      setLoading(false);
      toast({
        title: "Hata",
        description: "Mesaj gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (messageIds: string[]) => {
    setLoading(true);
    try {
      // Update messages state
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, read: true } : msg
        )
      );

      // Update conversations unread count
      setConversations((prev) =>
        prev.map((conv) => {
          // Get all messages for this conversation
          const conversationMessages = messages.filter(
            (msg) =>
              conv.participantIds.includes(msg.senderId) &&
              conv.participantIds.includes(msg.recipientId)
          );

          // Count unread messages
          const unreadCount = conversationMessages.filter(
            (msg) => !msg.read && msg.recipientId === currentUserId
          ).length;

          return {
            ...conv,
            unreadCount,
          };
        })
      );

      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to mark messages as read")
      );
      setLoading(false);
    }
  };

  // Mark all messages in a conversation as read
  const markConversationAsRead = async (conversationId: string) => {
    const conversation = conversations.find(
      (conv) => conv.id === conversationId
    );
    if (!conversation) return;

    const conversationMessages = messages.filter(
      (msg) =>
        conversation.participantIds.includes(msg.senderId) &&
        conversation.participantIds.includes(msg.recipientId) &&
        msg.recipientId === currentUserId &&
        !msg.read
    );

    if (conversationMessages.length > 0) {
      await markMessagesAsRead(conversationMessages.map((msg) => msg.id));
    }
  };

  // Set active conversation
  const selectConversation = async (conversationId: string) => {
    setActiveConversation(conversationId);
    await markConversationAsRead(conversationId);
  };

  return {
    messages,
    conversations,
    conversationsWithPreview,
    activeConversation,
    activeConversationMessages,
    unreadCount,
    loading,
    error,
    sendMessage,
    markMessagesAsRead,
    markConversationAsRead,
    selectConversation,
    getConversationPartner: getPartnerDetails,
  };
}
