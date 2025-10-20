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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Feed Terbaru</h2>
        {onRefresh ? (
          <button
            onClick={onRefresh}
            disabled={loading || isRefreshing}
            className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white transition-all hover:scale-105 hover:bg-white/10 disabled:cursor-not-allowed disabled:scale-100 disabled:border-white/5 disabled:opacity-60"
          >
            {loading || isRefreshing ? (
              <>
                <Spinner size="sm" />
                <span>Memuat...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Segarkan</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {!loading && !error && posts.length === 0 ? (
        <p className="mt-6 text-sm text-slate-300/80">
          Belum ada postingan dari pengguna yang Anda ikuti. Ikuti beberapa pengguna untuk mulai melihat feed.
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        {loading ? (
          <FeedSkeletonList count={3} />
        ) : (
          posts.map((post) => <FeedCard key={post.id} post={post} />)
        )}
      </div>
    </section>
  );
}

function FeedCard({ post }: { post: FeedPost }) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 transition-all hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 sm:p-5">
      <header className="flex flex-col gap-2 text-xs text-slate-300/70 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 ring-2 ring-indigo-400/30">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="font-medium text-indigo-300">Pengguna #{post.userid}</span>
        </div>
        <time dateTime={post.createdat} className="flex items-center gap-1 text-slate-400">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(post.createdat)}
        </time>
      </header>
      <p className="mt-4 text-sm leading-relaxed text-slate-100">{post.content}</p>
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

