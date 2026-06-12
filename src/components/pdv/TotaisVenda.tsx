import { formatBRL } from "@/lib/pdv-store";

interface Props {
  subtotal: number;
  desconto: number;
  total: number;
}

export function TotaisVenda({ subtotal, desconto, total }: Props) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Subtotal</span>
        <span className="tabular-nums">{formatBRL(subtotal)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
        <span>Desconto</span>
        <span className="tabular-nums">- {formatBRL(desconto)}</span>
      </div>
      <div className="mt-3 flex items-end justify-between border-t pt-3">
        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Total
        </span>
        <span className="text-5xl font-black tabular-nums text-primary">
          {formatBRL(total)}
        </span>
      </div>
    </div>
  );
}
