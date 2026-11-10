'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, CalendarDays, Clock, Copy, Download, QrCode, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

export default function TicketViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const { data: registration, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const res = await api.get(`/my/registrations/${id}`);
      return res.data.data;
    },
  });

  const { data: qrData } = useQuery({
    queryKey: ['ticket-qr', id],
    queryFn: async () => {
      const res = await api.get(`/registrations/${id}/qr`);
      return res.data.data;
    },
    enabled: !!registration,
  });

  const copyToken = () => {
    if (!registration?.qrToken) return;
    navigator.clipboard.writeText(registration.qrToken);
    setCopied(true);
    toast.success('QR Token copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    if (!qrData?.qrCode) return;
    const a = document.createElement('a');
    a.href = qrData.qrCode;
    a.download = `Ticket-${registration?.event?.slug || 'Event'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground font-bold">Loading your ticket...</div>;
  }

  if (!registration) {
    return <div className="p-12 text-center text-red-500 font-bold">Ticket not found.</div>;
  }

  const { event } = registration;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="text-muted-foreground hover:text-foreground font-bold -ml-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Tickets
      </Button>

      <div className="relative">
        <Card className="bg-card border-none shadow-2xl overflow-hidden">
          {/* Top banner / Image */}
          <div className="h-40 bg-gradient-to-r from-primary/80 to-primary relative">
            {event.bannerImage && (
              <img src={event.bannerImage} alt="Event Banner" className="w-full h-full object-cover mix-blend-overlay opacity-50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            <Badge className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
              {registration.status}
            </Badge>
          </div>

          <CardContent className="p-8 -mt-10 relative z-10 flex flex-col items-center text-center border-b border-border border-dashed">
            <h1 className="text-3xl font-bold text-foreground mb-2">{event.title}</h1>
            <p className="text-primary font-medium mb-6">{event.category?.name || 'General Event'}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full mb-8">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2 text-foreground">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold">{format(new Date(event.date), 'MMMM d, yyyy')}</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2 text-foreground">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold">{event.startTime} - {event.endTime}</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-2 text-foreground">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold">{event.location}</p>
              </div>
            </div>
          </CardContent>

          <CardContent className="p-8 bg-secondary/30 flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mb-6">Your Entry Pass</p>
            
            <div className="bg-white p-4 rounded-2xl shadow-xl mb-8 relative group">
              {qrData?.qrCode ? (
                <img src={qrData.qrCode} alt="QR Code" className="w-64 h-64 object-contain" />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-muted-foreground/30">
                  <QrCode className="w-32 h-32" />
                </div>
              )}
              
              {/* Token overlay for hovering */}
              {registration.qrToken && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
                  <p className="text-xs text-white/70 font-mono text-center break-all mb-4">
                    {registration.qrToken}
                  </p>
                  <Button size="sm" variant="secondary" className="font-bold" onClick={copyToken}>
                    {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Token'}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-4 w-full">
              <Button className="flex-1 font-bold" size="lg" variant="default" onClick={downloadQr}>
                <Download className="w-5 h-5 mr-2" /> Save to Device
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Decorative ticket cutouts */}
        <div className="absolute top-[280px] -left-4 w-8 h-8 rounded-full bg-background" />
        <div className="absolute top-[280px] -right-4 w-8 h-8 rounded-full bg-background" />
      </div>
    </div>
  );
}
