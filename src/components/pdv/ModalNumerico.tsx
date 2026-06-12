import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  titulo: string;
  label?: string;
  inicial?: string;
  permiteDecimal?: boolean;
  onConfirmar: (valor: number) => void;
  motivoObrigatorio?: boolean;
}

const TECLAS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "←"];

export function ModalNumerico({
  open,
  onOpenChange,
  titulo,
  label = "Valor",
  inicial = "",
  permiteDecimal = true,
  onConfirmar,
  motivoObrigatorio = false,
}: Props) {
  const [valor, setValor] = useState(inicial);
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (open) {
      setValor(inicial);
      setMotivo("");
    }
  }, [open, inicial]);

  function press(t: string) {
    if (t === "←") setValor((v) => v.slice(0, -1));
    else if (t === "." && (!permiteDecimal || valor.includes("."))) return;
    else setValor((v) => (v + t).replace(/^0+(?=\d)/, ""));
  }

  function confirmar() {
    const n = parseFloat(valor || "0");
    if (isNaN(n)) return;
    if (motivoObrigatorio && !motivo.trim()) return;
    onConfirmar(n);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground">
            {label}
          </label>
          <div className="mt-1 h-14 rounded-xl border-2 bg-background px-4 text-right text-3xl font-bold tabular-nums leading-[3.5rem]">
            {valor || "0"}
          </div>
        </div>

        {motivoObrigatorio && (
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Motivo
            </label>
            <input
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border-2 bg-background px-3 text-sm outline-none focus:border-primary"
              placeholder="Ex: troco, depósito..."
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {TECLAS.map((t) => (
            <button
              key={t}
              onClick={() => press(t)}
              className="h-14 rounded-xl border-2 bg-card text-xl font-bold transition-colors hover:bg-muted active:scale-95"
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={confirmar}
          className="h-14 rounded-xl bg-primary text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Confirmar
        </button>
      </DialogContent>
    </Dialog>
  );
}
