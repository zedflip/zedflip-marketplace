import type { Message } from '../../types';
import { formatRelativeTime, cn } from '../../lib/utils';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTime?: boolean;
}

const MessageBubble = ({ message, isOwn, showTime = true }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        'flex mb-3',
        isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2',
          isOwn
            ? 'bg-zed-orange text-white rounded-br-md'
            : 'bg-gray-100 text-zed-text rounded-bl-md'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        
        {showTime && (
          <div
            className={cn(
              'flex items-center gap-1 mt-1 text-xs',
              isOwn ? 'text-white/70 justify-end' : 'text-zed-text-muted'
            )}
          >
            <span>{formatRelativeTime(message.createdAt)}</span>
            {isOwn && (
              message.isRead ? (
                <CheckCheck className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
