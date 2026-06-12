import type { Produto } from "@/lib/produtos";
import { formatBRL } from "@/lib/pdv-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  produtos: Produto[];
}

export function ModalEstoque({ open, onOpenChange, produtos }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Consulta de Estoque</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto rounded-xl border">
          <div className="grid grid-cols-[160px_1fr_120px_120px] gap-2 border-b bg-muted px-4 py-2 text-xs font-bold uppercase text-muted-foreground">
            <span>Código</span>
            <span>Descrição</span>
            <span className="text-center">Estoque</span>
            <span className="text-right">Preço</span>
          </div>
          {produtos.map((p) => (
            <div
              key={p.codigo}
              className="grid grid-cols-[160px_1fr_120px_120px] gap-2 border-b px-4 py-2.5 text-sm tabular-nums"
            >
              <span className="font-mono text-xs">{p.codigo}</span>
              <span>{p.descricao}</span>
              <span
                className={`text-center font-bold ${
                  p.estoque < 10 ? "text-destructive" : ""
                }`}
              >
                {p.estoque} {p.unidade}
              </span>
              <span className="text-right font-semibold">{formatBRL(p.preco)}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
