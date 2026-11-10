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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Clock, Users, Link as LinkIcon, Share2, Bookmark, ArrowLeft, Building, Tag, Loader2, X, Plus, Minus, Ticket } from 'lucide-react';
import Link from 'next/link';

// Slide-out modal component for tickets
function TicketModal({ event, isOpen, onClose, onCheckout, isCheckingOut }: any) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Use event.ticketTiers if available, otherwise mock from event.price
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
      const next = Math.max(0, Math.min(current + delta, max, 10)); // max 10 per order
      return { ...prev, [tierId]: next };
    });
  };

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalAmount = ticketTiers.reduce((acc: number, tier: any) => acc + (tier.price * (quantities[tier.id] || 0)), 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-card border-l border-white/10 shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Select Tickets</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center mb-6">
            <h3 className="font-bold text-lg">{event.title}</h3>
            <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'EEE, MMM d, yyyy • h:mm a')}</p>
          </div>

          <div className="space-y-4">
            {ticketTiers.map((tier: any) => {
              const available = tier.capacity - tier.soldCount;
              const isSoldOut = available <= 0;
              const qty = quantities[tier.id] || 0;
              
              return (
                <div key={tier.id} className={`p-4 rounded-xl border ${qty > 0 ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5'} transition-colors`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{tier.name}</h4>
                      <p className="text-xl font-bold mt-1 text-primary">{tier.price > 0 ? `${tier.price} ETB` : 'Free'}</p>
                    </div>
                    {isSoldOut ? (
                      <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/20">Sold Out</Badge>
                    ) : (
                      <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={() => updateQuantity(tier.id, -1, available)} disabled={qty === 0}>
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-4 text-center font-medium">{qty}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={() => updateQuantity(tier.id, 1, available)} disabled={qty >= Math.min(10, available)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {tier.description && <p className="text-sm text-muted-foreground mb-3">{tier.description}</p>}
                  {!isSoldOut && <p className="text-xs text-muted-foreground">Sales end on {format(new Date(event.date), 'MMM d, yyyy')}</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-card">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Total ({totalTickets} tickets)</span>
            <span className="font-bold text-2xl">{totalAmount} ETB</span>
          </div>
          <Button 
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
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
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', params.id],
    queryFn: async () => {
      const res = await api.get(`/events/${params.id}`);
      return res.data.data;
    },
  });

  const { data: userRegistration } = useQuery({
    queryKey: ['registration', params.id],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      try {
        const res = await api.get('/my/registrations');
        return res.data.data.find((r: any) => r.event.id === params.id) || null;
      } catch {
        return null;
      }
    },
    enabled: isAuthenticated,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/events/${params.id}/register`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.data?.checkoutUrl) {
        window.location.href = data.data.checkoutUrl;
      } else {
        toast.success('Successfully registered for the event!');
        queryClient.invalidateQueries({ queryKey: ['registration', params.id] });
        queryClient.invalidateQueries({ queryKey: ['event', params.id] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register');
    },
    onSettled: () => setIsRegistering(false)
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/events/${params.id}/register`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Registration cancelled');
      queryClient.invalidateQueries({ queryKey: ['registration', params.id] });
      queryClient.invalidateQueries({ queryKey: ['event', params.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
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
    // In a full implementation, we'd pass quantities and tier IDs.
    // For now, trigger the existing single registration flow.
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
      <div className="min-h-screen bg-background pt-24 px-6 pb-20">
        <div className="container mx-auto max-w-5xl">
          <Skeleton className="w-full h-[400px] rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-[300px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event not found</h2>
          <Button onClick={() => router.push('/events/discover')} variant="link">
            Back to events
          </Button>
        </div>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.capacity;
  const isPast = new Date(event.date) < new Date();
  const isOrganizer = user?.id === event.organizer.id;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Banner / Header */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-muted overflow-hidden">
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
        
        <div className="absolute top-24 left-6 z-10">
          <Button variant="ghost" className="bg-black/40 backdrop-blur-md text-white hover:bg-black/60 border border-white/10" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 w-full px-6 pb-8">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex gap-2 mb-4">
                {event.category && (
                  <Badge className="bg-primary/80 backdrop-blur-md text-white">
                    {event.category.icon} {event.category.name}
                  </Badge>
                )}
                {event.isOnline && (
                  <Badge className="bg-blue-500/80 backdrop-blur-md text-white">Online Event</Badge>
                )}
                <Badge variant="outline" className="bg-black/50 backdrop-blur-md text-white border-white/20">
                  {event.status}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm md:text-base text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                  {/* Category & Status */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20 px-3 py-1">
                      {event.category?.name || 'General'}
                    </Badge>
                    {!event.isFree && event.price > 0 ? (
                      <Badge variant="outline" className="border-orange-500/50 text-orange-400 px-3 py-1 bg-orange-500/10">
                        🎟️ {event.price} ETB
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500/50 text-green-400 px-3 py-1 bg-green-500/10">
                        🎟️ FREE
                      </Badge>
                    )}
                    <Badge variant="outline" className="border-white/20 text-white px-3 py-1 backdrop-blur-md bg-black/20">
                      {event.isOnline ? '🌐 Virtual' : '📍 In-Person'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  {event.startTime} - {event.endTime}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {event.location || 'Online'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">About this event</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </div>
            </section>

            {event.tags && event.tags.length > 0 && (
              <section>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-white/5 border-white/10 flex items-center gap-1 text-muted-foreground">
                      <Tag className="w-3 h-3" /> {tag}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-2xl font-bold mb-6">Location Map</h2>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 relative h-[300px]">
                {event.isOnline ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MapPin className="w-12 h-12 mb-2 opacity-50" />
                    <p>This is an online event</p>
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
                    className="grayscale-[0.8] contrast-125 opacity-80"
                  ></iframe>
                )}
              </div>
            </section>

            <Separator className="bg-white/10" />

            <section>
              <h2 className="text-2xl font-bold mb-6">Organizer</h2>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={event.organizer.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xl">
                    {event.organizer.firstName[0]}{event.organizer.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{event.organizer.firstName} {event.organizer.lastName}</h3>
                  <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
                    <Building className="w-4 h-4" /> {event.club?.name || 'Independent Organizer'}
                  </p>
                </div>
              </div>
            </section>

            {event.schedules && event.schedules.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Schedule</h2>
                <div className="space-y-4">
                  {event.schedules.map((schedule: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="text-primary font-mono font-medium shrink-0 pt-1">
                        {schedule.startTime}
                      </div>
                      <div>
                        <h4 className="font-semibold">{schedule.title}</h4>
                        {schedule.description && <p className="text-sm text-muted-foreground mt-1">{schedule.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Registration Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-card/50 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-accent" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Registration</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/10 mb-4">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium text-xl">{event.isFree ? 'Free' : `${event.price} ETB`}</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-medium">
                          {event.registeredCount} / {event.capacity} seats filled
                        </p>
                      </div>
                    </div>
                    
                    {event.isOnline && event.meetingUrl && userRegistration && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                          <LinkIcon className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm text-muted-foreground">Meeting Link</p>
                          <a href={event.meetingUrl} target="_blank" rel="noreferrer" className="font-medium text-blue-500 hover:underline truncate block">
                            Join Event Online
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Call to Action Button */}
                  {isOrganizer ? (
                    <Button className="w-full h-14 text-lg font-bold" variant="outline" onClick={() => router.push(`/dashboard/organizer/events/${event.id}`)}>
                      Manage Event
                    </Button>
                  ) : isPast ? (
                    <Button className="w-full h-14 text-lg font-bold" variant="secondary" disabled>
                      Event has ended
                    </Button>
                  ) : userRegistration ? (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center gap-2 font-bold text-base">
                        <Ticket className="w-5 h-5" /> You are registered!
                      </div>
                      <Button 
                        className="w-full h-12" 
                        variant="destructive" 
                        onClick={handleCancel}
                        disabled={cancelMutation.isPending}
                      >
                        Cancel Registration
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className={`w-full h-14 text-lg font-bold ${isFull ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary hover:bg-primary/90'} text-white shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] transition-all hover:-translate-y-1`}
                      onClick={handleRegisterClick}
                    >
                      {isFull ? 'Join Waitlist' : 'Get Tickets'}
                    </Button>
                  )}
                  
                  {event.registrationDeadline && !isPast && !userRegistration && (
                    <p className="text-xs text-center text-muted-foreground mt-4">
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
    </div>
  );
}
