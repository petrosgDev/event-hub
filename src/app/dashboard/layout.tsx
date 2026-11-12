'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import {
  LogOut, Home, Calendar, Award, User, QrCode,
  Sparkles, ShieldAlert, Users, Building2, BarChart3,
  Ticket, Search, FileText, Settings, ChevronRight, CalendarDays,
  Sun, Moon, Globe, Command
} from 'lucide-react';
import { useTranslation, useLanguageStore } from '@/stores/language-store';
import { useTheme } from '@/stores/theme-store';
import { CommandPalette } from '@/components/layout/command-palette';

const roleConfig = {
  STUDENT: {
    label: 'Student Portal',
    color: 'text-amber-500',
    icon: Sparkles,
    links: [
      { name: 'Home Feed', href: '/dashboard/student', icon: Home },
      { name: 'My Tickets', href: '/dashboard/student/events', icon: Ticket },
      { name: 'Certificates', href: '/dashboard/student/certificates', icon: Award },
      { name: 'Discover Events', href: '/events/discover', icon: Search },
      { name: 'My Profile', href: '/dashboard/profile', icon: User },
    ],
  },
  ORGANIZER: {
    label: 'Vendor Workspace',
    color: 'text-amber-500',
    icon: Building2,
    links: [
      { name: 'Event Studio', href: '/dashboard/organizer', icon: Home },
      { name: 'Create Event', href: '/dashboard/organizer/events/create', icon: Calendar },
      { name: 'Manage Events', href: '/dashboard/organizer/events', icon: FileText },
      { name: 'QR Scanner', href: '/dashboard/organizer/scanner', icon: QrCode },
      { name: 'Analytics', href: '/dashboard/organizer/analytics', icon: BarChart3 },
      { name: 'My Profile', href: '/dashboard/profile', icon: User },
    ],
  },
  ADMIN: {
    label: 'Admin Panel',
    color: 'text-amber-500',
    icon: ShieldAlert,
    links: [
      { name: 'Overview', href: '/dashboard/admin', icon: Home },
      { name: 'All Events', href: '/dashboard/admin/events', icon: Calendar },
      { name: 'Users', href: '/dashboard/admin/users', icon: Users },
      { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
    ],
  },
  SUPER_ADMIN: {
    label: 'superAdmin',
    color: 'text-amber-500',
    icon: ShieldAlert,
    links: [
      { name: 'tabOverview', href: '/dashboard/admin', icon: Home },
      { name: 'tabEvents', href: '/dashboard/admin/events', icon: CalendarDays },
      { name: 'tabUsers', href: '/dashboard/admin/users', icon: Users },
      { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
    ],
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { t, language } = useTranslation();
  const { setLanguage } = useLanguageStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !user) return null;

  const role = (user.role as keyof typeof roleConfig) || 'STUDENT';
  const config = roleConfig[role] || roleConfig.STUDENT;
  const RoleIcon = config.icon;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row relative">
      {/* ═══════════════ SIDEBAR (HIGH TRANSPARENCY FROSTED GLASS) ═══════════════ */}
      <aside className="w-full md:w-64 border-r border-white/20 dark:border-amber-500/20 bg-white/40 dark:bg-black/35 backdrop-blur-2xl flex flex-col shrink-0 md:h-screen md:sticky md:top-0 shadow-xl shadow-amber-500/5">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/10 dark:border-amber-500/15 gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-8 h-8 transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="url(#bgGradientDash)" className="opacity-15 group-hover:opacity-30 transition-opacity duration-500" />
                <path 
                  d="M 80 55 C 80 55 80 30 50 30 C 20 30 20 60 50 80 C 70 93 85 80 85 80" 
                  stroke="url(#paint0_dash)" 
                  strokeWidth="16" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M 22 55 L 75 55" 
                  stroke="url(#paint1_dash)" 
                  strokeWidth="16" 
                  strokeLinecap="round" 
                />
                <defs>
                  <linearGradient id="bgGradientDash" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f59e0b" />
                    <stop offset="1" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="paint0_dash" x1="20" y1="30" x2="85" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="paint1_dash" x1="22" y1="55" x2="75" y2="55" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fde68a" />
                    <stop offset="1" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground ml-1">
              EventHub <span className="text-amber-500 font-extrabold drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">DBU</span>
            </span>
          </Link>
        </div>

        {/* Workspace Label */}
        <div className="px-5 py-3 border-b border-white/10 dark:border-amber-500/15">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${config.color}`}>
            <RoleIcon className="w-3.5 h-3.5 text-amber-500" />
            {t(config.label as any) || config.label}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          <nav className="space-y-1.5">
            {config.links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard/student' && link.href !== '/dashboard/organizer' && link.href !== '/dashboard/super-admin' && pathname.startsWith(link.href));
              return (
                <Link key={link.name} href={link.href}>
                  <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/35 backdrop-blur-md shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-amber-500/10 backdrop-blur-sm'
                  }`}>
                    <link.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-500' : 'group-hover:text-amber-400'}`} />
                    <span className="truncate">{t(link.name as any) || link.name}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-amber-500" />}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Theme & Language Controls */}
        <div className="px-3 py-3 border-t border-white/10 dark:border-amber-500/15">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-amber-500/10 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500 shrink-0" /> : <Moon className="w-4 h-4 text-amber-500 shrink-0" />}
            <span>{theme === 'dark' ? t('lightMode') : t('darkMode')}</span>
            <span className="ml-auto text-xs bg-white/40 dark:bg-white/10 px-2 py-0.5 rounded-full font-bold text-foreground/80">
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-amber-500/10 transition-all mt-1"
          >
            <Globe className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
            <span className="ml-auto text-xs bg-white/40 dark:bg-white/10 px-2 py-0.5 rounded-full font-bold text-foreground/80">
              {language === 'en' ? '🇪🇹' : '🇺🇸'}
            </span>
          </button>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 dark:border-amber-500/15">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-sm shrink-0 shadow-sm">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-bold truncate text-foreground">{user.firstName} {user.lastName}</p>
              <p className={`text-xs font-medium text-amber-500`}>{t(config.label as any) || config.label}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 text-sm font-semibold rounded-2xl" onClick={handleLogout}>
            <LogOut className="mr-2.5 h-3.5 w-3.5" /> {t('signOut')}
          </Button>
        </div>
      </aside>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        <CommandPalette />
        
        {/* 🌟 FLOATING ROUNDED-2XL GLASS TOP HEADER */}
        <header className="sticky top-3 md:top-4 mx-4 md:mx-6 z-20 rounded-2xl border border-white/30 dark:border-amber-500/20 bg-white/40 dark:bg-black/35 backdrop-blur-2xl px-6 h-14 flex items-center justify-between shadow-xl shadow-amber-500/5 transition-all">
          <div className="flex-1 flex items-center">
            {/* Global Search Trigger */}
            <button
              onClick={() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
              }}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 text-sm text-muted-foreground bg-white/40 dark:bg-white/[0.05] hover:bg-white/60 dark:hover:bg-white/[0.08] border border-white/25 dark:border-amber-500/20 rounded-xl backdrop-blur-md transition-all group shadow-sm"
            >
              <Search className="w-4 h-4 text-amber-500/80 group-hover:text-amber-500 transition-colors" />
              <span>Ask AI...</span>
              <kbd className="ml-4 bg-white/60 dark:bg-white/10 px-2 py-0.5 rounded-lg border border-white/20 dark:border-amber-500/20 font-mono text-[10px] font-bold text-foreground/80">Ctrl+K</kbd>
            </button>
          </div>
          <NotificationDropdown />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
