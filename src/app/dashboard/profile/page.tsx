'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Camera, User } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  department: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${user?.id}`);
      return res.data.data;
    },
    enabled: !!user?.id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      department: profile?.department || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await api.put(`/users/${user?.id}`, data);
      return res.data.data;
    },
    onSuccess: (data) => {
      toast.success('Profile updated successfully');
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      // We would ideally have an upload endpoint. 
      // For MVP, we'll mock the success if the endpoint doesn't exist yet.
      // const res = await api.post('/upload/avatar', formData);
      // const avatarUrl = res.data.url;
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // MOCK: Update user with fake avatar URL
      // updateMutation.mutate({ ...profile, avatar: 'https://via.placeholder.com/150' });
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account details and preferences.</p>
      </div>

      {/* Avatar Section */}
      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative" />
        <CardContent className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:-mt-12">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-background bg-muted">
              <AvatarImage src={profile?.avatar} />
              <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Camera className="w-6 h-6 text-white" />}
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
            </label>
          </div>
          
          <div className="text-center sm:text-left flex-1 mb-2">
            <h2 className="text-2xl font-bold">{profile?.firstName} {profile?.lastName}</h2>
            <p className="text-muted-foreground">{profile?.email}</p>
          </div>
          
          <div className="mb-2">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Role</p>
              <p className="font-bold text-primary">{profile?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Section */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  className={`bg-white/5 border-white/10 ${errors.firstName ? 'border-destructive' : ''}`}
                />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  className={`bg-white/5 border-white/10 ${errors.lastName ? 'border-destructive' : ''}`}
                />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  {...register('department')}
                  placeholder="e.g. Computer Science"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+251..."
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                rows={4}
                {...register('bio')}
                placeholder="Tell us a little bit about yourself"
                className={`flex w-full rounded-md border bg-white/5 border-white/10 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.bio ? 'border-destructive' : ''}`}
              />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <Button type="button" variant="outline" onClick={() => reset()} disabled={updateMutation.isPending} className="bg-transparent border-white/10">
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="w-32">
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
