import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000', {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket');
      // Join user-specific room
      socketInstance.emit('join-user', user.id);
    });

    // Listen for incoming notifications
    socketInstance.on('notification', (data) => {
      // Show toast
      toast(data.title, {
        description: data.message,
        duration: 5000,
      });

      // Invalidate notifications query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isAuthenticated, user, queryClient]);

  return socket;
}
