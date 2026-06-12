import {
  Search, Pencil, Trash2, XCircle, ArrowDownCircle,
  ArrowUpCircle, Package, Printer, LockKeyhole, Percent,
} from "lucide-react";

export type AtalhoAcao =
  | "pesquisar" | "alterarQtd" | "remover" | "cancelar"
  | "sangria" | "suprimento" | "estoque" | "reimprimir"
  | "fechar" | "desconto";

interface Props {
  onAction: (a: AtalhoAcao) => void;
}

const atalhos: { id: AtalhoAcao; label: string; tecla: string; icon: typeof Search; tone?: "danger" }[] = [
  { id: "pesquisar", label: "Pesquisar", tecla: "F2", icon: Search },
  { id: "alterarQtd", label: "Alterar Qtd", tecla: "F3", icon: Pencil },
  { id: "desconto", label: "Desconto", tecla: "F4", icon: Percent },
  { id: "remover", label: "Remover", tecla: "Del", icon: Trash2 },
  { id: "sangria", label: "Sangria", tecla: "F5", icon: ArrowUpCircle },
  { id: "suprimento", label: "Suprimento", tecla: "F6", icon: ArrowDownCircle },
  { id: "estoque", label: "Estoque", tecla: "F7", icon: Package },
  { id: "reimprimir", label: "Reimprimir", tecla: "F9", icon: Printer },
  { id: "cancelar", label: "Cancelar Venda", tecla: "F4", icon: XCircle, tone: "danger" },
  { id: "fechar", label: "Fechar Caixa", tecla: "F10", icon: LockKeyhole, tone: "danger" },
];

export function PainelAtalhos({ onAction }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5" data-keep-focus>
      {atalhos.map((a) => {
        const Icon = a.icon;
        const danger = a.tone === "danger";
        return (
          <button
            key={a.id}
            onClick={() => onAction(a.id)}
            className={`group flex h-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-2 py-2 text-center transition-all active:scale-95 ${
              danger
                ? "border-destructive/20 bg-card text-destructive hover:bg-destructive/10"
                : "border-border bg-card text-foreground hover:border-primary hover:bg-primary/5"
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-[13px] font-semibold leading-tight">{a.label}</span>
            <span className="rounded bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
              {a.tecla}
            </span>
          </button>
        );
      })}
    </div>
  );
}
