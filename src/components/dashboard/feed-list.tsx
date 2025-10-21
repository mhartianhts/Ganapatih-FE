import { ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { FeedSkeletonList } from "@/components/ui/loading-skeleton";

export type FeedPost = {
  id: number;
  userid: number;
  content: string;
  createdat: string;
};

type FeedListProps = {
  posts: FeedPost[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export function FeedList({ posts, loading, error, onRefresh, isRefreshing }: FeedListProps) {
  return (
    <section className="group flex flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-indigo-500/10">
      {/* Header - Fixed */}
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Feed Terbaru</h2>
        </div>
        {onRefresh ? (
          <button
            onClick={onRefresh}
            disabled={loading || isRefreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/30 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:border-indigo-400 hover:bg-black/40 hover:shadow-indigo-500/20 disabled:cursor-not-allowed disabled:scale-100 disabled:border-white/10 disabled:opacity-50"
          >
            {loading || isRefreshing ? (
              <>
                <Spinner size="sm" />
                <span>Memuat...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 transition-transform duration-300 hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Segarkan</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-hidden">
        {error ? (
          <div className="m-5 flex items-start gap-3 rounded-2xl border border-red-400/30 bg-gradient-to-br from-red-500/20 to-red-500/5 p-4 shadow-lg shadow-red-500/10 sm:m-6 sm:p-5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500/30 ring-2 ring-red-400/30">
              <svg className="h-5 w-5 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-relaxed text-red-200 sm:text-base">{error}</p>
            </div>
          </div>
        ) : null}

        {!loading && !error && posts.length === 0 ? (
          <div className="m-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 shadow-lg sm:m-6 sm:p-5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 ring-2 ring-indigo-400/30">
              <svg className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-slate-300/80 sm:text-base">
                Belum ada postingan dari pengguna yang Anda ikuti. Ikuti beberapa pengguna untuk mulai melihat feed.
              </p>
            </div>
          </div>
        ) : null}

        {/* Scrollable Feed Container */}
        <div className="custom-scrollbar max-h-[calc(100vh-400px)] overflow-y-auto p-5 sm:p-6">
          <div className="space-y-4">
            {loading ? (
              <FeedSkeletonList count={3} />
            ) : (
              posts.map((post, index) => <FeedCard key={post.id} post={post} index={index} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeedCard({ post, index }: { post: FeedPost; index: number }) {
  return (
    <article 
      style={{ animationDelay: `${index * 50}ms` }}
      className="group/post animate-fade-in-up rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/30 hover:shadow-xl hover:shadow-indigo-500/10 sm:p-5"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 ring-2 ring-white/20 transition-transform duration-300 group-hover/post:scale-110">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-300 sm:text-base">
              Pengguna #{post.userid}
            </p>
          </div>
        </div>
        <time dateTime={post.createdat} className="flex items-center gap-1.5 text-xs text-slate-400 sm:text-sm">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{formatDate(post.createdat)}</span>
        </time>
      </header>
      <div className="mt-4 rounded-xl bg-black/20 p-4">
        <p className="text-sm leading-relaxed text-slate-100 sm:text-base">{post.content}</p>
      </div>
    </article>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

