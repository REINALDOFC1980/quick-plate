import { formatBRL } from "@/lib/pdv-store";

interface Props {
  qtdItens: number;
  qtdProdutos: number;
  total: number;
}

export function PdvRodape({ qtdItens, qtdProdutos, total }: Props) {
  return (
    <footer className="grid grid-cols-3 border-t bg-card px-6 py-3 text-sm">
      <div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Itens
        </span>
        <div className="text-lg font-bold tabular-nums">{qtdItens}</div>
      </div>
      <div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Produtos
        </span>
        <div className="text-lg font-bold tabular-nums">{qtdProdutos}</div>
      </div>
      <div className="text-right">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Valor da Venda
        </span>
        <div className="text-lg font-bold tabular-nums text-primary">
          {formatBRL(total)}
        </div>
      </div>
    </footer>
  );
}
