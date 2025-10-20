import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur sm:rounded-3xl sm:p-8 lg:rounded-[32px] lg:p-10">
      <div className="space-y-2 text-center sm:space-y-3">
        <p className="text-xs uppercase tracking-[0.5em] text-indigo-300/60">Tikkommartik</p>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
        <p className="text-xs text-slate-300/80 sm:text-sm">{description}</p>
      </div>

      <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-6">
        {children}
        <div className="text-center text-xs text-slate-300/70">{footer}</div>
      </div>
    </div>
  );
}

