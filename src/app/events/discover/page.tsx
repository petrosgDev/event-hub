'use client';

import { Suspense, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Calendar, MapPin, Users, Filter, X, Clock, Ticket, SlidersHorizontal, Loader2 } from 'lucide-react';

function DiscoverEventsContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(searchParams.get('category'));
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => { const res = await api.get('/categories'); return res.data.data; },
  });

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events', debouncedSearch, activeCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (activeCategory) params.append('category', activeCategory);
      const res = await api.get(`/events?${params.toString()}`);
      return res.data.data;
    },
  });

  const rawEvents = eventsData?.events || eventsData || [];
  const filteredEvents = rawEvents.filter((e: any) => {
    if (priceFilter === 'free') return e.isFree || e.price === 0;
    if (priceFilter === 'paid') return !e.isFree && e.price > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Discover Events</h1>
          <p className="text-muted-foreground text-lg">Find workshops, seminars, hackathons, and more at Debre Birhan University</p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search events by name, description, or tag..." 
              className="pl-11 h-12 bg-card border-border text-base rounded-xl text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {(['all', 'free', 'paid'] as const).map((f) => (
              <Button key={f} variant={priceFilter === f ? 'default' : 'outline'} onClick={() => setPriceFilter(f)}
                className={`capitalize h-12 px-5 rounded-xl ${priceFilter === f ? 'bg-primary text-primary-foreground' : 'bg-card border-border hover:bg-secondary text-foreground'}`}>
                {f === 'all' ? 'All' : f === 'free' ? '🎟️ Free' : '💰 Paid'}
              </Button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <Button variant={activeCategory === null ? 'default' : 'outline'} onClick={() => setActiveCategory(null)}
            className={`whitespace-nowrap rounded-full ${activeCategory === null ? 'bg-primary text-primary-foreground font-bold' : 'bg-card border-border hover:bg-secondary text-foreground font-semibold'}`}>
            All Events
          </Button>
          {categoriesData?.map((cat: any) => (
            <Button key={cat.id} variant={activeCategory === cat.slug ? 'default' : 'outline'} onClick={() => setActiveCategory(cat.slug)}
              className={`whitespace-nowrap rounded-full ${activeCategory === cat.slug ? 'bg-primary text-primary-foreground font-bold' : 'bg-card border-border hover:bg-secondary text-foreground font-semibold'}`}>
              <span className="mr-1.5">{cat.icon}</span> {cat.name}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing <span className="text-foreground font-medium">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
            {activeCategory && <span> in <Badge variant="outline" className="ml-1 border-primary/30 text-primary">{activeCategory}</Badge></span>}
          </p>
        )}

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <Card key={i} className="bg-card border-border overflow-hidden">
                <Skeleton className="h-44 w-full rounded-none" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between pt-3"><Skeleton className="h-8 w-20" /><Skeleton className="h-8 w-20" /></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl backdrop-blur-sm">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
            <Button variant="link" onClick={() => { setSearchTerm(''); setActiveCategory(null); setPriceFilter('all'); }} className="text-primary">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredEvents.map((event: any, i: number) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.04 }}>
                <Link href={`/events/${event.id}`}>
                  <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col hover:-translate-y-1 shadow-md">
                    <div className="relative h-44 w-full bg-muted overflow-hidden">
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
                          <img src={imgSrc} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        );
                      })()}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border text-xs font-bold">{event.category?.name || 'Event'}</Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        {!event.isFree && event.price > 0 ? (
                          <Badge className="bg-orange-500 text-white text-xs font-bold">{event.price} ETB</Badge>
                        ) : (
                          <Badge className="bg-green-500 text-white text-xs font-bold">FREE</Badge>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-xs text-white">
                        <span className="flex items-center gap-1 font-semibold"><Calendar className="w-3 h-3" /> {format(new Date(event.date), 'MMM d')}</span>
                        <span className="flex items-center gap-1 font-semibold"><Users className="w-3 h-3" /> {event.registeredCount}/{event.capacity}</span>
                      </div>
                    </div>
                    <CardContent className="p-4 flex-grow flex flex-col">
                      <h3 className="font-bold text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-grow font-medium">{event.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location || 'Online'}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.startTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DiscoverEventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <DiscoverEventsContent />
    </Suspense>
  );
}
