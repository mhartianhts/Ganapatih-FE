import { FormEvent, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { ButtonSpinner } from "@/components/ui/spinner";

type PostFormProps = {
  onSubmit: (content: string) => Promise<void>;
  loading?: boolean;
};

export function PostForm({ onSubmit, loading }: PostFormProps) {
  const [content, setContent] = useState("");
  const { showToast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = content.trim();
    if (trimmed.length === 0) {
      showToast("Konten postingan tidak boleh kosong.", "warning");
      return;
    }
    if (trimmed.length > 200) {
      showToast("Konten postingan maksimal 200 karakter.", "warning");
      return;
    }

    try {
      await onSubmit(trimmed);
      setContent("");
      showToast("Postingan berhasil dibuat!", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal membuat postingan. Coba lagi.";
      showToast(message, "error");
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h2 className="text-lg font-semibold">Buat Postingan</h2>
      <p className="text-sm text-slate-300/80">Bagikan kabar terbaru kepada pengikut Anda (maks. 200 karakter).</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
          rows={4}
          maxLength={200}
          placeholder="Apa yang sedang Anda pikirkan?"
          disabled={loading}
          className="w-full resize-none rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className={`text-xs ${content.length > 180 ? 'text-amber-300' : content.length > 150 ? 'text-yellow-300' : 'text-slate-400'}`}>
            {content.length} / 200 karakter
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setContent("")}
              disabled={loading || content.length === 0}
              className="flex-1 rounded-full border border-white/15 px-4 py-2 text-sm text-white transition-all hover:scale-105 hover:bg-white/10 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-50 sm:flex-none"
            >
              Bersihkan
            </button>
            <button
              type="submit"
              disabled={loading || content.trim().length === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:bg-indigo-400 hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-indigo-500/60 disabled:shadow-none sm:flex-none"
            >
              {loading ? (
                <>
                  <ButtonSpinner />
                  <span>Mengirim...</span>
                </>
              ) : (
                "Kirim"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

