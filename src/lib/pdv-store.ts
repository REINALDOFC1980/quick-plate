import { useSyncExternalStore } from "react";
import { produtosIniciais, type Produto } from "./produtos";

export interface ItemVenda {
  codigo: string;
  descricao: string;
  preco: number;
  quantidade: number;
  unidade: string;
}

export type FormaPagamento = "dinheiro" | "debito" | "credito" | "pix";

export interface VendaFinalizada {
  id: string;
  data: string;
  itens: ItemVenda[];
  subtotal: number;
  desconto: number;
  total: number;
  forma: FormaPagamento;
  recebido?: number;
  troco?: number;
}

export interface MovimentoCaixa {
  id: string;
  data: string;
  valor: number;
  motivo: string;
}

interface PdvState {
  produtos: Produto[];
  vendaAtual: { itens: ItemVenda[]; desconto: number };
  caixa: {
    aberto: boolean;
    abertura: string;
    sangrias: MovimentoCaixa[];
    suprimentos: MovimentoCaixa[];
    vendas: VendaFinalizada[];
  };
  operador: string;
  mercado: string;
}

const KEY = "pdv-state-v1";

function load(): PdvState {
  if (typeof window === "undefined") return inicial();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return inicial();
}

function inicial(): PdvState {
  return {
    produtos: produtosIniciais,
    vendaAtual: { itens: [], desconto: 0 },
    caixa: {
      aberto: true,
      abertura: new Date().toISOString(),
      sangrias: [],
      suprimentos: [],
      vendas: [],
    },
    operador: "João Silva",
    mercado: "Mercadinho Bom Preço",
  };
}

let state: PdvState = load();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function uid() {
  return (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2));
}

export const pdvStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => state,
  getServer: () => inicial(),

  bipar(codigo: string): { ok: boolean; msg?: string } {
    const cod = codigo.trim();
    if (!cod) return { ok: false };
    const produto = state.produtos.find((p) => p.codigo === cod);
    if (!produto) return { ok: false, msg: "Produto não encontrado" };
    return this.adicionarProduto(produto.codigo, 1);
  },

  adicionarProduto(codigo: string, qtd: number) {
    const produto = state.produtos.find((p) => p.codigo === codigo);
    if (!produto) return { ok: false, msg: "Produto não encontrado" };
    const itens = [...state.vendaAtual.itens];
    const idx = itens.findIndex((i) => i.codigo === codigo);
    if (idx >= 0) {
      itens[idx] = { ...itens[idx], quantidade: itens[idx].quantidade + qtd };
    } else {
      itens.push({
        codigo: produto.codigo,
        descricao: produto.descricao,
        preco: produto.preco,
        quantidade: qtd,
        unidade: produto.unidade,
      });
    }
    state = { ...state, vendaAtual: { ...state.vendaAtual, itens } };
    emit();
    return { ok: true };
  },

  alterarQtd(codigo: string, novaQtd: number) {
    const itens = state.vendaAtual.itens
      .map((i) => (i.codigo === codigo ? { ...i, quantidade: novaQtd } : i))
      .filter((i) => i.quantidade > 0);
    state = { ...state, vendaAtual: { ...state.vendaAtual, itens } };
    emit();
  },

  removerItem(codigo: string) {
    const itens = state.vendaAtual.itens.filter((i) => i.codigo !== codigo);
    state = { ...state, vendaAtual: { ...state.vendaAtual, itens } };
    emit();
  },

  aplicarDesconto(valor: number) {
    state = { ...state, vendaAtual: { ...state.vendaAtual, desconto: Math.max(0, valor) } };
    emit();
  },

  cancelarVenda() {
    state = { ...state, vendaAtual: { itens: [], desconto: 0 } };
    emit();
  },

  finalizarVenda(forma: FormaPagamento, recebido?: number): VendaFinalizada {
    const subtotal = state.vendaAtual.itens.reduce((s, i) => s + i.preco * i.quantidade, 0);
    const desconto = Math.min(state.vendaAtual.desconto, subtotal);
    const total = subtotal - desconto;
    const troco = forma === "dinheiro" && recebido ? Math.max(0, recebido - total) : undefined;

    const venda: VendaFinalizada = {
      id: uid(),
      data: new Date().toISOString(),
      itens: state.vendaAtual.itens,
      subtotal,
      desconto,
      total,
      forma,
      recebido,
      troco,
    };

    // baixa de estoque
    const produtos = state.produtos.map((p) => {
      const it = venda.itens.find((i) => i.codigo === p.codigo);
      return it ? { ...p, estoque: p.estoque - it.quantidade } : p;
    });

    state = {
      ...state,
      produtos,
      vendaAtual: { itens: [], desconto: 0 },
      caixa: { ...state.caixa, vendas: [...state.caixa.vendas, venda] },
    };
    emit();
    return venda;
  },

  sangria(valor: number, motivo: string) {
    state = {
      ...state,
      caixa: {
        ...state.caixa,
        sangrias: [
          ...state.caixa.sangrias,
          { id: uid(), data: new Date().toISOString(), valor, motivo },
        ],
      },
    };
    emit();
  },

  suprimento(valor: number, motivo: string) {
    state = {
      ...state,
      caixa: {
        ...state.caixa,
        suprimentos: [
          ...state.caixa.suprimentos,
          { id: uid(), data: new Date().toISOString(), valor, motivo },
        ],
      },
    };
    emit();
  },

  fecharCaixa() {
    state = { ...state, caixa: { ...state.caixa, aberto: false } };
    emit();
  },

  resetar() {
    state = inicial();
    emit();
  },
};

export function usePdv() {
  return useSyncExternalStore(pdvStore.subscribe, pdvStore.get, pdvStore.getServer);
}

export function calcularTotais(itens: ItemVenda[], desconto: number) {
  const subtotal = itens.reduce((s, i) => s + i.preco * i.quantidade, 0);
  const total = Math.max(0, subtotal - desconto);
  const qtdItens = itens.length;
  const qtdProdutos = itens.reduce((s, i) => s + i.quantidade, 0);
  return { subtotal, desconto, total, qtdItens, qtdProdutos };
}

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
