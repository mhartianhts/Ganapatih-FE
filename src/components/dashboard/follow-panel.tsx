import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { ButtonSpinner } from "@/components/ui/spinner";
import { UserCardSkeleton } from "@/components/ui/loading-skeleton";

type SearchResult = {
  id: number;
  username: string;
};

type FollowPanelProps = {
  onFollow: (userId: string) => Promise<void>;
  onUnfollow: (userId: string) => Promise<void>;
  onSearch: (query: string) => Promise<SearchResult[]>;
  loading?: boolean;
};

export function FollowPanel({ onFollow, onUnfollow, onSearch, loading }: FollowPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleUserAction = async (userId: number, action: "follow" | "unfollow") => {
    setSelectedUserId(userId);
    try {
      if (action === "follow") {
        await onFollow(String(userId));
        showToast("Berhasil mengikuti pengguna!", "success");
      } else {
        await onUnfollow(String(userId));
        showToast("Berhasil berhenti mengikuti pengguna.", "info");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.";
      showToast(message, "error");
    }
    setSelectedUserId(null);
  };

  return (
    <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-indigo-500/10 sm:p-7 lg:p-8">
      {/* Header Section */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Cari Pengguna</h2>
          </div>
        </div>
        <p className="ml-13 text-sm leading-relaxed text-slate-300/80 sm:text-base">
          Ketik minimal dua karakter untuk menemukan pengguna lain.
        </p>
      </div>

      {/* Search Section */}
      <div className="space-y-5">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={async (event) => {
              const value = event.target.value;
              setQuery(value);

              const trimmed = value.trim();
              if (trimmed.length < 2) {
                setResults([]);
                setSearchError(null);
                return;
              }

              setSearching(true);
              try {
                const users = await onSearch(trimmed);
                setResults(users);
                setSearchError(null);
              } catch (err) {
                const message = err instanceof Error ? err.message : "Gagal mencari pengguna.";
                setSearchError(message);
                showToast(message, "error");
                setResults([]);
              } finally {
                setSearching(false);
              }
            }}
            placeholder="Cari berdasarkan username..."
            className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3.5 pl-12 text-sm text-white placeholder-slate-400 shadow-inner outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-black/40 focus:ring-4 focus:ring-indigo-400/20 sm:py-4 sm:text-base"
          />
          <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors duration-200 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"></div>
            </div>
          )}
        </div>

        <SearchResults
          results={results}
          searching={searching}
          onFollow={(userId) => handleUserAction(userId, "follow")}
          onUnfollow={(userId) => handleUserAction(userId, "unfollow")}
          loading={loading}
          selectedUserId={selectedUserId}
          query={query}
          searchError={searchError}
        />
      </div>
    </div>
  );
}

function SearchResults({
  results,
  searching,
  onFollow,
  onUnfollow,
  loading,
  selectedUserId,
  query,
  searchError,
}: {
  results: SearchResult[];
  searching: boolean;
  onFollow: (userId: number) => void;
  onUnfollow: (userId: number) => void;
  loading?: boolean;
  selectedUserId: number | null;
  query: string;
  searchError: string | null;
}) {
  if (searching) {
    return (
      <div className="space-y-3 animate-pulse">
        <UserCardSkeleton />
        <UserCardSkeleton />
      </div>
    );
  }

  if (searchError) {
    return (
      <div className="group/error flex items-start gap-3 rounded-2xl border border-red-400/30 bg-gradient-to-br from-red-500/20 to-red-500/5 p-4 shadow-lg shadow-red-500/10 transition-all duration-300 hover:border-red-400/50 sm:p-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500/30 ring-2 ring-red-400/30">
          <svg className="h-5 w-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-relaxed text-red-200 sm:text-base">{searchError}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="group/empty flex items-start gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 shadow-lg transition-all duration-300 hover:border-white/20 sm:p-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 ring-2 ring-indigo-400/30">
          <svg className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-slate-300/80 sm:text-base">
            {query.trim().length < 2 ? "Masukkan minimal 2 karakter untuk mencari." : "Tidak ada pengguna ditemukan."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((user, index) => (
        <div
          key={user.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="group/card animate-fade-in-up flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:shadow-xl hover:shadow-indigo-500/10 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          {/* User Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 ring-2 ring-white/20 transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-3 sm:h-14 sm:w-14">
              <svg className="h-6 w-6 text-white sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-emerald-400 ring-2 ring-emerald-400/30"></div>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-white transition-colors group-hover/card:text-indigo-300 sm:text-lg">
                {user.username}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-slate-400 sm:text-sm">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span>ID {user.id}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              disabled={loading || selectedUserId === user.id}
              onClick={() => onFollow(user.id)}
              className="group/btn flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:scale-100 disabled:from-emerald-500/60 disabled:to-green-600/60 disabled:shadow-none sm:flex-none sm:text-sm"
            >
              {selectedUserId === user.id && loading ? (
                <>
                  <ButtonSpinner />
                  <span>Proses...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Ikuti</span>
                </>
              )}
            </button>
            <button
              type="button"
              disabled={loading || selectedUserId === user.id}
              onClick={() => onUnfollow(user.id)}
              className="group/btn flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-rose-500/40 disabled:cursor-not-allowed disabled:scale-100 disabled:from-rose-500/60 disabled:to-red-600/60 disabled:shadow-none sm:flex-none sm:text-sm"
            >
              {selectedUserId === user.id && loading ? (
                <>
                  <ButtonSpinner />
                  <span>Proses...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Berhenti</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

