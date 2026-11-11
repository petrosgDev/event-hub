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
      <body className="min-h-screen bg-background font-sans antialiased relative selection:bg-primary/20 selection:text-primary">
        {/* Ambient Glassmorphic Glow Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
          <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/15 via-amber-500/10 to-transparent blur-[140px] opacity-70 animate-float" />
          <div className="absolute top-1/3 -right-24 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-500/10 via-indigo-500/10 to-transparent blur-[160px] opacity-60 animate-float-delayed" />
          <div className="absolute -bottom-32 left-1/3 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-transparent blur-[160px] opacity-50 animate-float" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
