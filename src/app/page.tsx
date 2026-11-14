'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Navbar } from '@/components/layout/navbar';
import { Card3D, Card3DItem } from '@/components/ui/card-3d';
import { 
  ArrowRight, Sparkles, QrCode, BrainCircuit, BarChart3, 
  Award, ShieldCheck, CalendarDays, MapPin, Clock, Users,
  Ticket, Star, CheckCircle2, Globe, GraduationCap, Building2,
  Zap, Trophy, BookOpen, Heart, Play
} from 'lucide-react';
import { useTranslation } from '@/stores/language-store';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  const { data: events } = useQuery({
    queryKey: ['landing-events'],
    queryFn: async () => {
      const res = await api.get('/events?status=PUBLISHED&limit=6');
      return res.data.data?.events || res.data.data || [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['landing-categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data || [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['landing-stats'],
    queryFn: async () => {
      const res = await api.get('/analytics/public-stats');
      return res.data.data;
    },
  });

  const featuredEvents = (events || []).filter((e: any) => e.isFeatured).slice(0, 3);
  const allEvents = events || [];
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans relative">
      <Navbar />

      <main className="flex-1">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative pt-8 md:pt-14 pb-24 overflow-hidden bg-transparent perspective-1200">
          {/* Subtle noise and ambient golden bursts */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-yellow-500/10 rounded-full blur-[130px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-500 mb-8 backdrop-blur-md gap-2 shadow-sm">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span className="font-semibold">{t('heroBadge')}</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground leading-[1.1]">
                {t('heroTitle1')}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 drop-shadow-[0_4px_16px_rgba(245,158,11,0.35)]">
                  {t('heroTitle2')}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                {t('heroDescription')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link href="/events/discover">
                  <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full btn-3d-golden transition-all">
                    {t('exploreEvents')} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setShowDemo(true)} 
                  className="h-14 px-8 text-lg rounded-full border border-amber-500/30 hover:bg-amber-500/10 bg-white/40 dark:bg-black/35 backdrop-blur-xl font-semibold text-foreground shadow-md hover:scale-105 transition-all"
                >
                  <Play className="mr-2 w-5 h-5 fill-amber-500 text-amber-500" /> Watch Demo
                </Button>
                <Link href="/register">
                  <Button size="lg" variant="ghost" className="h-14 px-8 text-lg rounded-full hover:bg-white/10 dark:hover:bg-amber-500/10 backdrop-blur-md text-foreground/80 font-medium">
                    {t('joinAsOrganizer')}
                  </Button>
                </Link>
              </div>

              {/* 🏆 Interactive 3D Tilt Hero Stats Box */}
              <div className="max-w-5xl mx-auto mt-6">
                <Card3D depth={8} className="w-full">
                  <div className="p-6 md:p-8 rounded-3xl bg-white/45 dark:bg-black/35 backdrop-blur-2xl border-0 shadow-[0_25px_60px_rgba(0,0,0,0.12),0_10px_25px_rgba(245,158,11,0.1)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.7),0_15px_30px_rgba(245,158,11,0.15)]">
                    <Card3DItem translateZ={30}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { label: t('students'), value: stats?.students || '0+', icon: Users },
                          { label: t('eventsHosted'), value: stats?.events || '0+', icon: CalendarDays },
                          { label: t('organizers'), value: stats?.organizers || '0+', icon: Building2 },
                          { label: t('satisfaction'), value: stats?.satisfaction || '0%', icon: Heart },
                        ].map((stat, i) => (
                          <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white/20 dark:hover:bg-amber-500/10 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mb-1 shadow-sm">
                              <stat.icon className="w-6 h-6 text-amber-500" />
                            </div>
                            <span className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{stat.value}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    </Card3DItem>
                  </div>
                </Card3D>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ BROWSE BY CATEGORY (3D TILT CARDS) ═══════════════ */}
        <section className="py-20 relative bg-transparent perspective-1200">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <Badge className="mb-3 px-3.5 py-1 rounded-full bg-amber-500/10 border-amber-500/30 text-amber-500 font-semibold backdrop-blur-md">
                Explore Categories
              </Badge>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">{t('browseByCategory')}</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">{t('browseByCategoryDesc')}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              {(categories || []).slice(0, 10).map((cat: any) => (
                <Card3D key={cat.id} depth={15} className="h-full">
                  <Link href={`/events/discover?category=${cat.slug}`}>
                    <div className="group flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/45 dark:bg-black/35 backdrop-blur-2xl border-0 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-500/5 hover:shadow-2xl hover:shadow-amber-500/20 h-full">
                      <Card3DItem translateZ={35}>
                        <span className="text-5xl group-hover:scale-125 transition-transform duration-300 drop-shadow-md">{cat.icon}</span>
                      </Card3DItem>
                      <Card3DItem translateZ={15}>
                        <span className="text-sm font-bold text-center text-foreground group-hover:text-amber-500 transition-colors">{cat.name}</span>
                      </Card3DItem>
                    </div>
                  </Link>
                </Card3D>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ LIVE EVENTS FEED (INTERACTIVE 3D CARDS) ═══════════════ */}
        <section className="py-20 relative bg-transparent perspective-1200">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('upcomingEvents')}</h2>
                <p className="text-muted-foreground">{t('upcomingEventsDesc')}</p>
              </div>
              <Link href="/events/discover">
                <Button variant="ghost" className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-full font-semibold">
                  {t('viewAllEvents')} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {allEvents.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-white/30 dark:border-amber-500/20 shadow-lg">
                <CalendarDays className="w-12 h-12 text-amber-500/40 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">{t('noEventsYet')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allEvents.slice(0, 6).map((event: any, i: number) => (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Card3D depth={10} className="h-full">
                      <Link href={`/events/${event.id}`}>
                        <Card className="h-full rounded-3xl p-0 overflow-hidden group cursor-pointer flex flex-col transition-all duration-300">
                          <div className="relative h-48 w-full bg-muted overflow-hidden rounded-t-3xl">
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                            
                            <Card3DItem translateZ={25} className="absolute top-3 left-3 flex gap-2">
                              <Badge className="bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-bold rounded-full px-2.5 py-0.5 shadow-md">
                                {event.category?.name || 'Event'}
                              </Badge>
                            </Card3DItem>
                            
                            <Card3DItem translateZ={25} className="absolute top-3 right-3">
                              {!event.isFree && event.price > 0 ? (
                                <Badge className="bg-amber-500 text-black font-extrabold text-xs rounded-full px-2.5 py-0.5 shadow-md">{event.price} ETB</Badge>
                              ) : (
                                <Badge className="bg-emerald-500 text-white font-extrabold text-xs rounded-full px-2.5 py-0.5 shadow-md">FREE</Badge>
                              )}
                            </Card3DItem>
                            
                            <Card3DItem translateZ={20} className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-xs text-white/95">
                              <span className="flex items-center gap-1 font-semibold">
                                <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
                                {event.date ? format(new Date(event.date), 'MMM d, yyyy') : 'TBA'}
                              </span>
                              <span className="flex items-center gap-1 font-semibold">
                                <Users className="w-3.5 h-3.5 text-amber-400" />
                                {event.registeredCount || 0} attending
                              </span>
                            </Card3DItem>
                          </div>
                          
                          <CardContent className="p-5 flex-grow flex flex-col justify-between">
                            <Card3DItem translateZ={15}>
                              <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors">{event.title}</h3>
                              <p className="text-muted-foreground text-xs line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
                            </Card3DItem>
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
                    </Card3D>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════ CAMPUS MAP (3D TILT GLASS CONTAINER) ═══════════════ */}
        <section className="py-20 relative bg-transparent perspective-1200">
          <div className="container mx-auto px-4 max-w-7xl">
            <Card3D depth={8} className="w-full">
              <div className="p-8 md:p-12 rounded-3xl bg-white/45 dark:bg-black/35 backdrop-blur-2xl border-0 shadow-2xl shadow-amber-500/10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div>
                    <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full px-3.5 py-1 mb-4 font-semibold backdrop-blur-md">
                      {t('campusMap')}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('findEventsOnCampus')}</h2>
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                      {t('campusMapDesc')}
                    </p>
                    <div className="space-y-3 mb-8">
                      {[
                        t('campusLoc1'),
                        t('campusLoc2'), 
                        t('campusLoc3'),
                        t('campusLoc4')
                      ].map((loc, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="text-foreground/90 font-medium">{loc}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/events/discover">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-12 px-7 font-bold btn-3d-golden">
                        <MapPin className="w-4 h-4 mr-2" /> {t('browseEventsNearYou')}
                      </Button>
                    </Link>
                  </div>
                  
                  <Card3DItem translateZ={25}>
                    <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-white/30 dark:border-amber-500/25 shadow-2xl h-[400px]">
                      <iframe 
                        width="100%" height="100%" frameBorder="0" scrolling="no"
                        src="https://maps.google.com/maps?q=Debre+Birhan+University&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        className="grayscale-[0.2] contrast-105"
                      ></iframe>
                    </div>
                  </Card3DItem>
                </div>
              </div>
            </Card3D>
          </div>
        </section>

        {/* ═══════════════ FEATURES (3D SPATIAL CARDS) ═══════════════ */}
        <section className="py-20 relative bg-transparent perspective-1200">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <Badge className="mb-3 px-3.5 py-1 rounded-full bg-amber-500/10 border-amber-500/30 text-amber-500 font-semibold backdrop-blur-md">
                Cutting-Edge Capabilities
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuresTitle')}</h2>
              <p className="text-muted-foreground text-lg">{t('featuresSubtitle')}</p>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Ticket, title: t('feature1Title'), description: t('feature1Desc') },
                { icon: QrCode, title: t('feature2Title'), description: t('feature2Desc') },
                { icon: Zap, title: t('feature3Title'), description: t('feature3Desc') },
                { icon: BarChart3, title: t('feature4Title'), description: t('feature4Desc') },
                { icon: Award, title: t('feature5Title'), description: t('feature5Desc') },
                { icon: ShieldCheck, title: t('feature6Title'), description: t('feature6Desc') },
              ].map((feature, i) => (
                <Card3D key={i} depth={12} className="h-full">
                  <div className="group p-8 rounded-3xl bg-white/45 dark:bg-black/35 backdrop-blur-2xl border-0 transition-all duration-300 shadow-xl shadow-amber-500/5 hover:shadow-2xl hover:shadow-amber-500/20 h-full flex flex-col">
                    <Card3DItem translateZ={35}>
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mb-6 group-hover:bg-amber-500/25 group-hover:scale-110 transition-all shadow-md shadow-amber-500/10">
                        <feature.icon className="w-7 h-7 text-amber-500" />
                      </div>
                    </Card3DItem>
                    <Card3DItem translateZ={20}>
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-amber-500 transition-colors">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </Card3DItem>
                  </div>
                </Card3D>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS (3D STAGE) ═══════════════ */}
        <section className="py-20 relative bg-transparent perspective-1200">
          <div className="container mx-auto px-4 max-w-7xl">
            <Card3D depth={6} className="w-full">
              <div className="p-8 md:p-14 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-2xl border-0 shadow-2xl shadow-amber-500/10 relative overflow-hidden">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge className="mb-3 px-3.5 py-1 rounded-full bg-amber-500/10 border-amber-500/30 text-amber-500 font-semibold backdrop-blur-md">
                      Simple Process
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('howItWorks')}</h2>
                    <p className="text-muted-foreground text-lg">{t('howItWorksDesc')}</p>
                  </div>

                  <Card3DItem translateZ={25}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                      <div className="hidden md:block absolute top-14 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
                      {[
                        { step: '1', title: t('step1Title'), desc: t('step1Desc'), icon: Globe },
                        { step: '2', title: t('step2Title'), desc: t('step2Desc'), icon: Ticket },
                        { step: '3', title: t('step3Title'), desc: t('step3Desc'), icon: QrCode },
                        { step: '4', title: t('step4Title'), desc: t('step4Desc'), icon: Trophy },
                      ].map((item, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center group">
                          <div className="w-24 h-24 rounded-3xl bg-white/60 dark:bg-black/50 backdrop-blur-xl border-2 border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(245,158,11,0.25)] group-hover:scale-110 group-hover:border-amber-500/70 transition-all relative z-10">
                            <item.icon className="w-9 h-9 text-amber-500" />
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-amber-500 transition-colors">{item.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </Card3DItem>
                </div>
              </div>
            </Card3D>
          </div>
        </section>

        {/* ═══════════════ TESTIMONIALS (3D TILT CARDS) ═══════════════ */}
        <section className="py-20 relative bg-transparent perspective-1200">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('whatStudentsSay')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: 'Abebe Kebede', dept: 'Computer Science', quote: t('testimonial1'), rating: 5 },
                { name: 'Sara Mohammed', dept: 'Business Admin', quote: t('testimonial2'), rating: 5 },
                { name: 'Daniel Bekele', dept: 'Engineering', quote: t('testimonial3'), rating: 4 },
              ].map((t, i) => (
                <Card3D key={i} depth={10} className="h-full">
                  <Card className="rounded-3xl p-6 h-full flex flex-col justify-between">
                    <CardContent className="p-0">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-4 h-4 ${idx < t.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                        ))}
                      </div>
                      <p className="text-foreground/90 italic mb-6 leading-relaxed text-sm">"{t.quote}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-500 text-sm shadow-sm">
                          {t.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{t.name}</h4>
                          <p className="text-xs text-muted-foreground">{t.dept}, DBU</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Card3D>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA (FLOATING 3D GLASS STAGE) ═══════════════ */}
        <section className="py-24 relative overflow-hidden bg-transparent perspective-1200">
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <Card3D depth={8} className="w-full">
              <div className="relative p-10 md:p-16 rounded-3xl bg-gradient-to-b from-white/55 to-white/35 dark:from-black/45 dark:to-black/25 backdrop-blur-3xl border-0 shadow-2xl shadow-amber-500/15 text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="relative z-10">
                  <Card3DItem translateZ={35}>
                    <GraduationCap className="w-16 h-16 text-amber-500 mx-auto mb-6 drop-shadow-[0_4px_16px_rgba(245,158,11,0.6)]" />
                    <h2 className="text-4xl md:text-5xl font-black mb-6">{t('ctaTitle')}</h2>
                    <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
                      {t('ctaDescription')}
                    </p>
                  </Card3DItem>
                  
                  <Card3DItem translateZ={25}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link href="/register">
                        <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold btn-3d-golden">
                          {t('ctaButton')}
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border border-amber-500/30 hover:bg-amber-500/10 bg-black/20 backdrop-blur-md text-foreground font-semibold hover:scale-105 transition-all">
                          {t('signIn')}
                        </Button>
                      </Link>
                    </div>
                  </Card3DItem>
                </div>
              </div>
            </Card3D>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-white/45 dark:bg-black/35 backdrop-blur-2xl py-14 border-t border-amber-500/20 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1">
              <Link href="/" className="font-extrabold text-2xl text-foreground inline-block mb-4">
                EventHub <span className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">DBU</span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {t('footerTagline')}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-500" /> Debre Birhan, Ethiopia
              </div>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">{t('forStudents')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/events/discover" className="hover:text-amber-500 transition-colors">{t('discoverEvents')}</Link></li>
                <li><Link href="/dashboard/student" className="hover:text-amber-500 transition-colors">{t('myTickets')}</Link></li>
                <li><Link href="/dashboard/student/certificates" className="hover:text-amber-500 transition-colors">{t('certificates')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">{t('forOrganizers')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/dashboard/organizer/events/create" className="hover:text-amber-500 transition-colors">{t('createEvent')}</Link></li>
                <li><Link href="/dashboard/organizer" className="hover:text-amber-500 transition-colors">{t('dashboard')}</Link></li>
                <li><Link href="/dashboard/organizer/scanner" className="hover:text-amber-500 transition-colors">{t('qrScanner')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">{t('platform')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-amber-500 transition-colors">{t('signIn')}</Link></li>
                <li><Link href="/register" className="hover:text-amber-500 transition-colors">{t('createAccount')}</Link></li>
                <li><Link href="/dashboard/super-admin" className="hover:text-amber-500 transition-colors">{t('adminPanel')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 dark:border-amber-500/10 text-center text-sm text-muted-foreground font-medium">
            <p>© {new Date().getFullYear()} EventHub DBU · Debre Birhan University. {t('allRightsReserved')}</p>
          </div>
        </div>
      </footer>

      {/* 🎬 DEMO VIDEO MODAL */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="sm:max-w-[900px] p-1 bg-black/85 backdrop-blur-3xl border border-amber-500/35 rounded-3xl overflow-hidden shadow-2xl">
          <DialogTitle className="sr-only">EventHub Demo Video</DialogTitle>
          <DialogDescription className="sr-only">A 2-minute demonstration of the EventHub platform features.</DialogDescription>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
            {showDemo && (
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/V6vROw2610A?autoplay=1&mute=0" 
                title="EventHub Demo Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
