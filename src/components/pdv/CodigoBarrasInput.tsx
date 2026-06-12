import { useEffect, useRef, useState } from "react";
import { Barcode } from "lucide-react";

interface Props {
  onBipar: (codigo: string) => { ok: boolean; msg?: string };
}

export function CodigoBarrasInput({ onBipar }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    ref.current?.focus();
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-keep-focus]") || target.closest("input, textarea, button, [role=dialog]")) return;
      ref.current?.focus();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valor.trim()) return;
    const r = onBipar(valor);
    if (!r.ok) {
      setErro(r.msg ?? "Erro");
      setTimeout(() => setErro(null), 2000);
    } else {
      setErro(null);
    }
    setValor("");
    ref.current?.focus();
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-card p-4 shadow-sm">
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Barcode className="h-4 w-4" />
        Código de Barras
      </label>
      <div className="flex gap-2">
        <input
          ref={ref}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Bipe ou digite o código..."
          className="h-14 flex-1 rounded-xl border-2 border-input bg-background px-4 text-xl font-semibold tabular-nums tracking-wider outline-none transition-colors focus:border-primary"
          autoComplete="off"
          inputMode="numeric"
        />
        <button
          type="submit"
          className="h-14 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Adicionar
        </button>
      </div>
      {erro && (
        <p className="mt-2 text-sm font-medium text-destructive">{erro}</p>
      )}
    </form>
  );
}
