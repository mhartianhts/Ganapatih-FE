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
    <header className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:flex-row sm:items-center sm:gap-6 sm:p-6 lg:p-8">
      <div className="flex-1">
        <p className="text-xs uppercase tracking-[0.4em] text-indigo-300/80 sm:text-sm">Tikkommartik</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Beranda Komunitas</h1>
        <p className="mt-1 text-xs text-slate-300/80 sm:text-sm">
          Buat postingan, ikuti teman, dan lihat kabar terbaru.
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-white/10"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Keluar</span>
      </button>
    </header>
  );
}

