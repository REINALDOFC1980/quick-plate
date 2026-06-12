export interface Produto {
  codigo: string;
  descricao: string;
  preco: number;
  estoque: number;
  unidade: string;
}

export const produtosIniciais: Produto[] = [
  { codigo: "7891000000001", descricao: "Coca-Cola 2L", preco: 9.99, estoque: 48, unidade: "UN" },
  { codigo: "7891000000002", descricao: "Arroz Tio João 5kg", preco: 22.9, estoque: 30, unidade: "UN" },
  { codigo: "7891000000003", descricao: "Feijão Carioca 1kg", preco: 8.49, estoque: 60, unidade: "UN" },
  { codigo: "7891000000004", descricao: "Óleo de Soja 900ml", preco: 7.29, estoque: 40, unidade: "UN" },
  { codigo: "7891000000005", descricao: "Açúcar Refinado 1kg", preco: 4.99, estoque: 80, unidade: "UN" },
  { codigo: "7891000000006", descricao: "Café Torrado 500g", preco: 18.9, estoque: 25, unidade: "UN" },
  { codigo: "7891000000007", descricao: "Leite Integral 1L", preco: 5.49, estoque: 100, unidade: "UN" },
  { codigo: "7891000000008", descricao: "Pão de Forma 500g", preco: 8.9, estoque: 20, unidade: "UN" },
  { codigo: "7891000000009", descricao: "Manteiga com Sal 200g", preco: 12.5, estoque: 18, unidade: "UN" },
  { codigo: "7891000000010", descricao: "Sabão em Pó 1kg", preco: 15.9, estoque: 35, unidade: "UN" },
  { codigo: "7891000000011", descricao: "Detergente 500ml", preco: 2.99, estoque: 120, unidade: "UN" },
  { codigo: "7891000000012", descricao: "Papel Higiênico 12un", preco: 21.9, estoque: 28, unidade: "UN" },
  { codigo: "7891000000013", descricao: "Macarrão Espaguete 500g", preco: 4.49, estoque: 70, unidade: "UN" },
  { codigo: "7891000000014", descricao: "Molho de Tomate 340g", preco: 3.29, estoque: 90, unidade: "UN" },
  { codigo: "7891000000015", descricao: "Biscoito Recheado 130g", preco: 2.79, estoque: 150, unidade: "UN" },
  { codigo: "7891000000016", descricao: "Refrigerante Lata 350ml", preco: 4.49, estoque: 200, unidade: "UN" },
  { codigo: "7891000000017", descricao: "Água Mineral 1,5L", preco: 3.49, estoque: 80, unidade: "UN" },
  { codigo: "7891000000018", descricao: "Cerveja Lata 350ml", preco: 4.99, estoque: 240, unidade: "UN" },
  { codigo: "7891000000019", descricao: "Banana Prata", preco: 5.99, estoque: 50, unidade: "KG" },
  { codigo: "7891000000020", descricao: "Tomate Italiano", preco: 7.49, estoque: 40, unidade: "KG" },
];
