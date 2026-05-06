import { useState, useCallback } from "react";
import type { Product } from "@/lib/menu-data";
import { formatPrice } from "@/lib/menu-data";
import { cartStore } from "@/lib/cart-store";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState(0);
  const [extras, setExtras] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    product.extras.forEach((e) => (init[e.name] = 0));
    return init;
  });
  const [observation, setObservation] = useState("");

  const updateExtra = useCallback((name: string, delta: number) => {
    setExtras((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta),
    }));
  }, []);

  const totalExtras = product.extras.reduce(
    (sum, e) => sum + e.price * (extras[e.name] || 0),
    0
  );
  const totalPrice = product.sizes[selectedSize].price + totalExtras;

  const handleAdd = () => {
    cartStore.addItem({
      productId: product.id,
      name: product.name,
      size: product.sizes[selectedSize].name,
      sizePrice: product.sizes[selectedSize].price,
      extras: product.extras
        .filter((e) => (extras[e.name] || 0) > 0)
        .map((e) => ({ name: e.name, quantity: extras[e.name], price: e.price })),
      observation,
      quantity: 1,
      image: product.image,
    });
    onClose();
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-foreground/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-slide-up flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-3xl bg-card">
        {/* Header image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full rounded-t-3xl object-cover"
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-card-foreground backdrop-blur-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h2 className="text-xl font-bold text-card-foreground">{product.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>

          {/* Sizes */}
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-card-foreground">Tamanho</h3>
            <div className="mt-2 flex gap-2">
              {product.sizes.map((size, i) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(i)}
                  className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-center text-sm font-medium transition-all ${
                    selectedSize === i
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <div>{size.name}</div>
                  <div className="mt-0.5 text-xs font-bold">{formatPrice(size.price)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Extras */}
          {product.extras.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-card-foreground">Extras</h3>
              <div className="mt-2 space-y-2">
                {product.extras.map((extra) => (
                  <div
                    key={extra.name}
                    className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3"
                  >
                    <div>
                      <span className="text-sm text-card-foreground">{extra.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        +{formatPrice(extra.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateExtra(extra.name, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-sm font-semibold text-card-foreground">
                        {extras[extra.name] || 0}
                      </span>
                      <button
                        onClick={() => updateExtra(extra.name, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/80"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observation */}
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-card-foreground">Observação</h3>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: sem cebola, bem passado..."
              className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              rows={2}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-4">
          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all active:scale-[0.97]"
          >
            <span>Adicionar</span>
            <span className="rounded-full bg-primary-foreground/20 px-3 py-0.5 text-sm">
              {formatPrice(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
