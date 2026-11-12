import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'EventHub DBU — AI-Powered Campus Event Management',
  description: 'The ultimate platform for university events at Debre Birhan University.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased relative selection:bg-amber-500/20 selection:text-amber-400">
        {/* Ambient Glassmorphic Golden Glow Orbs (Pure University Golden Light) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* 3D Perspective Grid Horizon */}
          <div className="perspective-grid" />
          
          {/* Top-center golden ambient burst */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full bg-gradient-to-b from-amber-400/20 via-yellow-500/12 to-transparent blur-[140px] opacity-80 animate-float" />
          {/* Right golden/amber orb */}
          <div className="absolute top-1/4 -right-24 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-amber-500/18 via-yellow-600/10 to-transparent blur-[160px] opacity-70 animate-float-delayed" />
          {/* Left warm amber orb */}
          <div className="absolute top-2/3 -left-28 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-yellow-500/15 via-amber-600/10 to-transparent blur-[160px] opacity-65 animate-float" />
          {/* Bottom center deep golden glow */}
          <div className="absolute -bottom-32 left-1/3 w-[700px] h-[500px] rounded-full bg-gradient-to-t from-amber-500/15 via-yellow-500/10 to-transparent blur-[160px] opacity-60" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
