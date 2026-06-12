# PDV Mercadinho — Plano de Implementação

> Observação: você pediu "projeto novo". Como não consigo criar outro projeto Lovable a partir daqui, o ideal é você **abrir um novo projeto** e colar este pedido lá; alternativamente, posso **substituir** o conteúdo do projeto atual (cardápio iFood) pelo PDV. O plano abaixo descreve a construção do PDV, válida para qualquer um dos dois caminhos.

## Stack
React 19 + TanStack Start + TypeScript + Tailwind v4 (já configurado). Sem backend — tudo em `localStorage`. Componentes shadcn já disponíveis (Button, Dialog, Input, Table, Card).

## Estrutura de rotas
```
src/routes/
  index.tsx          → Tela do PDV (operação de caixa)
  produtos.tsx       → (futuro) cadastro — fora deste escopo, mas rota preparada
  caixa.tsx          → (futuro) histórico/fechamento detalhado
```
Foco desta entrega: `index.tsx` (PDV completo).

## Dados mock (`src/lib/produtos.ts`)
~20 produtos fictícios de mercadinho com `{ codigo, descricao, preco, estoque, unidade }`:
Coca-Cola 2L, Arroz Tio João 5kg, Feijão Carioca 1kg, Óleo de Soja 900ml, Açúcar 1kg, Café 500g, Leite Integral 1L, Pão de Forma, Manteiga 200g, Sabão em Pó 1kg, Detergente 500ml, Papel Higiênico 12un, Macarrão 500g, Molho de Tomate, Biscoito Recheado, Refrigerante Lata, Água Mineral 1,5L, Cerveja Lata, Banana kg, Tomate kg.

## Estado global (`src/lib/pdv-store.ts`)
Store leve com `useSyncExternalStore`, persistido em `localStorage`:
- `produtos[]` (estoque)
- `vendaAtual: { itens[], desconto }`
- `caixa: { aberto, abertura, sangrias[], suprimentos[], vendas[] }`
- `operador: "João Silva"` (mock)

Ações: `bipar(codigo)`, `alterarQtd(item, qtd)`, `removerItem`, `aplicarDesconto`, `cancelarVenda`, `finalizarVenda(pagamento)`, `sangria(valor, motivo)`, `suprimento(valor, motivo)`, `fecharCaixa()`.

## Layout (`index.tsx`)

```text
┌──────────────────────────────────────────────────────────────┐
│ Mercadinho Bom Preço   12/06/26 14:32   Op: João  ●Aberto    │ HEADER
├───────────────────────────────────────┬──────────────────────┤
│ [ 🔍 Código de barras ____________ ]  │  ATALHOS             │
│                                       │  ┌────────┬────────┐ │
│  # Cód        Descrição  Qtd  Un  Tot │  │Produto │Pesquisar│ │
│  1 7891... Coca 2L       1  9,99 9,99 │  ├────────┼────────┤ │
│  2 7891... Arroz 5kg     2 22,90 45,80│  │Alt Qtd │Remover │ │
│  ...                                  │  ├────────┼────────┤ │
│                                       │  │Cancelar│Sangria │ │
│                                       │  ├────────┼────────┤ │
│                                       │  │Suprim. │Estoque │ │
│                                       │  ├────────┼────────┤ │
│                                       │  │Reimpr. │Fechar  │ │
│  ─────────────────────────────────    │  └────────┴────────┘ │
│  Subtotal      R$ 55,79               │                      │
│  Desconto       R$ 0,00               │  [ FINALIZAR VENDA ] │
│  TOTAL          R$ 55,79  (xl)        │   botão verde grande │
├───────────────────────────────────────┴──────────────────────┤
│  Itens: 2   Produtos: 3   Venda: R$ 55,79                    │ RODAPÉ
└──────────────────────────────────────────────────────────────┘
```

Grid principal: `grid-cols-10` → esquerda `col-span-7`, direita `col-span-3`. Em telas <1024px (tablet retrato), atalhos viram drawer lateral. Otimizado para 15" touch (botões ≥56px de altura, fontes ≥16px, total em ~48px).

## Componentes
- `PdvHeader.tsx` — nome, relógio (atualiza 1/s), operador, badge status.
- `CodigoBarrasInput.tsx` — input com autofocus e refoco após bipagem; Enter dispara `bipar`.
- `GradeItens.tsx` — tabela com colunas Item/Cód/Descrição/Qtd/Un/Total + botões ± e remover por linha; linha selecionada destacada.
- `TotaisVenda.tsx` — Subtotal / Desconto / TOTAL (text-5xl, font-bold, verde).
- `PainelAtalhos.tsx` — grid 2×5 de botões grandes; cada um abre modal/ação. F-keys como atalhos de teclado (F2 pesquisar, F4 cancelar, F8 finalizar, etc.).
- `PdvRodape.tsx` — contadores.
- Modais (shadcn Dialog):
  - `ModalPesquisaProduto` — lista filtrável por descrição/código, clique adiciona.
  - `ModalAlterarQtd` — teclado numérico grande.
  - `ModalSangria` / `ModalSuprimento` — valor + motivo.
  - `ModalEstoque` — tabela read-only dos produtos.
  - `ModalFinalizarVenda` — fluxo de pagamento (abaixo).
  - `ModalComprovante` — recibo imprimível.

## Fluxo de finalização (`ModalFinalizarVenda`)
1. Tela 1 — Total em destaque + 4 botões grandes: Dinheiro / Débito / Crédito / PIX.
2. Tela 2 (Dinheiro): input "Valor Recebido" com teclado numérico → calcula Troco ao vivo. Botão `Confirmar` habilitado quando recebido ≥ total.
3. Tela 2 (Cartão/PIX): mensagem "Confirme o pagamento na maquininha." + botões `Confirmar Venda` / `Voltar`.
4. Ao confirmar:
   - baixa estoque (`produto.estoque -= qtd`),
   - registra venda em `caixa.vendas`,
   - limpa `vendaAtual`,
   - abre `ModalComprovante`.

## Comprovante (`ModalComprovante`)
Componente com largura fixa (`w-[80mm]`/`w-[58mm]` toggle), fonte monoespaçada, CSS `@media print` que esconde o resto da UI. Conteúdo: cabeçalho do mercadinho, data/hora, lista de itens (desc, qtd×un, total), TOTAL, forma de pagamento, troco se houver, "Obrigado pela preferência". Botão `Imprimir` chama `window.print()`.

## Design tokens (`src/styles.css`)
- Fundo `--background: oklch(0.98 0 0)` (quase branco).
- Primária verde mercado `--primary: oklch(0.62 0.18 145)`.
- Destrutiva vermelha para Cancelar/Remover.
- Cinzas neutros para painéis. Sem gradientes. Bordas suaves, sombras discretas.
- Tipografia: Inter; números tabulares (`font-variant-numeric: tabular-nums`) em valores monetários.

## Atalhos de teclado
F2 Pesquisar · F3 Alterar Qtd · F4 Cancelar Venda · F5 Sangria · F6 Suprimento · F7 Estoque · F8 Finalizar · ESC fecha modais. Input de código de barras sempre recupera o foco.

## Fora do escopo desta entrega
- Cadastro/edição de produtos via UI (dados mock servem por ora).
- Tela administrativa de relatórios.
- Integração real com maquininha/impressora (simulada).
- Autenticação de operador.

## Entregáveis
- Tela `/` PDV totalmente funcional com mock + localStorage.
- Comprovante imprimível 58/80mm.
- Pronto para no futuro plugar Lovable Cloud (trocar store por queries reais).

Quer que eu prossiga com este plano **substituindo o cardápio neste projeto**, ou prefere abrir um projeto novo e colar o pedido lá antes de eu implementar?
