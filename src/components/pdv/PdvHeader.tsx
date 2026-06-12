import { useEffect, useState } from "react";
import { Store, User, Clock, CircleDot } from "lucide-react";

interface Props {
  mercado: string;
  operador: string;
  caixaAberto: boolean;
}

export function PdvHeader({ mercado, operador, caixaAberto }: Props) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const data = now.toLocaleDateString("pt-BR");
  const hora = now.toLocaleTimeString("pt-BR");

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b bg-card px-6 py-3 shadow-sm md:flex md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Store className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold leading-tight">{mercado}</h1>
          <p className="text-xs text-muted-foreground">PDV — Frente de Caixa</p>
        </div>
      </div>

      <div className="flex items-center gap-5 text-sm">
        <div className="hidden items-center gap-2 md:flex">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="tabular-nums font-medium">
            {data} · {hora}
          </span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{operador}</span>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            caixaAberto
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          <CircleDot className="h-3.5 w-3.5" />
          {caixaAberto ? "Caixa Aberto" : "Caixa Fechado"}
        </div>
      </div>
    </header>
  );
}
