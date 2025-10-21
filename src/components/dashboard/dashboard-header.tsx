import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";

type DashboardHeaderProps = {
  onLogout?: () => void;
};

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast("Berhasil keluar. Sampai jumpa!", "info", 2000);
    setTimeout(() => onLogout?.(), 500);
  };

  return (
    <header className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-indigo-500/10">
      {/* Animated Background Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative flex flex-col items-start justify-between gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-7 lg:p-8">
        <div className="flex flex-1 items-start gap-4">
          {/* Icon */}
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 ring-2 ring-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 sm:h-16 sm:w-16">
            <svg className="h-7 w-7 text-white sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          
          {/* Text Content */}
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-lg bg-indigo-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 ring-1 ring-indigo-400/30 sm:text-sm">
                Ganapatih
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Beranda Komunitas
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm leading-relaxed text-slate-300/80 sm:text-base">
              <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Buat postingan, ikuti teman, dan lihat kabar terbaru.</span>
            </p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-rose-500/40 sm:w-auto sm:text-base"
        >
          <svg className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
}

