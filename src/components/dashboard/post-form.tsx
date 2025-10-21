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
    <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-indigo-500/10 sm:p-7">
      {/* Header Section */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Buat Postingan</h2>
          </div>
        </div>
        <p className="ml-13 text-sm leading-relaxed text-slate-300/80 sm:text-base">
          Bagikan kabar terbaru kepada pengikut Anda (maks. 200 karakter).
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            rows={5}
            maxLength={200}
            placeholder="Apa yang sedang Anda pikirkan?"
            disabled={loading}
            className="w-full resize-none rounded-2xl border border-white/20 bg-black/30 px-4 py-4 text-sm text-white placeholder-slate-400 shadow-inner outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-black/40 focus:ring-4 focus:ring-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          />
          <div className="absolute bottom-3 right-3">
            <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              content.length > 180 
                ? 'bg-red-500/20 text-red-300 ring-1 ring-red-400/30' 
                : content.length > 150 
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30' 
                : 'bg-slate-500/20 text-slate-400'
            }`}>
              {content.length} / 200
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setContent("")}
            disabled={loading || content.length === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/30 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:border-white/30 hover:bg-black/40 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-50 sm:flex-none sm:text-base"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Bersihkan</span>
          </button>
          <button
            type="submit"
            disabled={loading || content.trim().length === 0}
            className="group/btn flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:scale-100 disabled:from-indigo-500/60 disabled:to-purple-600/60 disabled:shadow-none sm:flex-none sm:text-base"
          >
            {loading ? (
              <>
                <ButtonSpinner />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Kirim</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

