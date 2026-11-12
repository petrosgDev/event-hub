import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-transparent font-sans">
      {/* Background Effects (Golden Ambient Orbs) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/15 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      
      {/* Floating Glass Brand Pill Top Left */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/40 dark:bg-black/35 backdrop-blur-xl border border-white/30 dark:border-amber-500/25 shadow-lg shadow-amber-500/5 hover:scale-105 transition-all">
        <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 font-extrabold text-xs shadow-sm">
          ⚡
        </div>
        <span className="text-sm font-extrabold tracking-tight text-foreground">EventHub <span className="text-amber-500">DBU</span></span>
      </Link>

      {/* Centered Form Container (High-Transparency Rounded-3xl Glass Card) */}
      <div className="relative z-10 w-full max-w-lg p-6">
        <div className="bg-white/40 dark:bg-black/35 backdrop-blur-3xl border border-white/30 dark:border-amber-500/25 rounded-3xl shadow-2xl shadow-amber-500/10 p-8 md:p-10 overflow-hidden relative">
          {/* Inner card specular glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[240px] h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
          
          {children}
        </div>
      </div>
      
      <div className="relative z-10 text-xs text-muted-foreground font-medium mt-2">
        © {new Date().getFullYear()} EventHub DBU · Debre Birhan University.
      </div>
    </div>
  );
}
