"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur sm:gap-8 sm:rounded-[40px] sm:p-8 lg:gap-10 lg:p-12">
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs uppercase tracking-[0.6em] text-indigo-300/80">
            Tikkommartik
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Simple News Feed System
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-slate-300/80 sm:text-base">
            Platform mini ala Twitter/Instagram untuk membuat akun, berbagi postingan teks,
            mengikuti pengguna lain, dan melihat kabar terbaru dari mereka yang Anda ikuti.
          </p>
        </div>

        <div className="grid gap-4 rounded-2xl bg-black/30 p-4 sm:gap-6 sm:rounded-3xl sm:p-6 lg:grid-cols-2 lg:p-8">
          <div className="space-y-3 text-left">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white sm:text-xl">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Fitur Utama
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-xs text-slate-300/80 sm:text-sm">
              <li>Buat akun baru dan login dengan aman.</li>
              <li>Tulis postingan singkat hingga 200 karakter.</li>
              <li>Ikuti atau berhenti mengikuti pengguna lain.</li>
              <li>Lihat feed real-time dari pengguna yang Anda ikuti.</li>
            </ul>
          </div>
          <div className="space-y-3 text-left">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white sm:text-xl">
              <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Alur Pengguna
            </h2>
            <ol className="list-decimal space-y-2 pl-5 text-xs text-slate-300/80 sm:text-sm">
              <li>Daftar akun baru atau login jika sudah memiliki akun.</li>
              <li>Buat postingan pertama Anda dan mulai mengikuti teman.</li>
              <li>Eksplor feed dan dapatkan kabar terbaru dari komunitas.</li>
              <li>Kelola relasi dengan mudah dari halaman dashboard.</li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:bg-indigo-400 hover:shadow-indigo-500/50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Masuk
          </Link>
          <Link
            href="/auth/register"
            className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-white/10"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Daftar
          </Link>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left sm:gap-6 sm:rounded-3xl sm:p-6 lg:p-8">
          <h2 className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contoh Skenario Pengujian
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            <div className="space-y-2 text-xs sm:text-sm text-slate-300/80">
              <h3 className="font-semibold text-white">TC-1: Registrasi & Login</h3>
              <p>Pengguna baru berhasil daftar. Username duplikat menghasilkan konflik (409).</p>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300/80">
              <h3 className="font-semibold text-white">TC-2: Postingan</h3>
              <p>Posting konten valid ≤ 200 karakter. Konten panjang memicu kesalahan 422.</p>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300/80">
              <h3 className="font-semibold text-white">TC-3: Follow / Unfollow</h3>
              <p>Mengikuti ID valid disimpan di database. ID tak valid mengembalikan kesalahan 404.</p>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300/80">
              <h3 className="font-semibold text-white">TC-4: Feed</h3>
              <p>Feed menampilkan posting terbaru dari pengguna yang diikuti. Tanpa relasi, feed kosong.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

