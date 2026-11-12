'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, MapPin, Ticket, Compass, PlusCircle, LayoutDashboard, LogIn, UserPlus, Bell, Menu, X, LogOut, Globe, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { useTranslation, useLanguageStore } from '@/stores/language-store';
import { NotificationDropdown } from './notification-dropdown';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/stores/theme-store';

export function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { t, language } = useTranslation();
  const { setLanguage } = useLanguageStore();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-3 md:top-4 z-50 w-full px-3 md:px-6 transition-all duration-300 perspective-1000">
      <div className="max-w-7xl mx-auto rounded-2xl md:rounded-3xl border-t border-t-white/60 dark:border-t-amber-400/40 border-b-2 border-b-amber-500/30 dark:border-b-amber-600/50 border-x border-x-white/30 dark:border-x-amber-500/20 bg-white/45 dark:bg-black/35 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15),0_8px_20px_rgba(245,158,11,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7),0_10px_30px_rgba(245,158,11,0.2)] px-4 md:px-6 h-16 flex items-center justify-between gap-4 transition-all duration-300">
        
        {/* Left Side: Logo & Search Bar */}
        <div className="flex items-center gap-6 flex-1">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="relative flex items-center justify-center w-10 h-10 transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="url(#bgGradient)" className="opacity-15 group-hover:opacity-30 transition-opacity duration-500" />
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
                    <stop stopColor="#f59e0b" />
                    <stop offset="1" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="paint0_linear" x1="20" y1="30" x2="85" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="22" y1="55" x2="75" y2="55" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fde68a" />
                    <stop offset="1" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground ml-1">
              EventHub <span className="text-amber-500 font-extrabold drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">DBU</span>
            </span>
          </Link>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/events/discover?search=${encodeURIComponent(searchQuery.trim())}`);
              } else {
                router.push('/events/discover');
              }
            }}
            className="hidden md:flex items-center bg-white/40 dark:bg-white/[0.04] border border-white/25 dark:border-amber-500/20 backdrop-blur-xl rounded-full px-4 py-1.5 max-w-sm flex-1 transition-all focus-within:border-amber-500/70 focus-within:ring-2 focus-within:ring-amber-500/25 shadow-sm"
          >
            <Search className="w-4 h-4 mr-2.5 text-amber-500/80 shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchEvents')} 
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            />
          </form>
        </div>

        {/* Right Side: Navigation Links & Actions */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-bold">
          <Link href="/events/discover" className="text-foreground/90 hover:text-foreground transition-colors flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            {t('findEvents')}
          </Link>

          <Link href="/dashboard/organizer/events/create" className="text-foreground/90 hover:text-foreground transition-colors flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-primary" />
            {t('createEvents')}
          </Link>

          <Link href="/dashboard/student/events" className="text-foreground/90 hover:text-foreground transition-colors flex items-center gap-2">
            <Ticket className="w-4 h-4 text-primary" />
            {t('findMyTickets')}
          </Link>


          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 text-foreground/90 hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase">{language === 'en' ? 'EN' : 'አማ'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-popover backdrop-blur-2xl border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <button
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      language === 'en' ? 'bg-primary/15 text-primary font-semibold' : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <span className="text-lg">🇺🇸</span>
                    English
                  </button>
                  <button
                    onClick={() => { setLanguage('am'); setIsLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      language === 'am' ? 'bg-primary/15 text-primary font-semibold' : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <span className="text-lg">🇪🇹</span>
                    አማርኛ (Amharic)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md text-foreground/90 hover:text-foreground hover:bg-secondary transition-colors"
            title={theme === 'dark' ? t('lightMode') : t('darkMode')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="w-px h-6 bg-border mx-2"></div>

          {!isMounted ? (
            <div className="w-32 h-10 animate-pulse bg-secondary rounded-md" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <NotificationDropdown />
              <Link href={
                user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '/dashboard/admin' : 
                user.role === 'ORGANIZER' ? '/dashboard/organizer' : '/dashboard/student'
              }>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  {t('dashboard')}
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="text-foreground/90 hover:text-destructive hover:bg-destructive/10"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="hover:bg-secondary text-foreground/90 hover:text-foreground flex items-center gap-2 font-bold transition-all">
                    <LogIn className="w-4 h-4" />
                    {t('signIn')}
                  </Button>
                </motion.div>
              </Link>
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(245, 158, 11, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full"
                >
                  <Button className="rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black border-none font-bold flex items-center gap-2 px-5 shadow-lg shadow-amber-500/25 relative overflow-hidden group">
                    <span className="absolute inset-0 w-full h-full bg-white/25 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12" />
                    <UserPlus className="w-4 h-4 relative z-10 text-black" />
                    <span className="relative z-10">{t('getStarted')}</span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          )}
        </nav>

        <div className="xl:hidden flex items-center gap-2 ml-auto">
          {/* Mobile Search Button */}
          <button 
            className="p-2 text-foreground/90 hover:text-foreground transition-colors"
            onClick={() => router.push('/events/discover')}
            title="Search Events"
          >
            <Search className="w-6 h-6" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="p-2 text-foreground/90 hover:text-foreground transition-colors flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="xl:hidden overflow-hidden rounded-3xl border border-white/25 dark:border-amber-500/25 bg-background/85 dark:bg-black/85 backdrop-blur-3xl mt-3 shadow-2xl shadow-amber-500/10"
          >
            <div className="flex flex-col p-4 gap-2">
              <Link href="/events/discover" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary text-foreground/70 hover:text-foreground transition-all">
                <Compass className="w-5 h-5 text-primary" />
                <span className="font-semibold text-base">{t('findEvents')}</span>
              </Link>
              
              <Link href="/dashboard/organizer/events/create" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary text-foreground/70 hover:text-foreground transition-all">
                <PlusCircle className="w-5 h-5 text-primary" />
                <span className="font-semibold text-base">{t('createEvents')}</span>
              </Link>

              <Link href="/dashboard/student/events" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary text-foreground/70 hover:text-foreground transition-all">
                <Ticket className="w-5 h-5 text-primary" />
                <span className="font-semibold text-base">{t('findMyTickets')}</span>
              </Link>


              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-2 p-3 rounded-lg">
                <Globe className="w-5 h-5 text-primary" />
                <span className="font-semibold text-base text-foreground/70 mr-auto">{t('language')}</span>
                <div className="flex bg-secondary rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1.5 text-sm font-bold transition-colors ${language === 'en' ? 'bg-primary/20 text-primary' : 'text-foreground/70 hover:text-foreground'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('am')}
                    className={`px-3 py-1.5 text-sm font-bold transition-colors ${language === 'am' ? 'bg-primary/20 text-primary' : 'text-foreground/70 hover:text-foreground'}`}
                  >
                    አማ
                  </button>
                </div>
              </div>

              {/* Mobile Theme Toggle */}
              <div className="flex items-center gap-2 p-3 rounded-lg">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                <span className="font-semibold text-base text-foreground/70 mr-auto">{t('theme')}</span>
                <div className="flex bg-secondary rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-3 py-1.5 text-sm font-bold transition-colors flex items-center gap-1 ${theme === 'light' ? 'bg-primary/20 text-primary' : 'text-foreground/70'}`}
                  >
                    <Sun className="w-3.5 h-3.5" /> {t('lightMode')}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-1.5 text-sm font-bold transition-colors flex items-center gap-1 ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'text-foreground/70'}`}
                  >
                    <Moon className="w-3.5 h-3.5" /> {t('darkMode')}
                  </button>
                </div>
              </div>

              <div className="h-px bg-border my-2" />

              {!isMounted ? null : user ? (
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
                    <span className="font-bold text-foreground truncate pr-4 text-base">{user.firstName} {user.lastName}</span>
                    <NotificationDropdown />
                  </div>
                  <Link href={
                    user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '/dashboard/admin' : 
                    user.role === 'ORGANIZER' ? '/dashboard/organizer' : '/dashboard/student'
                  } onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 h-12 text-base">
                      <LayoutDashboard className="w-5 h-5" />
                      {t('dashboard')}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full border-border text-foreground/70 hover:text-destructive hover:bg-destructive/10 h-12 text-base font-semibold"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      router.push('/');
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    {t('signOut')}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary h-12 flex justify-center items-center gap-2 text-base font-bold">
                      <LogIn className="w-5 h-5" />
                      {t('signIn')}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-orange-500 text-primary-foreground border-none font-bold h-12 flex items-center justify-center gap-2 text-base shadow-lg shadow-primary/20">
                      <UserPlus className="w-5 h-5" />
                      {t('getStarted')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
