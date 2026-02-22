import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useRequireAuth } from '../hooks/useAuth';
import { chatApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { Chat } from '../types';
import { formatRelativeTime, formatPrice, cn } from '../lib/utils';
import ChatWindow from '../components/chat/ChatWindow';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const { isLoading: authLoading } = useRequireAuth();
  const { user } = useAuthStore();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const chatId = searchParams.get('chat');
    if (chatId && chats.length > 0) {
      const chat = chats.find((c) => c._id === chatId);
      if (chat) {
        setSelectedChat(chat);
      }
    }
  }, [searchParams, chats]);

  const fetchChats = async () => {
    try {
      const response = await chatApi.getChats();
      setChats(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChat = async (chat: Chat) => {
    try {
      const response = await chatApi.getChat(chat._id);
      setSelectedChat(response.data.data || null);
    } catch (error) {
      console.error('Failed to fetch chat:', error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-zed-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-zed-text mb-6">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <div className={cn(
          'bg-white rounded-xl overflow-hidden',
          selectedChat ? 'hidden lg:block' : 'block'
        )}>
          <div className="p-4 border-b border-zed-border">
            <h2 className="font-semibold">Conversations</h2>
          </div>

          {chats.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-zed-text-muted mx-auto mb-4" />
              <p className="text-zed-text-muted">No messages yet</p>
              <p className="text-sm text-zed-text-muted mt-1">
                Start a conversation by contacting a seller
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto h-full">
              {chats.map((chat) => {
                const otherUser = chat.participants.find((p) => p.id !== user?.id);
                const hasUnread = chat.messages.some(
                  (m) => m.sender !== user?.id && !m.isRead
                );

                return (
                  <button
                    key={chat._id}
                    onClick={() => handleSelectChat(chat)}
                    className={cn(
                      'w-full p-4 flex gap-3 hover:bg-gray-50 transition-colors border-b border-zed-border text-left',
                      selectedChat?._id === chat._id && 'bg-zed-orange/5'
                    )}
                  >
                    {/* Avatar */}
                    {otherUser?.avatar ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-zed-orange flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium">
                          {otherUser?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-zed-text truncate">
                          {otherUser?.name}
                        </span>
                        <span className="text-xs text-zed-text-muted">
                          {chat.lastMessageAt && formatRelativeTime(chat.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-sm text-zed-text-muted truncate">
                        {chat.listing.title}
                      </p>
                      <p className={cn(
                        'text-sm truncate',
                        hasUnread ? 'font-medium text-zed-text' : 'text-zed-text-muted'
                      )}>
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {hasUnread && (
                      <div className="w-3 h-3 bg-zed-orange rounded-full flex-shrink-0 self-center" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className={cn(
          'lg:col-span-2',
          !selectedChat && 'hidden lg:block'
        )}>
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              onBack={() => setSelectedChat(null)}
            />
          ) : (
            <div className="bg-white rounded-xl h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-zed-text-muted mx-auto mb-4" />
                <p className="text-zed-text-muted">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
