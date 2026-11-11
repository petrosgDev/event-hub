'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, ArrowRight, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function StudentEventsPage() {
  const { user } = useAuthStore();
  const { data: registrations, isLoading } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const res = await api.get('/my/registrations');
      return res.data.data;
    },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">All your registered and past events.</p>
        </div>
        <Link href="/events/discover">
          <Button>Discover More</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 w-full rounded-3xl bg-white/5 border border-white/10 animate-pulse" />)}
        </div>
      ) : registrations?.length === 0 ? (
        <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-medium mb-2">No registrations yet</h3>
          <p className="text-muted-foreground mb-6">You haven't registered for any events.</p>
          <Link href="/events/discover">
            <Button className="rounded-xl">Explore Events</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations?.map((reg: any, i: number) => {
            const isPast = new Date(reg.event.date) < new Date();
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
            const imgSrc = reg.event.bannerImage || fallbackImages[reg.event.category?.slug] || `https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=400&fit=crop`;

            return (
              <motion.div key={reg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={`group flex flex-col justify-between overflow-hidden rounded-3xl p-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 ${isPast ? 'opacity-75' : ''}`}>
                  <div>
                    {/* Event Banner */}
                    <div className="relative h-44 w-full bg-muted overflow-hidden rounded-t-3xl">
                      <img src={imgSrc} alt={reg.event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs">
                          {format(new Date(reg.event.date), 'MMM d, yyyy')}
                        </Badge>
                      </div>

                      <div className="absolute top-3 right-3">
                        <Badge className={
                          reg.status === 'CONFIRMED' ? 'bg-emerald-500/80 backdrop-blur-md text-white border-none' : 
                          reg.status === 'WAITLISTED' ? 'bg-amber-500/80 backdrop-blur-md text-white border-none' : 
                          'bg-red-500/80 backdrop-blur-md text-white border-none'
                        }>
                          {reg.status}
                        </Badge>
                      </div>

                      {isPast && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                          <Badge variant="secondary" className="bg-black/80 text-white rounded-full px-4 py-1">Past Event</Badge>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-2">
                        {reg.event.title}
                      </h3>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{reg.event.startTime} - {reg.event.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{reg.event.location || 'DBU Campus'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 border-t border-white/10 dark:border-white/5 flex items-center justify-between gap-2 pt-3">
                    {isPast && reg.status === 'ATTENDED' ? (
                      <Link href={`/dashboard/student/events/${reg.event.id}/feedback`}>
                        <Button variant="outline" size="sm" className="rounded-xl border-primary/40 text-primary hover:bg-primary/10">
                          Feedback
                        </Button>
                      </Link>
                    ) : (
                      <div />
                    )}

                    {reg.status === 'CONFIRMED' ? (
                      <Dialog>
                        <DialogTrigger render={<Button size="sm" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm" />}>
                          View Ticket <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-3xl bg-card/90 backdrop-blur-2xl border-white/20">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Your Ticket: {reg.event.title}</DialogTitle>
                            <DialogDescription>
                              Show this QR code at the entrance to attend the event.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 mt-4">
                            {reg.qrCode ? (
                              <div className="bg-white p-4 rounded-2xl shadow-xl relative group">
                                <img src={reg.qrCode} alt="Ticket QR Code" className="w-64 h-64 object-contain mix-blend-multiply" />
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(reg.qrToken || reg.id);
                                    toast.success('Ticket ID copied to clipboard');
                                  }}
                                  className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5"
                                >
                                  Copy ID
                                </button>
                              </div>
                            ) : (
                              <div className="w-64 h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl text-muted-foreground">
                                <QrCode className="w-12 h-12 mb-2 opacity-50" />
                                <span>No QR Code available</span>
                              </div>
                            )}
                            <div className="mt-4 text-center">
                              <p className="font-bold text-foreground text-sm">Ticket ID: {reg.qrToken || reg.id}</p>
                              <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-none">{reg.status}</Badge>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Link href={`/events/${reg.event.id}`}>
                        <Button variant="secondary" size="sm" className="rounded-xl">
                          View Event <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
