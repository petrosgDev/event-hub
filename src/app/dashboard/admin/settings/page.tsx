'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Settings, Percent, Globe, Bell, Shield, Save, Loader2, Check
} from 'lucide-react';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [commissionRate, setCommissionRate] = useState('');

  const { data: configData, isLoading } = useQuery({
    queryKey: ['admin-commission-config'],
    queryFn: async () => {
      const res = await api.get('/commissions/config');
      const rate = res.data.data?.config?.rate || 10;
      setCommissionRate(String(rate));
      return res.data.data;
    },
  });

  const updateRateMutation = useMutation({
    mutationFn: async (rate: number) => {
      await api.put('/commissions/config', { rate });
    },
    onSuccess: () => {
      toast.success('Commission rate updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-commission-config'] });
    },
    onError: () => {
      toast.error('Failed to update commission rate');
    },
  });

  const currentRate = configData?.config?.rate || 10;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> Platform Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Configure platform-wide settings and policies</p>
      </div>

      {/* Commission Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" /> Commission Rate
          </CardTitle>
          <CardDescription>Set the platform commission percentage deducted from paid event ticket sales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <Label htmlFor="rate" className="text-sm text-muted-foreground mb-2 block">Rate (%)</Label>
              <div className="relative">
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="bg-background border-border h-12 text-lg pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">%</span>
              </div>
            </div>
            <div className="pt-7">
              <Button
                onClick={() => updateRateMutation.mutate(Number(commissionRate))}
                disabled={updateRateMutation.isPending || Number(commissionRate) === currentRate}
                className="h-12 px-6"
              >
                {updateRateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Current rate: <span className="text-primary font-bold">{currentRate}%</span> · 
            This means for every 100 ETB ticket sold, the platform keeps {currentRate} ETB and the organizer receives {100 - currentRate} ETB.
          </p>
        </CardContent>
      </Card>

      {/* Platform Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" /> Platform Information
          </CardTitle>
          <CardDescription>General platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Platform Name</Label>
              <Input value="EventHub DBU" disabled className="bg-background/50 border-border" />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">University</Label>
              <Input value="Debre Birhan University" disabled className="bg-background/50 border-border" />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Domain</Label>
              <Input value="dbu.edu.et" disabled className="bg-background/50 border-border" />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Payment Provider</Label>
              <Input value="Chapa" disabled className="bg-background/50 border-border" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" /> Notifications
          </CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Email new event notifications to admin', enabled: true },
              { label: 'Alert on high-capacity events (>80% full)', enabled: true },
              { label: 'Weekly platform report digest', enabled: false },
              { label: 'Organizer payout request alerts', enabled: true },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-foreground">{pref.label}</span>
                <Badge variant={pref.enabled ? 'default' : 'secondary'} className={`text-xs ${pref.enabled ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                  {pref.enabled ? <><Check className="w-3 h-3 mr-1" /> On</> : 'Off'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" /> Security
          </CardTitle>
          <CardDescription>Security and access control settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Require email verification for new accounts', enabled: true },
              { label: 'Two-factor authentication for admin access', enabled: false },
              { label: 'Auto-suspend accounts after 5 failed login attempts', enabled: true },
              { label: 'Require university email domain (@dbu.edu.et)', enabled: true },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-foreground">{pref.label}</span>
                <Badge variant={pref.enabled ? 'default' : 'secondary'} className={`text-xs ${pref.enabled ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                  {pref.enabled ? <><Check className="w-3 h-3 mr-1" /> On</> : 'Off'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
