'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Search, Calendar, MapPin, Users, Eye, Trash2, CheckCircle, XCircle,
  Filter, MoreHorizontal, ExternalLink, Loader2
} from 'lucide-react';

export default function AdminEventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['admin-all-events'],
    queryFn: async () => {
      const res = await api.get('/events?limit=100');
      return res.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await api.delete(`/events/${eventId}`);
    },
    onSuccess: () => {
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-all-events'] });
    },
    onError: () => {
      toast.error('Failed to delete event');
    },
  });

  const events = eventsData?.events || eventsData || [];
  const filteredEvents = events.filter((e: any) =>
    e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'DRAFT': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'COMPLETED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Events</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and monitor all platform events</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1 border-primary/30 text-primary">
          {filteredEvents.length} Total
        </Badge>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search events by name or location..."
          className="pl-10 bg-card border-border"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Events Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No events found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((event: any) => (
            <Card key={event.id} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Event Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {(() => {
                        const fallbackImages: Record<string, string> = {
                          'workshop': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
                          'seminar': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
                          'competition': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop',
                          'science-week': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
                          'cultural': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop',
                          'sports': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
                          'training': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
                          'networking': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
                          'hackathon': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
                          'career-fair': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
                        };
                        const imgSrc = event.bannerImage || fallbackImages[event.category?.slug] || `https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=400&fit=crop`;
                        return (
                          <img src={imgSrc} alt={event.title} className="w-full h-full object-cover" />
                        );
                      })()}
                    </div>
                    {/* Event Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-foreground truncate">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date ? format(new Date(event.date), 'MMM d, yyyy') : 'No date'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location || 'Online'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.registeredCount || 0}/{event.capacity || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Status & Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                      {event.status}
                    </Badge>
                    <Badge variant={event.isFree ? 'secondary' : 'default'} className="text-xs">
                      {event.isFree ? 'Free' : `${event.price} ETB`}
                    </Badge>
                    <Link href={`/events/${event.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this event?')) {
                          deleteMutation.mutate(event.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
