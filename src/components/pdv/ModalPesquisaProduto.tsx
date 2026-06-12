import { useState } from "react";
import type { Produto } from "@/lib/produtos";
import { formatBRL } from "@/lib/pdv-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  produtos: Produto[];
  onSelecionar: (codigo: string) => void;
}

export function ModalPesquisaProduto({ open, onOpenChange, produtos, onSelecionar }: Props) {
  const [busca, setBusca] = useState("");
  const filtrados = produtos.filter(
    (p) =>
      p.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      p.codigo.includes(busca),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pesquisar Produto</DialogTitle>
        </DialogHeader>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          autoFocus
          placeholder="Digite descrição ou código..."
          className="h-12 w-full rounded-xl border-2 bg-background px-4 text-base outline-none focus:border-primary"
        />
        <div className="max-h-[60vh] overflow-y-auto rounded-xl border">
          {filtrados.map((p) => (
            <button
              key={p.codigo}
              onClick={() => {
                onSelecionar(p.codigo);
                onOpenChange(false);
                setBusca("");
              }}
              className="grid w-full grid-cols-[160px_1fr_100px_120px] items-center gap-2 border-b px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
            >
              <span className="font-mono text-xs">{p.codigo}</span>
              <span className="font-medium">{p.descricao}</span>
              <span className="text-xs text-muted-foreground">Est: {p.estoque}</span>
              <span className="text-right font-bold tabular-nums">{formatBRL(p.preco)}</span>
            </button>
          ))}
          {filtrados.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhum produto encontrado
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
