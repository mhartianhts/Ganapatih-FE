"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/form/auth-layout";
import { AuthCard } from "@/components/form/auth-card";
import { useToast } from "@/components/ui/toast";
import { ButtonSpinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, resetError } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login(form.username, form.password);
      showToast("Login berhasil! Mengarahkan ke dashboard...", "success", 2000);
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err) {
      console.error("Login gagal", err);
      showToast(error?.message || "Login gagal. Silakan coba lagi.", "error");
    }
  };

  const handleChange = (
    event: FormEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) {
      resetError();
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Masuk ke Akun"
        description="Gunakan kredensial Anda untuk mengakses dashboard komunitas."
        footer={
          <span>
            Belum punya akun?
            {" "}
            <Link href="/auth/register" className="font-semibold text-indigo-300 hover:text-indigo-200">
              Daftar sekarang
            </Link>
          </span>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-widest text-indigo-200" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              value={form.username}
              onInput={handleChange}
              className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
              placeholder="username"
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-widest text-indigo-200" htmlFor="password">
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onInput={handleChange}
              className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:bg-indigo-400 hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-indigo-500/60 disabled:shadow-none"
          >
            {loading ? (
              <>
                <ButtonSpinner />
                <span>Memproses...</span>
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

