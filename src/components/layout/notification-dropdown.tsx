'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';
import { useSocket } from '@/hooks/use-socket';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function NotificationDropdown() {
  // Initialize socket listener
  useSocket();
  
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications?limit=10');
      return res.data.data;
    },
    refetchInterval: 60000, // Fallback polling every minute
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className="relative inline-flex items-center justify-center rounded-full p-2 hover:bg-white/10 transition-colors"
      >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4 bg-card/95 backdrop-blur-xl border-white/10" align="end">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h4 className="font-semibold flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                {unreadCount} new
              </span>
            )}
          </h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-white"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[350px]">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {notifications.map((notif: any) => (
                <div 
                  key={notif.id} 
                  className={`p-4 flex gap-4 transition-colors hover:bg-white/5 ${!notif.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => {
                    if (!notif.isRead) markAsReadMutation.mutate(notif.id);
                  }}
                >
                  <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!notif.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm font-medium leading-none ${!notif.isRead ? 'text-white' : 'text-gray-300'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 pt-1">
                      {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
