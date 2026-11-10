'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, UserCheck, CalendarDays, Activity, 
  ShieldAlert, UserX, BrainCircuit, TrendingUp, BarChart3, Zap, Banknote, Percent
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

import Link from 'next/link';

const growthData = [
  { name: 'Jan', users: 1000, events: 40 },
  { name: 'Feb', users: 2500, events: 85 },
  { name: 'Mar', users: 4200, events: 150 },
  { name: 'Apr', users: 8000, events: 210 },
  { name: 'May', users: 15000, events: 350 },
  { name: 'Jun', users: 24000, events: 480 },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const { data: commissionsData, isLoading: commLoading } = useQuery({
    queryKey: ['admin-commissions'],
    queryFn: async () => {
      const res = await api.get('/commissions/earnings');
      return res.data.data;
    },
  });

  const { data: configData } = useQuery({
    queryKey: ['admin-commission-config'],
    queryFn: async () => {
      const res = await api.get('/commissions/config');
      return res.data.data;
    },
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/overview');
      return res.data.data;
    },
  });

  const totals = commissionsData?.totals || { totalVolume: 0, platformRevenue: 0 };
  const currentRate = configData?.config?.rate || 10;
  
  const totalUsers = analyticsData?.totalUsers || 0;
  const totalEvents = analyticsData?.totalEvents || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/20">Download Full Report</Button>
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, color: 'text-primary' },
          { title: 'Active Organizers', value: '842', icon: UserCheck, color: 'text-orange-400' },
          { title: 'Total Events', value: totalEvents.toLocaleString(), icon: CalendarDays, color: 'text-yellow-400' },
          { title: 'Platform Engagement', value: '94%', icon: Activity, color: 'text-green-400' },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue & Commissions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Banknote className="w-4 h-4 text-green-400" /> Platform Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {commLoading ? (
               <div className="h-9 bg-white/10 animate-pulse rounded w-1/2"></div>
            ) : (
               <h3 className="text-3xl font-bold text-green-400">Br {totals.platformRevenue.toLocaleString()}</h3>
            )}
            <p className="text-xs text-muted-foreground mt-1">Total commission earned</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Total Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            {commLoading ? (
               <div className="h-9 bg-white/10 animate-pulse rounded w-1/2"></div>
            ) : (
               <h3 className="text-3xl font-bold text-foreground">Br {totals.totalVolume.toLocaleString()}</h3>
            )}
            <p className="text-xs text-muted-foreground mt-1">Gross ticket sales</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 relative overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" /> Current Commission Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-end">
            <div>
              <h3 className="text-3xl font-bold text-primary">{currentRate}%</h3>
              <p className="text-xs text-muted-foreground mt-1">Applied to all paid events</p>
            </div>
            <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all">Change Rate</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Analytics & Moderation */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Analytics Section */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Platform Growth Analytics</CardTitle>
                <CardDescription>Monthly growth trends for users and events</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 bg-white/5">Users</Button>
                <Button variant="ghost" size="sm" className="h-8">Events</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Moderation & Management */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-4 border-b border-white/10">
              <CardTitle>Moderation & Management</CardTitle>
              <CardDescription>Quick actions for platform administration</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                {[
                  { title: 'Manage Users', desc: 'Suspend, verify, edit', icon: Users, href: '/dashboard/admin/users' },
                  { title: 'Organizers', desc: 'Approve applications', icon: UserCheck, href: '/dashboard/admin/users' },
                  { title: 'Event Approvals', desc: 'Review flagged events', icon: ShieldAlert, href: '/dashboard/admin/events' },
                  { title: 'System Reports', desc: 'Export platform data', icon: BarChart3, href: '/dashboard/admin/settings' },
                ].map((action, i) => (
                  <Link key={i} href={action.href} className="p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer group block">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <action.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Insights Panel */}
        <div className="space-y-8">
          
          <Card className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-primary" /> AI Insights Panel
              </CardTitle>
              <CardDescription>Real-time predictive analytics generated by AI</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Predicted Attendance Trends</h4>
                    <p className="text-xs text-muted-foreground">Expect a 25% surge in registrations for "Technology" category events next week due to mid-term completion.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Most Engaging Categories</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="bg-white/10">1. Technology (45%)</Badge>
                      <Badge variant="secondary" className="bg-white/10">2. Business (20%)</Badge>
                      <Badge variant="secondary" className="bg-white/10">3. Arts (15%)</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400"></div>
                <div className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Best Performing Organizers</h4>
                    <p className="text-xs text-muted-foreground">"Tech Club DBU" and "Entrepreneurship Society" currently have the highest attendee retention rate (92%).</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive"></div>
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Risk Detection</h4>
                    <p className="text-xs text-muted-foreground">3 events currently scheduled for the same venue (Main Auditorium) on Friday. Potential conflict detected.</p>
                    <Button variant="outline" size="sm" className="mt-3 h-7 text-xs border-destructive text-destructive hover:bg-destructive hover:text-white">Resolve Conflict</Button>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
