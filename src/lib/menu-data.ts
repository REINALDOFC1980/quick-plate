import moquecaImg from "@/assets/moqueca.jpg";
import picanhaImg from "@/assets/picanha.jpg";
import feijoadaImg from "@/assets/feijoada.jpg";
import frangoImg from "@/assets/frango.jpg";
import coxinhaImg from "@/assets/coxinha.jpg";
import pastelImg from "@/assets/pastel.jpg";
import bolinhoImg from "@/assets/bolinho-bacalhau.jpg";
import sucosImg from "@/assets/sucos.jpg";
import guaranaImg from "@/assets/guarana.jpg";
import caipirinhaImg from "@/assets/caipirinha.jpg";

export interface ProductSize {
  name: string;
  price: number;
}

export interface ProductExtra {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  sizes: ProductSize[];
  extras: ProductExtra[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "almoco", name: "Almoço", icon: "🍽️" },
  { id: "petiscos", name: "Petiscos", icon: "🍢" },
  { id: "bebidas", name: "Bebidas", icon: "🥤" },
];

export const products: Product[] = [
  {
    id: "moqueca",
    name: "Moqueca de Peixe",
    description: "Peixe fresco cozido no leite de coco com dendê, pimentões e coentro",
    image: moquecaImg,
    category: "almoco",
    sizes: [
      { name: "Pequena", price: 32.9 },
      { name: "Média", price: 45.9 },
      { name: "Grande", price: 59.9 },
    ],
    extras: [
      { name: "Arroz", price: 5.0 },
      { name: "Farofa", price: 4.0 },
      { name: "Pirão", price: 6.0 },
    ],
  },
  {
    id: "picanha",
    name: "Picanha Grelhada",
    description: "Picanha na brasa com farofa, vinagrete e arroz",
    image: picanhaImg,
    category: "almoco",
    sizes: [
      { name: "Pequena", price: 42.9 },
      { name: "Média", price: 55.9 },
      { name: "Grande", price: 72.9 },
    ],
    extras: [
      { name: "Arroz", price: 5.0 },
      { name: "Farofa", price: 4.0 },
      { name: "Vinagrete extra", price: 3.0 },
    ],
  },
  {
    id: "feijoada",
    name: "Feijoada Completa",
    description: "Feijoada com arroz, couve, laranja e farofa crocante",
    image: feijoadaImg,
    category: "almoco",
    sizes: [
      { name: "Pequena", price: 29.9 },
      { name: "Média", price: 39.9 },
      { name: "Grande", price: 52.9 },
    ],
    extras: [
      { name: "Arroz", price: 5.0 },
      { name: "Farofa", price: 4.0 },
      { name: "Couve extra", price: 3.5 },
    ],
  },
  {
    id: "frango",
    name: "Frango Grelhado",
    description: "Peito de frango grelhado com temperos especiais e limão",
    image: frangoImg,
    category: "almoco",
    sizes: [
      { name: "Pequena", price: 24.9 },
      { name: "Média", price: 34.9 },
      { name: "Grande", price: 44.9 },
    ],
    extras: [
      { name: "Arroz", price: 5.0 },
      { name: "Farofa", price: 4.0 },
      { name: "Salada", price: 4.5 },
    ],
  },
  {
    id: "coxinha",
    name: "Coxinha de Frango",
    description: "Coxinhas crocantes recheadas com frango desfiado e catupiry",
    image: coxinhaImg,
    category: "petiscos",
    sizes: [
      { name: "Pequena", price: 14.9 },
      { name: "Média", price: 22.9 },
      { name: "Grande", price: 29.9 },
    ],
    extras: [
      { name: "Molho especial", price: 3.0 },
      { name: "Catupiry extra", price: 4.0 },
    ],
  },
  {
    id: "pastel",
    name: "Pastel de Carne",
    description: "Pastéis crocantes recheados com carne moída temperada",
    image: pastelImg,
    category: "petiscos",
    sizes: [
      { name: "Pequena", price: 12.9 },
      { name: "Média", price: 19.9 },
      { name: "Grande", price: 26.9 },
    ],
    extras: [
      { name: "Molho especial", price: 3.0 },
      { name: "Queijo extra", price: 4.0 },
    ],
  },
  {
    id: "bolinho",
    name: "Bolinho de Bacalhau",
    description: "Bolinhos dourados de bacalhau com batata e salsa",
    image: bolinhoImg,
    category: "petiscos",
    sizes: [
      { name: "Pequena", price: 18.9 },
      { name: "Média", price: 27.9 },
      { name: "Grande", price: 34.9 },
    ],
    extras: [
      { name: "Molho tártaro", price: 3.5 },
      { name: "Limão", price: 1.0 },
    ],
  },
  {
    id: "sucos",
    name: "Suco Natural",
    description: "Suco de frutas frescas: laranja, maracujá ou limão",
    image: sucosImg,
    category: "bebidas",
    sizes: [
      { name: "Pequena", price: 8.9 },
      { name: "Média", price: 12.9 },
      { name: "Grande", price: 15.9 },
    ],
    extras: [{ name: "Açúcar extra", price: 0.5 }],
  },
  {
    id: "guarana",
    name: "Guaraná",
    description: "Guaraná Antarctica gelado",
    image: guaranaImg,
    category: "bebidas",
    sizes: [
      { name: "Pequena", price: 5.9 },
      { name: "Média", price: 7.9 },
      { name: "Grande", price: 10.9 },
    ],
    extras: [{ name: "Gelo extra", price: 0.5 }],
  },
  {
    id: "caipirinha",
    name: "Caipirinha",
    description: "Caipirinha clássica de limão com cachaça artesanal",
    image: caipirinhaImg,
    category: "bebidas",
    sizes: [
      { name: "Pequena", price: 14.9 },
      { name: "Média", price: 19.9 },
      { name: "Grande", price: 24.9 },
    ],
    extras: [
      { name: "Dose extra", price: 5.0 },
      { name: "Frutas mix", price: 3.0 },
    ],
  },
];

export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
