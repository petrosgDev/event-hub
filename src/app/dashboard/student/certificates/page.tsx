'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Award, Download, ExternalLink, Calendar } from 'lucide-react';

export default function StudentCertificatesPage() {
  const { data: attendance, isLoading } = useQuery({
    queryKey: ['my-attendance'],
    queryFn: async () => {
      const res = await api.get('/attendance/my');
      // For MVP, we'll treat any confirmed attendance as earning a certificate
      return res.data.data.filter((record: any) => record.status === 'ATTENDED');
    },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
        <p className="text-muted-foreground">View and download certificates from events you've attended.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
        ) : attendance?.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-medium mb-2">No certificates yet</h3>
            <p className="text-muted-foreground">Attend events to earn certificates automatically.</p>
          </div>
        ) : (
          attendance?.map((record: any, i: number) => (
            <motion.div key={record.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-gradient-to-br from-card to-card border-white/10 hover:border-primary/50 transition-all overflow-hidden group">
                <div className="h-32 bg-primary/10 relative flex items-center justify-center p-6 text-center border-b border-white/10">
                  <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay"></div>
                  <Award className="w-12 h-12 text-primary opacity-20 absolute" />
                  <h3 className="font-bold text-lg z-10 line-clamp-2">{record.event.title}</h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Issued Date</span>
                      <span className="font-medium">{format(new Date(record.checkedInAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Verify ID</span>
                      <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">{record.id.split('-')[0].toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1" onClick={() => window.alert('Downloading PDF... (Mock)')}>
                      <Download className="w-4 h-4 mr-2" /> PDF
                    </Button>
                    <Button variant="outline" className="flex-1 border-white/10" onClick={() => window.alert('Opening verifiable link... (Mock)')}>
                      <ExternalLink className="w-4 h-4 mr-2" /> Verify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
