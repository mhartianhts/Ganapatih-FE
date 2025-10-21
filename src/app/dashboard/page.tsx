"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/session-context";
import { ApiError, apiFetchAuthorized } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PostForm } from "@/components/dashboard/post-form";
import { FeedList, FeedPost } from "@/components/dashboard/feed-list";
import { FollowPanel } from "@/components/dashboard/follow-panel";

type FeedResponse = {
  page: number;
  posts: FeedPost[];
};

type SearchUser = {
  id: number;
  username: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { session, initializing, clearSession } = useSession();

  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  const [postLoading, setPostLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleUnauthorized = useCallback(() => {
    clearSession();
    router.replace("/auth/login");
  }, [clearSession, router]);

  const loadFeed = useCallback(async () => {
    if (!session) {
      return;
    }

    setFeedLoading(true);
    setFeedError(null);

    try {
      const data = await apiFetchAuthorized<FeedResponse>("/api/feed", session.token);
      setFeed(Array.isArray(data.posts) ? data.posts : []);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      const message =
        err instanceof ApiError
          ? err.message
          : "Gagal memuat feed. Coba lagi nanti.";
      setFeedError(message);
    } finally {
      setFeedLoading(false);
    }
  }, [session, handleUnauthorized]);

  useEffect(() => {
    if (!initializing && !session) {
      router.replace("/auth/login");
    }
  }, [initializing, session, router]);

  useEffect(() => {
    if (session) {
      loadFeed();
    }
  }, [session, loadFeed]);

  const handleCreatePost = async (content: string) => {
    if (!session) {
      throw new Error("Sesi berakhir. Silakan login kembali.");
    }

    setPostLoading(true);

    try {
      await apiFetchAuthorized("/api/posts", session.token, {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      await loadFeed();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        throw err;
      }

      const message =
        err instanceof ApiError
          ? err.message
          : "Gagal membuat postingan. Coba lagi.";
      throw new Error(message);
    } finally {
      setPostLoading(false);
    }
  };

  const handleFollow = async (userId: string, action: "follow" | "unfollow") => {
    if (!session) {
      throw new Error("Sesi berakhir. Silakan login kembali.");
    }

    setFollowLoading(true);

    try {
      await apiFetchAuthorized<{ message: string }>(
        `/api/follow/${userId}`,
        session.token,
        {
          method: action === "follow" ? "POST" : "DELETE",
        }
      );

      await loadFeed();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        throw err;
      }

      const message =
        err instanceof ApiError
          ? err.message
          : action === "follow"
          ? "Gagal mengikuti pengguna."
          : "Gagal berhenti mengikuti pengguna.";
      throw new Error(message);
    } finally {
      setFollowLoading(false);
    }
  };

  const searchUsers = useCallback(
    async (query: string) => {
      if (!session) {
        throw new Error("Sesi berakhir. Silakan login kembali.");
      }

      const trimmed = query.trim();
      if (!trimmed) {
        return [] as SearchUser[];
      }

      try {
        const params = new URLSearchParams({ q: trimmed, limit: "5" });
        const data = await apiFetchAuthorized<{ users: SearchUser[] }>(
          `/api/users/search?${params.toString()}`,
          session.token
        );
        return Array.isArray(data.users) ? data.users : [];
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
        }

        const message = err instanceof ApiError ? err.message : "Gagal mencari pengguna.";
        throw new Error(message);
      }
    },
    [session, handleUnauthorized]
  );

  const handleRefresh = async () => {
    if (!session) {
      return;
    }

    setIsRefreshing(true);
    await loadFeed();
    setIsRefreshing(false);
  };

  if (initializing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <p className="text-sm text-slate-600 dark:text-slate-300">Menyiapkan aplikasi...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <p className="text-sm text-slate-600 dark:text-slate-300">Mengalihkan ke halaman login...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-6 text-slate-100 sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
        <DashboardHeader onLogout={() => router.replace("/auth/login")} />

        <section className="grid gap-6 sm:gap-6 lg:grid-cols-[1fr_420px] xl:gap-8">
          {/* Main Content */}
          <div className="flex flex-col gap-6 sm:gap-6">
            <PostForm onSubmit={handleCreatePost} loading={postLoading} />
            <FeedList
              posts={feed}
              loading={feedLoading}
              error={feedError}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </div>

          {/* Sidebar - Sticky */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <FollowPanel
                loading={followLoading}
                onFollow={async (userId) => handleFollow(userId, "follow")}
                onUnfollow={async (userId) => handleFollow(userId, "unfollow")}
                onSearch={searchUsers}
              />

              <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-indigo-500/10 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Tips Penggunaan</h2>
                </div>
                <ul className="space-y-3 text-sm leading-relaxed text-slate-300/80">
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Postingan hanya berupa teks dan dibatasi 200 karakter.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Ikuti pengguna lain untuk melihat kabar mereka dalam feed.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Gunakan tombol segarkan jika postingan baru belum muncul.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Anda dapat keluar kapan saja melalui tombol keluar.</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          <div className="space-y-6 lg:hidden">
            <FollowPanel
              loading={followLoading}
              onFollow={async (userId) => handleFollow(userId, "follow")}
              onUnfollow={async (userId) => handleFollow(userId, "unfollow")}
              onSearch={searchUsers}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

