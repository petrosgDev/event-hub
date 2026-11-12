'use client';

import { useState } from 'react';
import * as z from 'zod';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterFormValues>>({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateField = (field: keyof RegisterFormValues, value: string) => {
    let errorMsg: string | undefined = undefined;
    
    if (field === 'firstName' && value.length < 2) errorMsg = 'First name is required';
    if (field === 'lastName' && value.length < 2) errorMsg = 'Last name is required';
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMsg = 'Please enter a valid email address';
    if (field === 'password') {
      if (value.length < 8) errorMsg = 'Password must be at least 8 characters';
      else if (!/[A-Z]/.test(value)) errorMsg = 'Must contain an uppercase letter';
      else if (!/[0-9]/.test(value)) errorMsg = 'Must contain a number';
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    return !errorMsg;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof RegisterFormValues, value);
    
    if (name === 'confirmPassword' || name === 'password') {
      const confirmVal = name === 'confirmPassword' ? value : formData.confirmPassword;
      const passVal = name === 'password' ? value : formData.password;
      
      if (confirmVal && confirmVal !== passVal) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords don't match" }));
      } else if (confirmVal) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      }
    }
  };

  const nextStep = () => {
    const fValid = validateField('firstName', formData.firstName);
    const lValid = validateField('lastName', formData.lastName);
    if (fValid && lValid && formData.firstName && formData.lastName) {
      setStep(2);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      registerSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: any = {};
        error.issues.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    try {
      setIsLoading(true);
      const res = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'STUDENT',
      });
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success('Account created successfully!');
      router.push('/dashboard/student');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 text-center">
        <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">Create Account</CardTitle>
        <CardDescription className="text-muted-foreground text-sm mt-1">
          Join EventHub to discover amazing events at Debre Birhan University
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-amber-500 shadow-sm shadow-amber-500/50' : 'bg-white/20'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-amber-500 shadow-sm shadow-amber-500/50' : 'bg-white/20'}`} />
        </div>

        <form onSubmit={onSubmit} className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-muted-foreground text-sm font-semibold">First name</Label>
                    <Input
                      id="firstName" name="firstName"
                      placeholder="Abebe"
                      value={formData.firstName} onChange={handleChange}
                      className={`bg-white/50 dark:bg-black/30 border-white/30 dark:border-amber-500/20 rounded-2xl h-12 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-amber-500/40 ${errors.firstName ? 'border-destructive' : ''}`}
                    />
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-muted-foreground text-sm font-semibold">Last name</Label>
                    <Input
                      id="lastName" name="lastName"
                      placeholder="Kebede"
                      value={formData.lastName} onChange={handleChange}
                      className={`bg-white/50 dark:bg-black/30 border-white/30 dark:border-amber-500/20 rounded-2xl h-12 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-amber-500/40 ${errors.lastName ? 'border-destructive' : ''}`}
                    />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                  </div>
                </div>
                <Button type="button" onClick={nextStep} className="w-full h-12 text-base font-bold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground btn-3d-golden mt-6">
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground text-sm font-semibold">University Email</Label>
                  <Input
                    id="email" name="email" type="email"
                    placeholder="student@dbu.edu.et"
                    value={formData.email} onChange={handleChange}
                    className={`bg-white/50 dark:bg-black/30 border-white/30 dark:border-amber-500/20 rounded-2xl h-12 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-amber-500/40 ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-muted-foreground text-sm font-semibold">Password</Label>
                  <div className="relative">
                    <Input
                      id="password" name="password" type={showPassword ? "text" : "password"}
                      value={formData.password} onChange={handleChange}
                      placeholder="••••••••"
                      className={`bg-white/50 dark:bg-black/30 border-white/30 dark:border-amber-500/20 rounded-2xl h-12 text-base pr-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-amber-500/40 ${errors.password ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-muted-foreground text-sm font-semibold">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword} onChange={handleChange}
                      placeholder="••••••••"
                      className={`bg-white/50 dark:bg-black/30 border-white/30 dark:border-amber-500/20 rounded-2xl h-12 text-base pr-11 text-foreground placeholder:text-muted-foreground focus-visible:ring-amber-500/40 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="px-4 rounded-2xl bg-white/40 dark:bg-black/30 border-white/30 dark:border-amber-500/20 hover:bg-amber-500/10">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button type="submit" className="flex-1 h-12 text-base font-bold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground btn-3d-golden" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>
      <CardFooter className="px-0 justify-center text-sm text-muted-foreground mt-4">
        Already have an account?{' '}
        <Link href="/login" className="ml-1 text-amber-500 hover:underline font-bold">
          Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
