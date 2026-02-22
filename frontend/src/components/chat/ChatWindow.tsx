import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, Phone, Image as ImageIcon } from 'lucide-react';
import type { Chat, Message } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useSocket } from '../../hooks/useSocket';
import { chatApi } from '../../lib/api';
import { formatPrice, cn } from '../../lib/utils';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  chat: Chat;
  onBack?: () => void;
}

const ChatWindow = ({ chat, onBack }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuthStore();
  const { joinChat, leaveChat, sendMessage: socketSendMessage, onNewMessage, onUserTyping, setTyping } = useSocket();

  // Get the other participant
  const otherUser = chat.participants.find((p) => p.id !== user?.id);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join chat room on mount
  useEffect(() => {
    joinChat(chat._id);

    const unsubMessage = onNewMessage((data) => {
      if (data.chatId === chat._id) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    const unsubTyping = onUserTyping((data) => {
      if (data.userId !== user?.id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      leaveChat(chat._id);
      unsubMessage();
      unsubTyping();
    };
  }, [chat._id]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const response = await chatApi.sendMessage(chat._id, messageContent);
      
      // Add message to local state
      setMessages((prev) => [...prev, response.data.data]);
      
      // Also emit via socket for real-time
      socketSendMessage(chat._id, messageContent);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message on error
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setTyping(chat._id, e.target.value.length > 0);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-zed-border">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <Link to={`/user/${otherUser?.id}`} className="flex items-center gap-3 flex-1">
          {otherUser?.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zed-orange flex items-center justify-center">
              <span className="text-white font-medium">
                {otherUser?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium text-zed-text">{otherUser?.name}</h3>
            {isTyping && (
              <span className="text-sm text-zed-green">typing...</span>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${otherUser?.phone}`}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Phone className="w-5 h-5 text-zed-text-muted" />
          </a>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-5 h-5 text-zed-text-muted" />
          </button>
        </div>
      </div>

      {/* Listing Preview */}
      <Link
        to={`/listing/${chat.listing._id}`}
        className="flex items-center gap-3 p-3 bg-gray-50 border-b border-zed-border hover:bg-gray-100 transition-colors"
      >
        <img
          src={chat.listing.images[0]}
          alt={chat.listing.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-zed-text truncate">
            {chat.listing.title}
          </h4>
          <span className="text-zed-orange font-semibold">
            {formatPrice(chat.listing.price)}
          </span>
        </div>
        {chat.listing.status === 'sold' && (
          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
            Sold
          </span>
        )}
      </Link>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 ? (
          <div className="text-center text-zed-text-muted py-8">
            <p>No messages yet.</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message._id || index}
              message={message}
              isOwn={message.sender === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zed-border">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ImageIcon className="w-5 h-5 text-zed-text-muted" />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-zed-border rounded-full focus:outline-none focus:ring-2 focus:ring-zed-orange focus:border-transparent"
          />
          
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            className={cn(
              'p-2 rounded-full transition-colors',
              newMessage.trim()
                ? 'bg-zed-orange text-white hover:bg-zed-orange-dark'
                : 'bg-gray-100 text-zed-text-muted'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
