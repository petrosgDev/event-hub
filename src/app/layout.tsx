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
      <body className="min-h-screen bg-[#f8fafc] dark:bg-[#090a10] font-sans antialiased relative selection:bg-primary/30 selection:text-primary overflow-x-hidden">
        {/* Luminous High-Visibility Ambient Glassmorphism Glow Mesh */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Top-Left Radiant Violet/Fuchsia Aura */}
          <div className="absolute -top-48 -left-32 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-violet-600/50 via-purple-500/40 to-fuchsia-500/30 blur-[130px] animate-float" />
          
          {/* Top-Right University Amber/Sunset Glow */}
          <div className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-amber-400/50 via-orange-500/45 to-rose-500/30 blur-[140px] animate-float-delayed" />
          
          {/* Center Electric Cyan/Sky Orb */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-400/35 via-blue-600/35 to-indigo-600/30 blur-[160px] animate-float" />
          
          {/* Bottom-Left Emerald/Spring Aura */}
          <div className="absolute top-2/3 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-500/40 via-teal-500/35 to-cyan-500/25 blur-[150px] animate-float-delayed" />
          
          {/* Bottom-Right Deep Magenta/Amber Flame */}
          <div className="absolute -bottom-48 -right-20 w-[800px] h-[800px] rounded-full bg-gradient-to-tl from-primary/50 via-orange-600/45 to-purple-600/35 blur-[160px] animate-float" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
