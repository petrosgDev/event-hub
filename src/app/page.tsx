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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative pt-20 pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-primary/15 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"></div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8 backdrop-blur-sm gap-2">
                <GraduationCap className="w-4 h-4" />
                <span className="font-medium">{t('heroBadge')}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground leading-[1.1]">
                {t('heroTitle1')}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-orange-400">{t('heroTitle2')}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                {t('heroDescription')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
                <Link href="/events/discover">
                  <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-[0_0_40px_rgba(255,215,0,0.25)]">
                    {t('exploreEvents')} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" onClick={() => setShowDemo(true)} className="h-14 px-8 text-lg rounded-full border-primary/30 hover:bg-primary/10 backdrop-blur-md font-semibold">
                  <Play className="mr-2 w-5 h-5 fill-primary text-primary" /> Watch Demo
                </Button>
                <Dialog open={showDemo} onOpenChange={setShowDemo}>
                  <DialogContent className="sm:max-w-[800px] bg-black/90 border-white/10 p-1">
                    <DialogTitle className="sr-only">Watch Demo</DialogTitle>
                    <DialogDescription className="sr-only">Platform demo video explaining UI/UX</DialogDescription>
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center relative">
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                        <Play className="w-16 h-16 text-primary mb-4 opacity-80" />
                        <h3 className="text-2xl font-bold mb-2">EventHub Platform Demo</h3>
                        <p className="text-muted-foreground max-w-md">
                          Discover how to create events, manage registrations, and track analytics on our premium platform.
                        </p>
                        <p className="text-xs text-primary mt-8">(Video placeholder - Connect your YouTube/Vimeo link here)</p>
                      </div>
                      <iframe 
                        className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity" 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                      </iframe>
                    </div>
                  </DialogContent>
                </Dialog>
                <Link href="/register">
                  <Button size="lg" variant="ghost" className="h-14 px-8 text-lg rounded-full hover:bg-white/5 backdrop-blur-md text-muted-foreground">
                    {t('joinAsOrganizer')}
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-white/10 pt-10">
                {[
                  { label: t('students'), value: stats?.students || '0+', icon: Users },
                  { label: t('eventsHosted'), value: stats?.events || '0+', icon: CalendarDays },
                  { label: t('organizers'), value: stats?.organizers || '0+', icon: Building2 },
                  { label: t('satisfaction'), value: stats?.satisfaction || '0%', icon: Heart },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <stat.icon className="w-5 h-5 text-primary mb-1" />
                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ BROWSE BY CATEGORY ═══════════════ */}
        <section className="py-16 bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-3">{t('browseByCategory')}</h2>
              <p className="text-muted-foreground">{t('browseByCategoryDesc')}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {(categories || []).slice(0, 10).map((cat: any) => (
                <Link key={cat.id} href={`/events/discover?category=${cat.slug}`}>
                  <div className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-secondary transition-all hover:-translate-y-1 cursor-pointer shadow-sm">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="text-sm font-bold text-center text-foreground">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ LIVE EVENTS FEED ═══════════════ */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('upcomingEvents')}</h2>
                <p className="text-muted-foreground">{t('upcomingEventsDesc')}</p>
              </div>
              <Link href="/events/discover">
                <Button variant="ghost" className="text-primary hover:bg-primary/10">
                  {t('viewAllEvents')} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {allEvents.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">{t('noEventsYet')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allEvents.slice(0, 6).map((event: any, i: number) => (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
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
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border text-xs font-bold">
                              {event.category?.name || 'Event'}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            {!event.isFree && event.price > 0 ? (
                              <Badge className="bg-orange-500/90 text-white text-xs font-bold">{event.price} ETB</Badge>
                            ) : (
                              <Badge className="bg-green-500/90 text-white text-xs font-bold">FREE</Badge>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                            <span className="text-white text-xs font-medium flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {format(new Date(event.date), 'MMM d, yyyy')}
                            </span>
                            <span className="text-white/80 text-xs flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.registeredCount}/{event.capacity}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-5 flex-grow flex flex-col">
                          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{event.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-grow">{event.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{event.location || 'Online'}</span>
                            <span className="mx-1">·</span>
                            <Clock className="w-3.5 h-3.5 shrink-0" />
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
        </section>

        {/* ═══════════════ CAMPUS MAP ═══════════════ */}
        <section className="py-20 bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <Badge className="bg-primary/10 text-primary border-primary/30 mb-4">{t('campusMap')}</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('findEventsOnCampus')}</h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  {t('campusMapDesc')}
                </p>
                <div className="space-y-3 mb-6">
                  {[
                    t('campusLoc1'),
                    t('campusLoc2'), 
                    t('campusLoc3'),
                    t('campusLoc4')
                  ].map((loc, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-foreground/80">{loc}</span>
                    </div>
                  ))}
                </div>
                <Link href="/events/discover">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <MapPin className="w-4 h-4 mr-2" /> {t('browseEventsNearYou')}
                  </Button>
                </Link>
              </div>
              <div className="rounded-2xl overflow-hidden border border-border shadow-2xl h-[400px]">
                <iframe 
                  width="100%" height="100%" frameBorder="0" scrolling="no"
                  src="https://maps.google.com/maps?q=Debre+Birhan+University&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="grayscale-[0.3] contrast-110"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuresTitle')}</h2>
              <p className="text-muted-foreground text-lg">{t('featuresSubtitle')}</p>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Ticket, title: t('feature1Title'), description: t('feature1Desc') },
                { icon: QrCode, title: t('feature2Title'), description: t('feature2Desc') },
                { icon: Zap, title: t('feature3Title'), description: t('feature3Desc') },
                { icon: BarChart3, title: t('feature4Title'), description: t('feature4Desc') },
                { icon: Award, title: t('feature5Title'), description: t('feature5Desc') },
                { icon: ShieldCheck, title: t('feature6Title'), description: t('feature6Desc') },
              ].map((feature, i) => (
                <motion.div key={i} variants={fadeIn} className="group p-7 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover:-translate-y-1 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section className="py-20 bg-secondary/30 border-y border-border relative overflow-hidden">
          <div className="absolute left-0 top-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('howItWorks')}</h2>
              <p className="text-muted-foreground text-lg">{t('howItWorksDesc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-14 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              {[
                { step: '1', title: t('step1Title'), desc: t('step1Desc'), icon: Globe },
                { step: '2', title: t('step2Title'), desc: t('step2Desc'), icon: Ticket },
                { step: '3', title: t('step3Title'), desc: t('step3Desc'), icon: QrCode },
                { step: '4', title: t('step4Title'), desc: t('step4Desc'), icon: Trophy },
              ].map((item, i) => (
                <div key={i} className="relative flex flex-col items-center text-center group">
                  <div className="w-28 h-28 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,215,0,0.08)] group-hover:scale-110 group-hover:border-primary/60 transition-all relative z-10">
                    <item.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('whatStudentsSay')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: 'Abebe Kebede', dept: 'Computer Science', quote: t('testimonial1'), rating: 5 },
                { name: 'Sara Mohammed', dept: 'Business Admin', quote: t('testimonial2'), rating: 5 },
                { name: 'Daniel Bekele', dept: 'Engineering', quote: t('testimonial3'), rating: 4 },
              ].map((t, i) => (
                <Card key={i} className="bg-card border-border hover:border-primary/30 transition-colors shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className={`w-4 h-4 ${idx < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} />
                      ))}
                    </div>
                    <p className="text-foreground/90 italic mb-6 leading-relaxed text-sm">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{t.name}</h4>
                        <p className="text-xs text-muted-foreground">{t.dept}, DBU</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA ═══════════════ */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[120px]"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <GraduationCap className="w-14 h-14 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">{t('ctaTitle')}</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              {t('ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(255,215,0,0.25)]">
                  {t('ctaButton')}
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-white/20 hover:bg-white/10 bg-black/50 backdrop-blur-md">
                  {t('signIn')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-card py-14 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1">
              <Link href="/" className="font-bold text-2xl text-primary inline-block mb-4">
                EventHub <span className="text-foreground">DBU</span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {t('footerTagline')}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" /> Debre Birhan, Ethiopia
              </div>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">{t('forStudents')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/events/discover" className="hover:text-primary transition-colors">{t('discoverEvents')}</Link></li>
                <li><Link href="/dashboard/student" className="hover:text-primary transition-colors">{t('myTickets')}</Link></li>
                <li><Link href="/dashboard/student/certificates" className="hover:text-primary transition-colors">{t('certificates')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">{t('forOrganizers')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/dashboard/organizer/events/create" className="hover:text-primary transition-colors">{t('createEvent')}</Link></li>
                <li><Link href="/dashboard/organizer" className="hover:text-primary transition-colors">{t('dashboard')}</Link></li>
                <li><Link href="/dashboard/organizer/scanner" className="hover:text-primary transition-colors">{t('qrScanner')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">{t('platform')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-primary transition-colors">{t('signIn')}</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">{t('createAccount')}</Link></li>
                <li><Link href="/dashboard/super-admin" className="hover:text-primary transition-colors">{t('adminPanel')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} EventHub DBU · Debre Birhan University. {t('allRightsReserved')}</p>
          </div>
        </div>
      </footer>

      {/* 🎬 DEMO VIDEO MODAL */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="sm:max-w-[900px] p-1 bg-card border-border">
          <DialogTitle className="sr-only">EventHub Demo Video</DialogTitle>
          <DialogDescription className="sr-only">A 2-minute demonstration of the EventHub platform features.</DialogDescription>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
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
