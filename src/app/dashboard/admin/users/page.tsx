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

      {/* Users List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredUsers.map((user: any) => (
            <Card key={user.id} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          {user.email}
                        </span>
                        {user.department && (
                          <span className="hidden sm:flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {user.department}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge className={`text-xs ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </Badge>
                    {user.isVerified ? (
                      <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                        <UserCheck className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                        <UserX className="w-3 h-3 mr-1" /> Pending
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground hidden md:block">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : ''}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
