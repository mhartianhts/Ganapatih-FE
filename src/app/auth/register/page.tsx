"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/form/auth-layout";
import { AuthCard } from "@/components/form/auth-card";
import { useToast } from "@/components/ui/toast";
import { ButtonSpinner } from "@/components/ui/spinner";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerRequest, loading, error, resetError } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError("Konfirmasi kata sandi tidak cocok.");
      showToast("Konfirmasi kata sandi tidak cocok.", "error");
      return;
    }

    setLocalError(null);

    try {
      await registerRequest(form.username, form.password);
      showToast("Registrasi berhasil! Silakan login.", "success", 3000);
      setTimeout(() => router.push("/auth/login"), 1000);
    } catch (err) {
      console.error("Registrasi gagal", err);
      showToast(error?.message || "Registrasi gagal. Silakan coba lagi.", "error");
    }
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) {
      resetError();
    }
    if (localError) {
      setLocalError(null);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Daftar Akun Baru"
        description="Mulai perjalanan Anda di Tikkommartik dan jelajahi kabar terbaru dari komunitas."
        footer={
          <span>
            Sudah punya akun?
            {" "}
            <Link href="/auth/login" className="font-semibold text-indigo-300 hover:text-indigo-200">
              Masuk di sini
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-left">
              <label className="block text-xs font-semibold uppercase tracking-widest text-indigo-200" htmlFor="password">
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onInput={handleChange}
                className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-xs font-semibold uppercase tracking-widest text-indigo-200" htmlFor="confirmPassword">
                Ulangi Kata Sandi
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={form.confirmPassword}
                onInput={handleChange}
                className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
                placeholder="••••••••"
              />
            </div>
          </div>

          {localError ? (
            <p className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {localError}
            </p>
          ) : null}

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
              "Daftar"
            )}
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

