'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, PlusCircle, MoreVertical, Edit2, Trash2, Eye, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function ManageEventsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['my-events'],
    queryFn: async () => {
      const res = await api.get('/events/my/events');
      return res.data;
    },
  });

  const events = response?.data || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
          <p className="text-muted-foreground mt-1">View, edit, and manage your campus events.</p>
        </div>
        <Link href="/dashboard/organizer/events/create">
          <Button className="bg-primary text-primary-foreground flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-white/5 border-white/10 h-64" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="border-white/10 bg-black/20 text-center py-16">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">No events found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You haven't created any events yet. Click the button below to start hosting.
            </p>
            <Link href="/dashboard/organizer/events/create">
              <Button className="mt-4 bg-primary text-primary-foreground">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event: any) => (
            <Card key={event.id} className="bg-black/40 backdrop-blur-xl border-white/10 overflow-hidden hover:border-primary/50 transition-colors">
              <div className="flex flex-col sm:flex-row h-full">
                {/* Image Section */}
                <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative bg-muted">
                  <img 
                    src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070'} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold text-white border border-white/10">
                    {event.status}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg leading-tight line-clamp-1">{event.title}</h3>
                      <p className="text-sm text-primary mt-1">
                        {format(new Date(event.date), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white -mr-2">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 bg-black/90 backdrop-blur-xl border-white/10 text-white">
                        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                          <Link href={`/events/${event.id}`} className="flex items-center w-full">
                            <Eye className="w-4 h-4 mr-2" /> View Public
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                          <Edit2 className="w-4 h-4 mr-2" /> Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hover:bg-destructive/20 cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between text-sm pt-4 border-t border-white/5">
                    <div className="flex items-center text-muted-foreground gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate max-w-[120px]">
                        {event.venue || 'TBA'}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{event.registeredCount || 0} / {event.capacity || '∞'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
