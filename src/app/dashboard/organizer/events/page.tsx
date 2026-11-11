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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <Card key={event.id} className="group flex flex-col justify-between overflow-hidden rounded-3xl p-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40">
              <div>
                {/* Image Section */}
                <div className="relative h-44 w-full bg-muted overflow-hidden rounded-t-3xl">
                  <img 
                    src={event.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070'} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
                    {event.status}
                  </div>

                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 border border-white/20" />}>
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-2xl bg-card/95 backdrop-blur-2xl border-white/15">
                        <DropdownMenuItem className="rounded-xl hover:bg-white/10 cursor-pointer">
                          <Link href={`/events/${event.id}`} className="flex items-center w-full">
                            <Eye className="w-4 h-4 mr-2 text-primary" /> View Public
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl hover:bg-white/10 cursor-pointer">
                          <Edit2 className="w-4 h-4 mr-2 text-primary" /> Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl text-destructive hover:bg-destructive/15 cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span className="truncate max-w-[120px]">{event.venue || 'TBA'}</span>
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors mb-2">
                    {event.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                    {event.description || 'No description provided.'}
                  </p>

                  <div className="mt-auto space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <span>Registered Attendees</span>
                      </span>
                      <span className="font-bold text-primary">{event.registeredCount || 0} / {event.capacity || '∞'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-amber-500"
                        style={{ width: `${event.capacity ? Math.min(100, Math.round(((event.registeredCount || 0) / event.capacity) * 100)) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 pt-0 border-t border-white/10 dark:border-white/5 flex items-center justify-between gap-2 pt-3">
                <Link href={`/events/${event.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> View Public Page
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
