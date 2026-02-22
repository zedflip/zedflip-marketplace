import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAuthenticated, token]);

  const joinChat = useCallback((chatId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-chat', chatId);
    }
  }, []);

  const leaveChat = useCallback((chatId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-chat', chatId);
    }
  }, []);

  const sendMessage = useCallback((chatId: string, message: string) => {
    if (socketRef.current) {
      socketRef.current.emit('send-message', { chatId, message });
    }
  }, []);

  const setTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { chatId, isTyping });
    }
  }, []);

  const onNewMessage = useCallback((callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('new-message', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('new-message', callback);
      }
    };
  }, []);

  const onUserTyping = useCallback((callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('user-typing', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('user-typing', callback);
      }
    };
  }, []);

  const onNotification = useCallback((callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('new-notification', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('new-notification', callback);
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    joinChat,
    leaveChat,
    sendMessage,
    setTyping,
    onNewMessage,
    onUserTyping,
    onNotification,
  };
};

export default useSocket;
