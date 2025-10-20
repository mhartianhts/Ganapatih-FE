import { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px] sm:h-[480px] sm:w-[480px] sm:blur-[160px]" />
        <div className="absolute left-[20%] top-[20%] h-[200px] w-[200px] rounded-full bg-sky-400/10 blur-[80px] sm:h-[300px] sm:w-[300px] sm:blur-[120px]" />
        <div className="absolute right-[15%] bottom-[15%] h-[220px] w-[220px] rounded-full bg-purple-500/10 blur-[80px] sm:h-[320px] sm:w-[320px] sm:blur-[120px]" />
      </div>
      {children}
    </main>
  );
}

