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
    color: 'text-primary',
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
    color: 'text-orange-400',
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
    color: 'text-red-400',
    icon: ShieldAlert,
    links: [
      { name: 'Overview', href: '/dashboard/admin', icon: Home },
      { name: 'All Events', href: '/dashboard/admin/events', icon: Calendar },
      { name: 'Users', href: '/dashboard/admin/users', icon: Users },
      { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
    ],
  },
  SUPER_ADMIN: {
    label: 'superAdmin', // Key for translation
    color: 'text-primary',
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
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card/80 backdrop-blur-xl flex flex-col shrink-0 md:h-screen md:sticky md:top-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-8 h-8 transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_8px_rgba(249,115,22,0.4)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="url(#bgGradient)" className="opacity-10 group-hover:opacity-25 transition-opacity duration-500" />
                <path 
                  d="M 80 55 C 80 55 80 30 50 30 C 20 30 20 60 50 80 C 70 93 85 80 85 80" 
                  stroke="url(#paint0_linear)" 
                  strokeWidth="16" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M 22 55 L 75 55" 
                  stroke="url(#paint1_linear)" 
                  strokeWidth="16" 
                  strokeLinecap="round" 
                />
                <defs>
                  <linearGradient id="bgGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f97316" />
                    <stop offset="1" stopColor="#ea580c" />
                  </linearGradient>
                  <linearGradient id="paint0_linear" x1="20" y1="30" x2="85" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f97316" />
                    <stop offset="1" stopColor="#c2410c" />
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="22" y1="55" x2="75" y2="55" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fb923c" />
                    <stop offset="1" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground ml-1">
              EventHub <span className="text-primary font-bold">DBU</span>
            </span>
          </Link>
        </div>

        {/* Workspace Label */}
        <div className="px-5 py-3 border-b border-border/50">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${config.color}`}>
            <RoleIcon className="w-3.5 h-3.5" />
            {t(config.label as any) || config.label}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          <nav className="space-y-0.5">
            {config.links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard/student' && link.href !== '/dashboard/organizer' && link.href !== '/dashboard/super-admin' && pathname.startsWith(link.href));
              return (
                <Link key={link.name} href={link.href}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}>
                    <link.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    <span className="truncate">{t(link.name as any) || link.name}</span>
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto text-primary/50" />}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Theme & Language Controls */}
        <div className="px-3 py-3 border-t border-border/50">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-primary shrink-0" /> : <Moon className="w-4 h-4 text-primary shrink-0" />}
            <span>{theme === 'dark' ? t('lightMode') : t('darkMode')}</span>
            <span className="ml-auto text-xs bg-secondary px-2 py-0.5 rounded-md font-bold text-foreground/60">
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Globe className="w-4 h-4 text-primary shrink-0" />
            <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
            <span className="ml-auto text-xs bg-secondary px-2 py-0.5 rounded-md font-bold text-foreground/60">
              {language === 'en' ? '🇪🇹' : '🇺🇸'}
            </span>
          </button>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">{user.firstName} {user.lastName}</p>
              <p className={`text-xs font-medium ${config.color}`}>{t(config.label as any) || config.label}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 text-sm font-semibold" onClick={handleLogout}>
            <LogOut className="mr-2.5 h-3.5 w-3.5" /> {t('signOut')}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        <CommandPalette />
        {/* Top Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex-1 flex items-center">
            {/* Global Search Trigger */}
            <button
              onClick={() => {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary/50 hover:bg-secondary border border-border rounded-lg transition-colors group"
            >
              <Search className="w-4 h-4 group-hover:text-foreground transition-colors" />
              <span>Ask AI...</span>
              <kbd className="ml-4 bg-background px-1.5 py-0.5 rounded border border-border font-mono text-[10px] font-bold">Ctrl+K</kbd>
            </button>
          </div>
          <NotificationDropdown />
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
