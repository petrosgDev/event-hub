'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    try {
      setIsLoading(true);

      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      const { user, accessToken } = response.data.data;
      
      setAuth(user, accessToken);
      toast.success('Welcome back!');
      
      switch (user.role) {
        case 'SUPER_ADMIN':
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'ORGANIZER':
          router.push('/dashboard/organizer');
          break;
        default:
          router.push('/dashboard/student');
      }
    } catch (error: any) {
      toast.error('Login failed. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Sign in with your Debre Birhan University credentials</p>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={onSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground text-sm font-semibold">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@dbu.edu.et"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/50 dark:bg-black/30 border-white/30 dark:border-amber-500/20 rounded-2xl h-12 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-amber-500/40"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-muted-foreground text-sm font-semibold">Password</Label>
                <Link href="#" className="text-xs text-amber-500 hover:text-amber-400 font-semibold">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white/50 dark:bg-black/30 border-white/30 dark:border-amber-500/20 rounded-2xl h-12 text-base pr-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-amber-500/40"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-base font-bold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-amber-500/25 mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground font-medium">
                Don't have an account?{' '}
                <Link href="/register" className="text-amber-500 font-bold hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
