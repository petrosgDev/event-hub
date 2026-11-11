'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Search, Users, Mail, Shield, Calendar, Building2, MoreHorizontal,
  UserCheck, UserX, Loader2
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async () => {
      const res = await api.get('/users?limit=200');
      return res.data;
    },
  });

  const users = usersData?.data || [];
  const filteredUsers = users.filter((u: any) => {
    const matchesSearch =
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-primary/20 text-primary border-primary/30';
      case 'ADMIN': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'ORGANIZER': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'STUDENT': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const roleCounts = {
    all: users.length,
    STUDENT: users.filter((u: any) => u.role === 'STUDENT').length,
    ORGANIZER: users.filter((u: any) => u.role === 'ORGANIZER').length,
    ADMIN: users.filter((u: any) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-muted-foreground text-sm mt-1">View and manage all platform users</p>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Users', icon: Users },
          { key: 'STUDENT', label: 'Students', icon: UserCheck },
          { key: 'ORGANIZER', label: 'Organizers', icon: Building2 },
          { key: 'ADMIN', label: 'Admins', icon: Shield },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={roleFilter === tab.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRoleFilter(tab.key)}
            className={`gap-2 rounded-full ${roleFilter === tab.key ? 'bg-primary text-primary-foreground' : 'bg-card border-border text-foreground'}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-white/10">
              {roleCounts[tab.key as keyof typeof roleCounts]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-10 bg-card border-border"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Grid (Rounded Edge Rectangle Glass Cards) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 w-full rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="py-16 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-base">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user: any) => (
            <Card 
              key={user.id} 
              className="group flex flex-col justify-between rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div>
                {/* Top Row: Avatar & Status Chips */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/30 flex items-center justify-center text-primary font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge className={`text-xs ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </Badge>
                    {user.isVerified ? (
                      <Badge variant="outline" className="text-[11px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                        <UserCheck className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[11px] border-amber-500/30 text-amber-400 bg-amber-500/10">
                        <UserX className="w-3 h-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {user.firstName} {user.lastName}
                  </h3>
                  
                  <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.department && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{user.department}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 dark:border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                <span>Joined {user.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'Recently'}</span>
                <span className="font-mono text-[10px] bg-white/40 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
