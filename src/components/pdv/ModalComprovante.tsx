import { Printer, X } from "lucide-react";
import type { VendaFinalizada } from "@/lib/pdv-store";
import { formatBRL } from "@/lib/pdv-store";

interface Props {
  open: boolean;
  onClose: () => void;
  venda: VendaFinalizada | null;
  mercado: string;
}

const formaLabel = {
  dinheiro: "Dinheiro",
  debito: "Cartão Débito",
  credito: "Cartão Crédito",
  pix: "PIX",
};

export function ModalComprovante({ open, onClose, venda, mercado }: Props) {
  if (!open || !venda) return null;
  const dt = new Date(venda.data);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:bg-transparent print:p-0">
      <div className="flex max-h-[95vh] flex-col rounded-2xl bg-card shadow-2xl print:rounded-none print:shadow-none">
        <div className="flex items-center justify-between border-b px-4 py-3 print:hidden">
          <h2 className="font-semibold">Comprovante de Venda</h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          id="comprovante"
          className="w-[80mm] overflow-y-auto p-4 font-mono text-[12px] leading-tight text-foreground"
        >
          <div className="text-center">
            <div className="text-sm font-bold">{mercado}</div>
            <div className="text-[10px]">CUPOM NÃO FISCAL</div>
            <div className="text-[10px]">
              {dt.toLocaleDateString("pt-BR")} {dt.toLocaleTimeString("pt-BR")}
            </div>
          </div>
          <div className="my-2 border-t border-dashed border-foreground/40" />
          <div className="text-[10px]">
            <div className="grid grid-cols-[1fr_50px] font-bold">
              <span>ITEM</span>
              <span className="text-right">TOTAL</span>
            </div>
            {venda.itens.map((i, idx) => (
              <div key={idx} className="mt-1">
                <div>{i.descricao}</div>
                <div className="grid grid-cols-[1fr_50px]">
                  <span>
                    {i.quantidade} {i.unidade} x {formatBRL(i.preco)}
                  </span>
                  <span className="text-right">{formatBRL(i.preco * i.quantidade)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="my-2 border-t border-dashed border-foreground/40" />
          <div className="flex justify-between">
            <span>SUBTOTAL</span>
            <span>{formatBRL(venda.subtotal)}</span>
          </div>
          {venda.desconto > 0 && (
            <div className="flex justify-between">
              <span>DESCONTO</span>
              <span>- {formatBRL(venda.desconto)}</span>
            </div>
          )}
          <div className="mt-1 flex justify-between text-base font-bold">
            <span>TOTAL</span>
            <span>{formatBRL(venda.total)}</span>
          </div>
          <div className="mt-2 border-t border-dashed border-foreground/40 pt-2">
            <div className="flex justify-between">
              <span>PAGAMENTO</span>
              <span>{formaLabel[venda.forma]}</span>
            </div>
            {venda.recebido !== undefined && (
              <>
                <div className="flex justify-between">
                  <span>RECEBIDO</span>
                  <span>{formatBRL(venda.recebido)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>TROCO</span>
                  <span>{formatBRL(venda.troco ?? 0)}</span>
                </div>
              </>
            )}
          </div>
          <div className="my-2 border-t border-dashed border-foreground/40" />
          <div className="text-center text-[11px]">
            Obrigado pela preferência!
            <br />
            Volte sempre.
          </div>
        </div>

        <div className="flex gap-2 border-t p-3 print:hidden">
          <button
            onClick={onClose}
            className="h-12 flex-1 rounded-xl border-2 bg-card font-semibold hover:bg-muted"
          >
            Fechar
          </button>
          <button
            onClick={() => window.print()}
            className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90"
          >
            <Printer className="h-4 w-4" /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
