'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/layout/navbar';
import { Calendar, MapPin, Clock, Users, Link as LinkIcon, Share2, Bookmark, ArrowLeft, Building, Tag, Loader2, X, Plus, Minus, Ticket } from 'lucide-react';

// Slide-out modal component for tickets
function TicketModal({ event, isOpen, onClose, onCheckout, isCheckingOut }: any) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  const ticketTiers = event.ticketTiers?.length > 0 
    ? event.ticketTiers 
    : [
        {
          id: 'default',
          name: event.isFree ? 'General Admission (Free)' : 'General Admission',
          price: event.price,
          description: 'Standard entry to the event.',
          capacity: event.capacity,
          soldCount: event.registeredCount
        }
      ];

  const updateQuantity = (tierId: string, delta: number, max: number) => {
    setQuantities(prev => {
      const current = prev[tierId] || 0;
      const next = Math.max(0, Math.min(current + delta, max, 10));
      return { ...prev, [tierId]: next };
    });
  };

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalAmount = ticketTiers.reduce((acc: number, tier: any) => acc + (tier.price * (quantities[tier.id] || 0)), 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 transition-opacity" onClick={onClose} />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white/90 dark:bg-black/90 backdrop-blur-3xl border-l border-amber-500/25 shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-amber-500/20">
          <h2 className="text-xl font-bold text-foreground">Select Tickets</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-amber-500/10">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center mb-6">
            <h3 className="font-bold text-lg text-foreground">{event.title}</h3>
            <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'EEE, MMM d, yyyy • h:mm a')}</p>
          </div>

          <div className="space-y-4">
            {ticketTiers.map((tier: any) => {
              const available = tier.capacity - tier.soldCount;
              const isSoldOut = available <= 0;
              const qty = quantities[tier.id] || 0;
              
              return (
                <div key={tier.id} className={`p-5 rounded-2xl border transition-all ${qty > 0 ? 'border-amber-500 bg-amber-500/10' : 'border-white/30 dark:border-amber-500/20 bg-white/40 dark:bg-black/30 backdrop-blur-xl'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-base text-foreground">{tier.name}</h4>
                      <p className="text-xl font-extrabold mt-1 text-amber-500">{tier.price > 0 ? `${tier.price} ETB` : 'Free'}</p>
                    </div>
                    {isSoldOut ? (
                      <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/20 rounded-full">Sold Out</Badge>
                    ) : (
                      <div className="flex items-center gap-3 bg-white/50 dark:bg-black/50 rounded-xl p-1 border border-white/20 dark:border-amber-500/20">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateQuantity(tier.id, -1, available)} disabled={qty === 0}>
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-4 text-center font-bold text-foreground">{qty}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateQuantity(tier.id, 1, available)} disabled={qty >= Math.min(10, available)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {tier.description && <p className="text-sm text-muted-foreground mb-3">{tier.description}</p>}
                  {!isSoldOut && <p className="text-xs text-muted-foreground font-medium">Sales end on {format(new Date(event.date), 'MMM d, yyyy')}</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-white/20 dark:border-amber-500/20 bg-white/60 dark:bg-black/60 backdrop-blur-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground font-medium">Total ({totalTickets} tickets)</span>
            <span className="font-extrabold text-2xl text-foreground">{totalAmount} ETB</span>
          </div>
          <Button 
            className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-amber-500/25"
            disabled={totalTickets === 0 || isCheckingOut}
            onClick={() => onCheckout(quantities)}
          >
            {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Ticket className="w-5 h-5 mr-2" />}
            {isCheckingOut ? 'Processing...' : 'Checkout'}
          </Button>
        </div>
      </motion.div>
    </>
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const res = await api.get(`/events/${id}`);
      return res.data.data;
    },
  });

  const { data: userRegistration } = useQuery({
    queryKey: ['registration', id, user?.id],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      try {
        const res = await api.get(`/registrations/check/${id}`);
        return res.data.data;
      } catch (err) {
        return null;
      }
    },
    enabled: !!isAuthenticated && !!id,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      return await api.post(`/registrations/${id}`);
    },
    onSuccess: () => {
      toast.success('Successfully registered for event!');
      queryClient.invalidateQueries({ queryKey: ['registration', id] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      setIsTicketModalOpen(false);
      setIsRegistering(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to register');
      setIsRegistering(false);
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(`/registrations/${id}`);
    },
    onSuccess: () => {
      toast.success('Registration cancelled');
      queryClient.invalidateQueries({ queryKey: ['registration', id] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to cancel registration');
    }
  });

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to register');
      router.push('/login');
      return;
    }
    setIsTicketModalOpen(true);
  };

  const handleCheckout = (quantities: Record<string, number>) => {
    setIsRegistering(true);
    registerMutation.mutate();
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel your registration?')) {
      cancelMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col font-sans relative">
        <Navbar />
        <div className="container mx-auto max-w-5xl px-6 pt-10 pb-20">
          <Skeleton className="w-full h-[400px] rounded-3xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4 rounded-2xl" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
            <div>
              <Skeleton className="h-[300px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col font-sans relative">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center p-8 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-amber-500/20 shadow-xl max-w-md">
            <h2 className="text-2xl font-bold mb-2 text-foreground">Event not found</h2>
            <p className="text-muted-foreground mb-6">The event you are looking for does not exist or has been removed.</p>
            <Button onClick={() => router.push('/events/discover')} className="rounded-full bg-primary text-primary-foreground font-bold">
              Back to events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.capacity;
  const isPast = new Date(event.date) < new Date();
  const isOrganizer = user?.id === event.organizer.id;

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans relative">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Banner / Header */}
        <div className="relative w-full h-[400px] md:h-[480px] bg-muted overflow-hidden">
          {(() => {
            const fallbackImages: Record<string, string> = {
              'workshop': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=600&fit=crop',
              'seminar': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=600&fit=crop',
              'competition': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=600&fit=crop',
              'science-week': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop',
              'cultural': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=600&fit=crop',
              'sports': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop',
              'training': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
              'networking': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
              'hackathon': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop',
              'career-fair': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop',
            };
            const imgSrc = event.bannerImage || fallbackImages[event.category?.slug] || `https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=600&fit=crop`;
            return (
              <img src={imgSrc} alt={event.title} className="w-full h-full object-cover" />
            );
          })()}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          <div className="absolute top-6 left-6 z-10">
            <Button variant="ghost" className="bg-black/50 backdrop-blur-md text-white hover:bg-black/70 border border-white/20 rounded-full" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 w-full px-6 pb-8">
            <div className="container mx-auto max-w-5xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.category && (
                    <Badge className="bg-amber-500/90 text-black font-bold backdrop-blur-md rounded-full px-3 py-1">
                      {event.category.icon} {event.category.name}
                    </Badge>
                  )}
                  {event.isOnline ? (
                    <Badge className="bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-full px-3 py-1">🌐 Virtual</Badge>
                  ) : (
                    <Badge className="bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-full px-3 py-1">📍 In-Person</Badge>
                  )}
                  {!event.isFree && event.price > 0 ? (
                    <Badge className="bg-amber-500 text-black font-extrabold rounded-full px-3 py-1">🎟️ {event.price} ETB</Badge>
                  ) : (
                    <Badge className="bg-emerald-500 text-white font-extrabold rounded-full px-3 py-1">🎟️ FREE</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm md:text-base text-gray-200">
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="w-5 h-5 text-amber-400" />
                    {event.startTime} - {event.endTime}
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    {event.location || 'Online'}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="container mx-auto max-w-5xl px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <section className="p-8 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-amber-500/20 shadow-xl shadow-amber-500/5">
                <h2 className="text-2xl font-bold mb-4 text-foreground">About this event</h2>
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15 dark:border-amber-500/15">
                    {event.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-white/40 dark:bg-black/30 border border-white/20 dark:border-amber-500/20 rounded-full px-3 py-1 flex items-center gap-1 text-muted-foreground text-xs font-semibold">
                        <Tag className="w-3 h-3 text-amber-500" /> {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </section>

              {/* Map */}
              <section className="p-8 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-amber-500/20 shadow-xl shadow-amber-500/5">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Location Map</h2>
                <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-white/30 dark:border-amber-500/20 bg-black/10 relative h-[300px]">
                  {event.isOnline ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <MapPin className="w-12 h-12 mb-2 text-amber-500 opacity-60" />
                      <p className="font-medium">This is an online event</p>
                    </div>
                  ) : (
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight={0} 
                      marginWidth={0} 
                      src={`https://maps.google.com/maps?q=Debre Birhan University, ${event.location || ''}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      className="grayscale-[0.3] contrast-105"
                    ></iframe>
                  )}
                </div>
              </section>

              {/* Organizer */}
              <section className="p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-amber-500/20 shadow-xl shadow-amber-500/5">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Organizer</h2>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-amber-500/40 rounded-2xl shadow-md">
                    <AvatarImage src={event.organizer.avatar} />
                    <AvatarFallback className="bg-amber-500/20 text-amber-500 text-xl font-bold rounded-2xl">
                      {event.organizer.firstName[0]}{event.organizer.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{event.organizer.firstName} {event.organizer.lastName}</h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1 font-medium">
                      <Building className="w-4 h-4 text-amber-500" /> {event.club?.name || 'Independent Organizer'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Schedule */}
              {event.schedules && event.schedules.length > 0 && (
                <section className="p-8 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-amber-500/20 shadow-xl shadow-amber-500/5">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Schedule</h2>
                  <div className="space-y-4">
                    {event.schedules.map((schedule: any, i: number) => (
                      <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/50 dark:bg-black/40 border border-white/25 dark:border-amber-500/20 backdrop-blur-xl hover:border-amber-500/40 transition-all">
                        <div className="text-amber-500 font-mono font-bold shrink-0 pt-0.5">
                          {schedule.startTime}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{schedule.title}</h4>
                          {schedule.description && <p className="text-sm text-muted-foreground mt-1">{schedule.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar / Registration Card (Rounded-3xl Glass) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="rounded-3xl shadow-2xl overflow-hidden border border-white/30 dark:border-amber-500/25 bg-white/40 dark:bg-black/35 backdrop-blur-2xl">
                  <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500" />
                  <CardContent className="p-7">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-foreground">Registration</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-amber-500/10 text-amber-500">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-amber-500/10">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-white/15 dark:border-amber-500/15 mb-4">
                      <span className="text-muted-foreground font-medium">Price</span>
                      <span className="font-extrabold text-2xl text-amber-500">{event.isFree ? 'Free' : `${event.price} ETB`}</span>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Capacity</p>
                          <p className="font-bold text-foreground">
                            {event.registeredCount} / {event.capacity} seats filled
                          </p>
                        </div>
                      </div>
                      
                      {event.isOnline && event.meetingUrl && userRegistration && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                            <LinkIcon className="w-5 h-5 text-amber-500" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Meeting Link</p>
                            <a href={event.meetingUrl} target="_blank" rel="noreferrer" className="font-bold text-amber-500 hover:underline truncate block">
                              Join Event Online
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Call to Action Button */}
                    {isOrganizer ? (
                      <Button className="w-full h-14 text-lg font-bold rounded-2xl" variant="outline" onClick={() => router.push(`/dashboard/organizer/events/${event.id}`)}>
                        Manage Event
                      </Button>
                    ) : isPast ? (
                      <Button className="w-full h-14 text-lg font-bold rounded-2xl" variant="secondary" disabled>
                        Event has ended
                      </Button>
                    ) : userRegistration ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center gap-2 font-bold text-base">
                          <Ticket className="w-5 h-5" /> You are registered!
                        </div>
                        <Button 
                          className="w-full h-12 rounded-2xl" 
                          variant="destructive" 
                          onClick={handleCancel}
                          disabled={cancelMutation.isPending}
                        >
                          Cancel Registration
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className={`w-full h-14 text-lg font-bold rounded-2xl ${isFull ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary hover:bg-primary/90 text-primary-foreground'} shadow-xl shadow-amber-500/25 transition-all hover:scale-105`}
                        onClick={handleRegisterClick}
                      >
                        {isFull ? 'Join Waitlist' : 'Get Tickets'}
                      </Button>
                    )}
                    
                    {event.registrationDeadline && !isPast && !userRegistration && (
                      <p className="text-xs text-center text-muted-foreground mt-4 font-medium">
                        Sales end: {format(new Date(event.registrationDeadline), 'MMM d, yyyy')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            
          </div>
        </div>

        <AnimatePresence>
          {isTicketModalOpen && (
            <TicketModal 
              event={event} 
              isOpen={isTicketModalOpen} 
              onClose={() => setIsTicketModalOpen(false)} 
              onCheckout={handleCheckout}
              isCheckingOut={isRegistering}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
