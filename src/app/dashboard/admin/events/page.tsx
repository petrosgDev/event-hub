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

      {/* Events Grid (Rounded Edge Rectangle Glass Cards) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 w-full rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="py-16 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-base">No events found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event: any) => {
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
            const fillPercent = event.capacity ? Math.min(100, Math.round(((event.registeredCount || 0) / event.capacity) * 100)) : 0;

            return (
              <Card 
                key={event.id} 
                className="group flex flex-col justify-between overflow-hidden rounded-3xl p-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40"
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-muted rounded-t-3xl">
                    <img 
                      src={imgSrc} 
                      alt={event.title} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Floating Glass Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                        {event.category?.name || 'Event'}
                      </Badge>
                      <Badge className={`text-xs backdrop-blur-md border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </Badge>
                    </div>

                    <div className="absolute top-3 right-3">
                      <Badge className={event.isFree ? 'bg-emerald-500/80 backdrop-blur-md text-white border-none' : 'bg-orange-500/80 backdrop-blur-md text-white border-none'}>
                        {event.isFree ? 'Free' : `${event.price} ETB`}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {event.date ? format(new Date(event.date), 'MMM d, yyyy') : 'No date'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {event.location || 'DBU Campus'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {event.description || 'University event at Debre Birhan University.'}
                    </p>

                    {/* Capacity Progress */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{event.registeredCount || 0} / {event.capacity || '∞'} registered</span>
                        </span>
                        <span className="font-semibold text-primary">{fillPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-500" 
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Glass Footer */}
                <div className="p-4 pt-0 mt-2 flex items-center justify-between border-t border-white/10 dark:border-white/5 pt-3">
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {event.id.slice(0, 8)}...
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/events/${event.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl h-8 px-3 text-xs gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-xl text-destructive hover:bg-destructive/15 hover:text-destructive"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this event?')) {
                          deleteMutation.mutate(event.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
