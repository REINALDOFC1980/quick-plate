import { useEffect, useState } from "react";
import { Banknote, CreditCard, Smartphone, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FormaPagamento } from "@/lib/pdv-store";
import { formatBRL } from "@/lib/pdv-store";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  total: number;
  onConfirmar: (forma: FormaPagamento, recebido?: number) => void;
}

const formas: { id: FormaPagamento; label: string; icon: typeof Banknote }[] = [
  { id: "dinheiro", label: "Dinheiro", icon: Banknote },
  { id: "debito", label: "Cartão Débito", icon: CreditCard },
  { id: "credito", label: "Cartão Crédito", icon: CreditCard },
  { id: "pix", label: "PIX", icon: Smartphone },
];

export function ModalFinalizarVenda({ open, onOpenChange, total, onConfirmar }: Props) {
  const [forma, setForma] = useState<FormaPagamento | null>(null);
  const [recebido, setRecebido] = useState("");

  useEffect(() => {
    if (open) {
      setForma(null);
      setRecebido("");
    }
  }, [open]);

  const recebidoNum = parseFloat(recebido.replace(",", ".")) || 0;
  const troco = Math.max(0, recebidoNum - total);
  const dinheiroOk = forma === "dinheiro" ? recebidoNum >= total : true;

  function confirmar() {
    if (!forma || !dinheiroOk) return;
    onConfirmar(forma, forma === "dinheiro" ? recebidoNum : undefined);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Finalizar Venda</DialogTitle>
        </DialogHeader>

        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Total da Compra
          </p>
          <p className="mt-1 text-5xl font-black tabular-nums text-primary">
            {formatBRL(total)}
          </p>
        </div>

        {!forma ? (
          <div className="grid grid-cols-2 gap-3">
            {formas.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setForma(f.id)}
                  className="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-card font-semibold transition-all hover:border-primary hover:bg-primary/5 active:scale-95"
                >
                  <Icon className="h-7 w-7" />
                  {f.label}
                </button>
              );
            })}
          </div>
        ) : forma === "dinheiro" ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Valor Recebido
              </label>
              <input
                autoFocus
                value={recebido}
                onChange={(e) => setRecebido(e.target.value.replace(/[^0-9.,]/g, ""))}
                placeholder="0,00"
                inputMode="decimal"
                className="mt-1 h-16 w-full rounded-xl border-2 bg-background px-4 text-right text-3xl font-bold tabular-nums outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Troco
              </span>
              <span className="text-2xl font-bold tabular-nums text-primary">
                {formatBRL(troco)}
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setForma(null)}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border-2 bg-card font-semibold transition-colors hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <button
                onClick={confirmar}
                disabled={!dinheiroOk}
                className="flex h-14 flex-[2] items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
              >
                <CheckCircle2 className="h-5 w-5" /> Confirmar Venda
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border-2 border-dashed p-6 text-center">
              <Smartphone className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-3 text-base font-semibold">
                Confirme o pagamento na maquininha
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Forma:{" "}
                {forma === "pix" ? "PIX" : forma === "credito" ? "Crédito" : "Débito"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setForma(null)}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border-2 bg-card font-semibold transition-colors hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <button
                onClick={confirmar}
                className="flex h-14 flex-[2] items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <CheckCircle2 className="h-5 w-5" /> Confirmar Venda
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
