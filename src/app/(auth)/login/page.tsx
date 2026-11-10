'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={onSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground text-base">Enter Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@dbu.edu.et"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/5 border-white/10 h-12 text-lg"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground text-base">Enter Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 h-12 text-lg pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold mt-4" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
