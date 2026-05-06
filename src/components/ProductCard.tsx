import type { Product } from "@/lib/menu-data";
import { formatPrice } from "@/lib/menu-data";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="flex w-full gap-3 rounded-xl bg-card p-3 text-left shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="font-semibold text-card-foreground">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {product.description}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-primary">
            {formatPrice(product.sizes[0].price)}
          </span>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            + Detalhe
          </span>
        </div>
      </div>
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        width={120}
        height={120}
        className="h-[100px] w-[100px] shrink-0 rounded-lg object-cover"
      />
    </button>
  );
}
