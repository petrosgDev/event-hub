'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card3D, Card3DItem } from '@/components/ui/card-3d';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-transparent font-sans perspective-1200 py-12 px-4">
      {/* 3D Perspective Ground Grid & Golden Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="perspective-grid" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
      </div>
      
      {/* Top Left Floating Back to Home button (Always visible on all screen sizes) */}
      <Link 
        href="/" 
        className="fixed top-5 left-5 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-xl border-0 shadow-lg shadow-black/20 hover:scale-105 transition-all text-sm font-bold text-foreground group"
      >
        <ArrowLeft className="w-4 h-4 text-amber-500 group-hover:-translate-x-1 transition-transform" />
        <span>Back to <span className="text-amber-500">EventHub</span></span>
      </Link>

      {/* Centered Form Container (Single, Clean 3D Glass Box) */}
      <div className="relative z-10 w-full max-w-lg">
        <Card3D depth={8}>
          <div className="bg-white/45 dark:bg-black/40 backdrop-blur-3xl border-0 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.25)] dark:shadow-[0_35px_80px_rgba(0,0,0,0.85)] p-8 md:p-10 overflow-hidden relative">
            <Card3DItem translateZ={25}>
              {children}
            </Card3DItem>
          </div>
        </Card3D>
      </div>
      
      <div className="relative z-10 text-xs text-muted-foreground font-medium mt-4">
        © {new Date().getFullYear()} EventHub DBU · Debre Birhan University.
      </div>
    </div>
  );
}
