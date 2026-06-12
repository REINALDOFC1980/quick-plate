import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PdvHeader } from "@/components/pdv/PdvHeader";
import { CodigoBarrasInput } from "@/components/pdv/CodigoBarrasInput";
import { GradeItens } from "@/components/pdv/GradeItens";
import { TotaisVenda } from "@/components/pdv/TotaisVenda";
import { PainelAtalhos, type AtalhoAcao } from "@/components/pdv/PainelAtalhos";
import { PdvRodape } from "@/components/pdv/PdvRodape";
import { ModalPesquisaProduto } from "@/components/pdv/ModalPesquisaProduto";
import { ModalNumerico } from "@/components/pdv/ModalNumerico";
import { ModalEstoque } from "@/components/pdv/ModalEstoque";
import { ModalFinalizarVenda } from "@/components/pdv/ModalFinalizarVenda";
import { ModalComprovante } from "@/components/pdv/ModalComprovante";
import {
  pdvStore,
  usePdv,
  calcularTotais,
  type FormaPagamento,
  type VendaFinalizada,
} from "@/lib/pdv-store";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: PdvPage,
  head: () => ({
    meta: [
      { title: "PDV — Mercadinho Bom Preço" },
      { name: "description", content: "Sistema de ponto de venda para mercadinho de bairro" },
    ],
  }),
});

type ModalKey =
  | null | "pesquisar" | "alterarQtd" | "desconto" | "sangria"
  | "suprimento" | "estoque" | "finalizar" | "comprovante";

function PdvPage() {
  const state = usePdv();
  const [modal, setModal] = useState<ModalKey>(null);
  const [ultimaVenda, setUltimaVenda] = useState<VendaFinalizada | null>(null);
  const [itemSelecionado, setItemSelecionado] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const totais = useMemo(
    () => calcularTotais(state.vendaAtual.itens, state.vendaAtual.desconto),
    [state.vendaAtual],
  );

  useEffect(() => {
    const ultimo = state.vendaAtual.itens[state.vendaAtual.itens.length - 1];
    if (ultimo) setItemSelecionado(ultimo.codigo);
  }, [state.vendaAtual.itens.length]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function handleAtalho(a: AtalhoAcao) {
    switch (a) {
      case "pesquisar": setModal("pesquisar"); break;
      case "alterarQtd":
        if (itemSelecionado) setModal("alterarQtd");
        else showToast("Selecione um item primeiro");
        break;
      case "desconto": setModal("desconto"); break;
      case "remover":
        if (itemSelecionado) {
          pdvStore.removerItem(itemSelecionado);
          setItemSelecionado(null);
        }
        break;
      case "cancelar":
        if (state.vendaAtual.itens.length && confirm("Cancelar venda atual?")) {
          pdvStore.cancelarVenda();
        }
        break;
      case "sangria": setModal("sangria"); break;
      case "suprimento": setModal("suprimento"); break;
      case "estoque": setModal("estoque"); break;
      case "reimprimir":
        if (ultimaVenda) setModal("comprovante");
        else showToast("Nenhuma venda recente");
        break;
      case "fechar":
        if (confirm("Fechar o caixa?")) {
          pdvStore.fecharCaixa();
          showToast("Caixa fechado");
        }
        break;
    }
  }

  // Atalhos de teclado
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "F2") { e.preventDefault(); handleAtalho("pesquisar"); }
      else if (e.key === "F3") { e.preventDefault(); handleAtalho("alterarQtd"); }
      else if (e.key === "F4") { e.preventDefault(); handleAtalho("desconto"); }
      else if (e.key === "F5") { e.preventDefault(); handleAtalho("sangria"); }
      else if (e.key === "F6") { e.preventDefault(); handleAtalho("suprimento"); }
      else if (e.key === "F7") { e.preventDefault(); handleAtalho("estoque"); }
      else if (e.key === "F8") {
        e.preventDefault();
        if (state.vendaAtual.itens.length) setModal("finalizar");
      }
      else if (e.key === "F9") { e.preventDefault(); handleAtalho("reimprimir"); }
      else if (e.key === "F10") { e.preventDefault(); handleAtalho("fechar"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function finalizar(forma: FormaPagamento, recebido?: number) {
    const venda = pdvStore.finalizarVenda(forma, recebido);
    setUltimaVenda(venda);
    setModal("comprovante");
  }

  const itemSel = state.vendaAtual.itens.find((i) => i.codigo === itemSelecionado);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground print:hidden">
      <PdvHeader
        mercado={state.mercado}
        operador={state.operador}
        caixaAberto={state.caixa.aberto}
      />

      <main className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-10">
        {/* ESQUERDA */}
        <section className="flex flex-col gap-4 lg:col-span-7">
          <CodigoBarrasInput onBipar={(c) => pdvStore.bipar(c)} />
          <GradeItens
            itens={state.vendaAtual.itens}
            onAlterarQtd={(c, q) => pdvStore.alterarQtd(c, q)}
            onRemover={(c) => pdvStore.removerItem(c)}
          />
          <TotaisVenda
            subtotal={totais.subtotal}
            desconto={totais.desconto}
            total={totais.total}
          />
        </section>

        {/* DIREITA */}
        <aside className="flex flex-col gap-4 lg:col-span-3" data-keep-focus>
          <PainelAtalhos onAction={handleAtalho} />
          <button
            disabled={!state.vendaAtual.itens.length}
            onClick={() => setModal("finalizar")}
            className="flex h-20 items-center justify-center gap-3 rounded-2xl bg-primary text-lg font-black uppercase tracking-wider text-primary-foreground shadow-lg transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40"
          >
            <CheckCircle2 className="h-6 w-6" />
            Finalizar Venda
            <span className="rounded bg-primary-foreground/20 px-2 py-0.5 text-xs">
              F8
            </span>
          </button>
        </aside>
      </main>

      <PdvRodape
        qtdItens={totais.qtdItens}
        qtdProdutos={totais.qtdProdutos}
        total={totais.total}
      />

      {/* Modais */}
      <ModalPesquisaProduto
        open={modal === "pesquisar"}
        onOpenChange={(o) => setModal(o ? "pesquisar" : null)}
        produtos={state.produtos}
        onSelecionar={(c) => pdvStore.adicionarProduto(c, 1)}
      />
      <ModalNumerico
        open={modal === "alterarQtd"}
        onOpenChange={(o) => setModal(o ? "alterarQtd" : null)}
        titulo={`Alterar Qtd — ${itemSel?.descricao ?? ""}`}
        label="Nova quantidade"
        permiteDecimal={false}
        inicial={String(itemSel?.quantidade ?? "")}
        onConfirmar={(v) => itemSel && pdvStore.alterarQtd(itemSel.codigo, v)}
      />
      <ModalNumerico
        open={modal === "desconto"}
        onOpenChange={(o) => setModal(o ? "desconto" : null)}
        titulo="Aplicar Desconto"
        label="Valor do desconto (R$)"
        inicial={String(state.vendaAtual.desconto || "")}
        onConfirmar={(v) => pdvStore.aplicarDesconto(v)}
      />
      <ModalNumerico
        open={modal === "sangria"}
        onOpenChange={(o) => setModal(o ? "sangria" : null)}
        titulo="Sangria (retirada de caixa)"
        label="Valor"
        motivoObrigatorio
        onConfirmar={(v) => {
          pdvStore.sangria(v, "Sangria");
          showToast("Sangria registrada");
        }}
      />
      <ModalNumerico
        open={modal === "suprimento"}
        onOpenChange={(o) => setModal(o ? "suprimento" : null)}
        titulo="Suprimento (entrada de caixa)"
        label="Valor"
        motivoObrigatorio
        onConfirmar={(v) => {
          pdvStore.suprimento(v, "Suprimento");
          showToast("Suprimento registrado");
        }}
      />
      <ModalEstoque
        open={modal === "estoque"}
        onOpenChange={(o) => setModal(o ? "estoque" : null)}
        produtos={state.produtos}
      />
      <ModalFinalizarVenda
        open={modal === "finalizar"}
        onOpenChange={(o) => setModal(o ? "finalizar" : null)}
        total={totais.total}
        onConfirmar={finalizar}
      />
      <ModalComprovante
        open={modal === "comprovante"}
        onClose={() => setModal(null)}
        venda={ultimaVenda}
        mercado={state.mercado}
      />

      {toast && (
        <div className="pointer-events-none fixed bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
