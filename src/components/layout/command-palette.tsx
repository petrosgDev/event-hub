'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Sparkles, Flame, Users, X, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Handle Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Mock AI Suggestions
  const suggestions = [
    { icon: Flame, text: "Find me tech hackathons this weekend", type: "ai" },
    { icon: Sparkles, text: "Show free events with food", type: "ai" },
    { icon: Calendar, text: "Business seminars next month", type: "ai" },
  ];

  const results = [
    { title: "React Workshop for Beginners", type: "Tech", students: "45 attending", id: "1" },
    { title: "Campus Startup Pitch", type: "Business", students: "120 attending", id: "2" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden pointer-events-auto"
            >
              {/* Search Input Area */}
              <div className="flex items-center px-4 py-3 border-b border-border bg-background/50">
                <Sparkles className="w-5 h-5 text-primary mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Ask AI: 'Find me events about AI under 50 ETB...'"
                  className="flex-1 bg-transparent border-none outline-none text-foreground text-lg placeholder:text-muted-foreground/60 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {searchQuery.length === 0 ? (
                  <div className="p-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                      Try asking AI
                    </p>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary text-left transition-colors group"
                        onClick={() => setSearchQuery(s.text)}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <s.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                          &quot;{s.text}&quot;
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-primary" /> AI Matches
                    </p>
                    {results.map((r, i) => (
                      <button
                        key={i}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-secondary text-left transition-colors group"
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/events/${r.id}`);
                        }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground text-sm">{r.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="bg-secondary px-1.5 py-0.5 rounded-md">{r.type}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.students}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border bg-secondary/30 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><kbd className="bg-secondary px-1.5 py-0.5 rounded border border-border font-mono">↑↓</kbd> to navigate</span>
                  <span className="flex items-center gap-1"><kbd className="bg-secondary px-1.5 py-0.5 rounded border border-border font-mono">↵</kbd> to select</span>
                  <span className="flex items-center gap-1"><kbd className="bg-secondary px-1.5 py-0.5 rounded border border-border font-mono">ESC</kbd> to close</span>
                </div>
                <div className="flex items-center gap-1">
                  Powered by <Sparkles className="w-3 h-3 text-primary" /> <span className="font-bold text-foreground">EventHub AI</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
