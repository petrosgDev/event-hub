'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  CalendarDays, Users, Activity, Star, QrCode,
  ArrowRight, MoreVertical, Edit, Search, MessageSquare, TrendingUp,
  FileText, CheckCircle2, ChevronRight, Building2, Loader2, Banknote
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function OrganizerDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'crm'>('overview');
  const [isPaying, setIsPaying] = useState(false);

  /* ── Fetch organizer's events ── */
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['organizer-events'],
    queryFn: async () => {
      const res = await api.get('/events/my/events');
      return res.data.data;
    },
  });

  const events = eventsData || [];
  const publishedEvents = events.filter((e: any) => e.status === 'PUBLISHED');
  const draftEvents = events.filter((e: any) => e.status === 'DRAFT');
  const completedEvents = events.filter((e: any) => e.status === 'COMPLETED');

  /* ── Fetch organizer's commissions/earnings ── */
  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: ['organizer-earnings'],
    queryFn: async () => {
      const res = await api.get('/commissions/my-earnings');
      return res.data.data;
    },
  });

  const netEarnings = earningsData?.totals?.netEarnings || 0;

  // Calculate stats
  const totalRegistrations = events.reduce((acc: number, evt: any) => acc + (evt.registeredCount || 0), 0);
  const totalCapacity = events.reduce((acc: number, evt: any) => acc + (evt.capacity || 0), 0);
  const attendanceRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  // Mock attendance data for chart
  const attendanceData = [
    { name: 'Jan', attendance: 400 },
    { name: 'Feb', attendance: 300 },
    { name: 'Mar', attendance: 550 },
    { name: 'Apr', attendance: 450 },
    { name: 'May', attendance: 700 },
    { name: 'Jun', attendance: 650 },
  ];

  const handlePayWorkspace = async () => {
    try {
      setIsPaying(true);
      const res = await api.post('/users/workspace/pay');
      if (res.data.data.checkoutUrl) {
        window.location.href = res.data.data.checkoutUrl;
      }
    } catch (error: any) {
      console.error(error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  if (user && !user.hasPaidWorkspace) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center space-y-6">
        <div className="w-20 h-20 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold">Activate Your Workspace</h1>
        <p className="text-muted-foreground text-lg">
          To start creating events and managing attendees, you need to activate your Organizer Workspace. The subscription fee is 1,000 ETB.
        </p>
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-medium">Workspace Subscription</span>
            <span className="text-2xl font-bold">1,000 ETB</span>
          </div>
          <Button onClick={handlePayWorkspace} disabled={isPaying} className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 text-white">
            {isPaying ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
            Pay with Chapa
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Payments are securely processed via Chapa. You will be redirected.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Event Studio</h1>
          <p className="text-muted-foreground mt-1">Manage events, track attendance, and analyze engagement.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/organizer/scanner">
            <Button variant="outline" className="border-primary/50 text-primary bg-primary/5 hover:bg-primary/10">
              <QrCode className="w-4 h-4 mr-2" /> Scanner
            </Button>
          </Link>
          <Link href="/dashboard/organizer/events/create">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <CalendarDays className="w-4 h-4 mr-2" /> Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Events', value: events.length, icon: CalendarDays, color: 'text-primary', trend: `${publishedEvents.length} active` },
          { title: 'Total Registrations', value: totalRegistrations, icon: Users, color: 'text-orange-400', trend: `${totalCapacity} total capacity` },
          { title: 'Net Earnings', value: earningsLoading ? '...' : `Br ${netEarnings.toLocaleString()}`, icon: Banknote, color: 'text-green-400', trend: 'After platform fee' },
          { title: 'Avg Event Rating', value: '4.8/5', icon: Star, color: 'text-yellow-400', trend: 'From 124 reviews' },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.trend}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Analytics & Events */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Attendance Analytics */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>Participation over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="attendance" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Event Management Table */}
          <Card className="bg-white/5 border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <CardTitle>Recent Events</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-white/5 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Event Name</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Attendees</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {eventsLoading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading events...</td></tr>
                  ) : events.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No events created yet.</td></tr>
                  ) : (
                    events.slice(0, 5).map((evt: any) => (
                      <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground max-w-[200px] truncate">{evt.title}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {evt.date ? format(new Date(evt.date), 'MMM d, yyyy') : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={
                            evt.status === 'PUBLISHED' ? 'border-primary text-primary' :
                            evt.status === 'COMPLETED' ? 'border-green-500 text-green-500' :
                            'border-muted-foreground text-muted-foreground'
                          }>
                            {evt.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {evt.registeredCount ?? 0} / {evt.capacity}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/organizer/events/${evt.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 hover:text-primary">
                              Manage <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Quick Tools */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <Card className="bg-gradient-to-br from-primary/20 to-black border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <CardContent className="p-6 relative z-10 space-y-4">
              <h3 className="text-xl font-bold mb-4 text-white">Organizer Tools</h3>
              
              <Link href="/dashboard/organizer/scanner" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">QR Check-in Scanner</h4>
                    <p className="text-xs text-white/60">Scan tickets at the door</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/dashboard/organizer/events/create" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-orange-400/20 flex items-center justify-center text-orange-400">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Create New Event</h4>
                    <p className="text-xs text-white/60">Launch your next experience</p>
                  </div>
                </div>
              </Link>
              
              <Link href="#" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-green-400/20 flex items-center justify-center text-green-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Issue Certificates</h4>
                    <p className="text-xs text-white/60">Generate bulk certificates</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Feedback Insights */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3 border-b border-white/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Recent Feedback
                </CardTitle>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <span className="text-xs font-bold">4.8</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/10">
                {[
                  { user: 'Student A', evt: 'Global Tech Summit', rating: 5, comment: 'Amazing content and organization. The QR check-in was incredibly fast!' },
                  { user: 'Student B', evt: 'AI Workshop', rating: 4, comment: 'Great speaker, but the room was a bit crowded.' },
                  { user: 'Student C', evt: 'Startup Pitch', rating: 5, comment: 'Loved the networking session.' },
                ].map((fb, i) => (
                  <div key={i} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-foreground">{fb.user}</p>
                        <p className="text-xs text-muted-foreground">{fb.evt}</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3 h-3 ${idx < fb.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed italic">"{fb.comment}"</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-white/10">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">View All Feedback</Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
