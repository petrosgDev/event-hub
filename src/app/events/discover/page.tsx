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
import { Navbar } from '@/components/layout/navbar';
import { Search, Calendar, MapPin, Users, X, Clock, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-transparent flex flex-col font-sans relative">
      <Navbar />

      <main className="flex-1 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl pt-8">
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <Badge className="mb-3 px-3.5 py-1 rounded-full bg-amber-500/10 border-amber-500/30 text-amber-500 font-semibold backdrop-blur-md">
              Campus Catalog
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-foreground">Discover Events</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">Find workshops, seminars, hackathons, and cultural festivals at Debre Birhan University</p>
          </div>

          {/* Search & Filters Bar in Glass Box */}
          <div className="p-3 md:p-4 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-amber-500/20 shadow-xl shadow-amber-500/5 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <Input 
                  placeholder="Search events by title, description, or keyword..." 
                  className="pl-11 h-12 bg-white/50 dark:bg-black/30 border-white/30 dark:border-amber-500/20 text-base rounded-2xl text-foreground placeholder:text-muted-foreground focus-visible:ring-amber-500/40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {(['all', 'free', 'paid'] as const).map((f) => (
                  <Button 
                    key={f} 
                    variant={priceFilter === f ? 'default' : 'outline'} 
                    onClick={() => setPriceFilter(f)}
                    className={`capitalize h-12 px-5 rounded-2xl font-bold transition-all ${
                      priceFilter === f 
                        ? 'bg-primary text-primary-foreground shadow-md shadow-amber-500/20' 
                        : 'bg-white/40 dark:bg-black/30 border-white/30 dark:border-amber-500/20 hover:bg-amber-500/10 text-foreground'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'free' ? '🎟️ Free' : '💰 Paid'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Categories Pills */}
            <div className="flex gap-2 overflow-x-auto pt-4 mt-2 border-t border-white/15 dark:border-amber-500/15 scrollbar-hide">
              <Button 
                variant={activeCategory === null ? 'default' : 'outline'} 
                onClick={() => setActiveCategory(null)}
                className={`whitespace-nowrap rounded-full h-9 px-4 text-xs font-bold ${
                  activeCategory === null 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-white/30 dark:bg-black/25 border-white/20 dark:border-amber-500/20 hover:bg-amber-500/10 text-foreground'
                }`}
              >
                All Events
              </Button>
              {categoriesData?.map((cat: any) => (
                <Button 
                  key={cat.id} 
                  variant={activeCategory === cat.slug ? 'default' : 'outline'} 
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`whitespace-nowrap rounded-full h-9 px-4 text-xs font-semibold ${
                    activeCategory === cat.slug 
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm' 
                      : 'bg-white/30 dark:bg-black/25 border-white/20 dark:border-amber-500/20 hover:bg-amber-500/10 text-foreground'
                  }`}
                >
                  <span className="mr-1.5">{cat.icon}</span> {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          {!isLoading && (
            <p className="text-sm text-muted-foreground mb-6 font-medium">
              Showing <span className="text-foreground font-bold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
              {activeCategory && <span> in <Badge variant="outline" className="ml-1.5 border-amber-500/30 text-amber-500 rounded-full">{activeCategory}</Badge></span>}
            </p>
          )}

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} className="h-80 w-full rounded-3xl bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-amber-500/15 animate-pulse" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-amber-500/20 rounded-3xl shadow-xl shadow-amber-500/5">
              <Search className="w-12 h-12 text-amber-500/40 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search query or filters.</p>
              <Button variant="link" onClick={() => { setSearchTerm(''); setActiveCategory(null); setPriceFilter('all'); }} className="text-amber-500 font-bold hover:text-amber-400">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event: any, i: number) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.04 }}>
                  <Link href={`/events/${event.id}`}>
                    <Card className="h-full rounded-3xl p-0 overflow-hidden group cursor-pointer flex flex-col bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-amber-500/20 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-2">
                      <div className="relative h-44 w-full bg-muted overflow-hidden rounded-t-3xl">
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
                          <Badge className="bg-black/50 backdrop-blur-md text-white border border-white/20 text-xs font-bold rounded-full px-2.5 py-0.5">
                            {event.category?.name || 'Event'}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          {!event.isFree && event.price > 0 ? (
                            <Badge className="bg-amber-500 text-black font-extrabold text-xs rounded-full px-2.5 py-0.5 shadow-md">{event.price} ETB</Badge>
                          ) : (
                            <Badge className="bg-emerald-500 text-white font-extrabold text-xs rounded-full px-2.5 py-0.5 shadow-md">FREE</Badge>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-xs text-white">
                          <span className="flex items-center gap-1 font-semibold"><Calendar className="w-3.5 h-3.5 text-amber-400" /> {format(new Date(event.date), 'MMM d')}</span>
                          <span className="flex items-center gap-1 font-semibold"><Users className="w-3.5 h-3.5 text-amber-400" /> {event.registeredCount}/{event.capacity || '∞'}</span>
                        </div>
                      </div>
                      <CardContent className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-foreground mb-1.5 line-clamp-1 group-hover:text-amber-500 transition-colors">{event.title}</h3>
                          <p className="text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed">{event.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-white/10 dark:border-amber-500/10">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{event.location || 'DBU Campus'}</span>
                          <span className="mx-1">·</span>
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{event.startTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function DiscoverEventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>}>
      <DiscoverEventsContent />
    </Suspense>
  );
}
