'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3, TrendingUp, Users, Calendar, Ticket, Eye, DollarSign
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function OrganizerAnalyticsPage() {
  const { user } = useAuthStore();

  const { data: eventsData } = useQuery({
    queryKey: ['organizer-events'],
    queryFn: async () => {
      const res = await api.get('/events/my-events');
      return res.data.data;
    },
  });

  const events = eventsData?.events || eventsData || [];

  const totalRegistrations = events.reduce((sum: number, e: any) => sum + (e.registeredCount || 0), 0);
  const totalCapacity = events.reduce((sum: number, e: any) => sum + (e.capacity || 0), 0);
  const totalViews = events.reduce((sum: number, e: any) => sum + (e.viewCount || 0), 0);
  const totalRevenue = events
    .filter((e: any) => !e.isFree)
    .reduce((sum: number, e: any) => sum + ((e.price || 0) * (e.registeredCount || 0)), 0);
  const fillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  const chartData = events.slice(0, 6).map((e: any) => ({
    name: e.title?.substring(0, 15) + (e.title?.length > 15 ? '...' : ''),
    registrations: e.registeredCount || 0,
    capacity: e.capacity || 0,
    views: e.viewCount || 0,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" /> Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Performance overview for your events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Events', value: events.length, icon: Calendar, color: 'text-primary' },
          { title: 'Total Registrations', value: totalRegistrations.toLocaleString(), icon: Users, color: 'text-green-400' },
          { title: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'text-blue-400' },
          { title: 'Fill Rate', value: `${fillRate}%`, icon: TrendingUp, color: 'text-orange-400' },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <h3 className="text-xl font-bold text-foreground">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estimated Revenue */}
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Gross Revenue</p>
              <h3 className="text-2xl font-bold text-primary">{totalRevenue.toLocaleString()} ETB</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Event Performance</CardTitle>
            <CardDescription>Registrations vs Capacity for your events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="registrations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="capacity" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Table */}
      {events.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Event Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="p-4 font-medium">Event</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Registrations</th>
                    <th className="p-4 font-medium text-right">Views</th>
                    <th className="p-4 font-medium text-right">Fill Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: any) => {
                    const rate = event.capacity > 0 ? Math.round((event.registeredCount / event.capacity) * 100) : 0;
                    return (
                      <tr key={event.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium text-foreground max-w-[200px] truncate">{event.title}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={`text-xs ${event.status === 'PUBLISHED' ? 'border-green-500/30 text-green-400' : 'border-yellow-500/30 text-yellow-400'}`}>
                            {event.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right text-foreground">{event.registeredCount || 0}/{event.capacity || 0}</td>
                        <td className="p-4 text-right text-muted-foreground">{event.viewCount || 0}</td>
                        <td className="p-4 text-right">
                          <span className={`font-bold ${rate >= 80 ? 'text-green-400' : rate >= 50 ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                            {rate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
