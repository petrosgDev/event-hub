import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none z-0" />
      
      {/* Top Left Logo */}
      <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-bold">⚡</span>
        </div>
        <span className="text-xl font-bold tracking-tight">EventHub <span className="text-primary">DBU</span></span>
      </Link>

      {/* Centered Form Container */}
      <div className="relative z-10 w-full max-w-lg p-6">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 overflow-hidden relative">
          {/* Inner card glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          {children}
        </div>
      </div>
      
      <div className="absolute bottom-8 z-10 text-sm text-muted-foreground">
        © 2026 EventHub DBU. Designed for the modern student.
      </div>
    </div>
  );
}
