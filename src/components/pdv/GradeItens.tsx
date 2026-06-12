import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import type { ItemVenda } from "@/lib/pdv-store";
import { formatBRL } from "@/lib/pdv-store";

interface Props {
  itens: ItemVenda[];
  onAlterarQtd: (codigo: string, qtd: number) => void;
  onRemover: (codigo: string) => void;
}

export function GradeItens({ itens, onAlterarQtd, onRemover }: Props) {
  return (
    <div className="flex-1 overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid grid-cols-[60px_160px_1fr_140px_120px_140px_60px] gap-2 border-b bg-muted/60 px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <div>Item</div>
        <div>Código</div>
        <div>Descrição</div>
        <div className="text-center">Quantidade</div>
        <div className="text-right">Unitário</div>
        <div className="text-right">Total</div>
        <div></div>
      </div>

      <div className="max-h-[calc(100vh-440px)] overflow-y-auto">
        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 opacity-30" />
            <p className="text-sm">Bipe um produto para iniciar a venda</p>
          </div>
        ) : (
          itens.map((item, idx) => (
            <div
              key={item.codigo}
              className="grid grid-cols-[60px_160px_1fr_140px_120px_140px_60px] items-center gap-2 border-b px-4 py-3 text-sm tabular-nums transition-colors hover:bg-muted/30"
            >
              <div className="font-semibold text-muted-foreground">{idx + 1}</div>
              <div className="font-mono text-xs">{item.codigo}</div>
              <div className="truncate font-medium">{item.descricao}</div>
              <div className="flex items-center justify-center gap-1" data-keep-focus>
                <button
                  onClick={() => onAlterarQtd(item.codigo, item.quantidade - 1)}
                  className="grid h-8 w-8 place-items-center rounded-lg border bg-background transition-colors hover:bg-muted"
                  aria-label="Diminuir"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-bold">{item.quantidade}</span>
                <button
                  onClick={() => onAlterarQtd(item.codigo, item.quantidade + 1)}
                  className="grid h-8 w-8 place-items-center rounded-lg border bg-background transition-colors hover:bg-muted"
                  aria-label="Aumentar"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-right">{formatBRL(item.preco)}</div>
              <div className="text-right font-semibold">
                {formatBRL(item.preco * item.quantidade)}
              </div>
              <div className="text-right" data-keep-focus>
                <button
                  onClick={() => onRemover(item.codigo)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-destructive transition-colors hover:bg-destructive/10"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
