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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-6">
      <h2 className="text-lg font-semibold">Cari Pengguna</h2>
      <p className="text-sm text-slate-300/80">
        Ketik minimal dua karakter untuk menemukan pengguna lain.
      </p>

      <div className="mt-6 space-y-4">
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
            className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 pl-10 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
          />
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
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
      <div className="space-y-3">
        <UserCardSkeleton />
        <UserCardSkeleton />
      </div>
    );
  }

  if (searchError) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
        <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{searchError}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300/80">
        <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {query.trim().length < 2 ? <p>Masukkan minimal 2 karakter untuk mencari.</p> : <p>Tidak ada pengguna ditemukan.</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((user) => (
        <div
          key={user.id}
          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white transition-all hover:border-white/20 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 ring-2 ring-indigo-400/30">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-xs text-slate-400">ID #{user.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading || selectedUserId === user.id}
              onClick={() => onFollow(user.id)}
              className="flex flex-1 items-center justify-center gap-1 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-emerald-500/30 transition-all hover:scale-105 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-emerald-500/60 sm:flex-none"
            >
              {selectedUserId === user.id && loading ? (
                <>
                  <ButtonSpinner />
                  <span>Proses...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Ikuti</span>
                </>
              )}
            </button>
            <button
              type="button"
              disabled={loading || selectedUserId === user.id}
              onClick={() => onUnfollow(user.id)}
              className="flex flex-1 items-center justify-center gap-1 rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-rose-500/30 transition-all hover:scale-105 hover:bg-rose-400 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-rose-500/60 sm:flex-none"
            >
              {selectedUserId === user.id && loading ? (
                <>
                  <ButtonSpinner />
                  <span>Proses...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

