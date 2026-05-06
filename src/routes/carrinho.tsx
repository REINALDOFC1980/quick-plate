import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/menu-data";
import { useState } from "react";

export const Route = createFileRoute("/carrinho")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Carrinho | Sabor da Casa" },
      { name: "description", content: "Revise seus itens e finalize o pedido" },
    ],
  }),
});

function CartPage() {
  const { items, total, count, updateQuantity, clear } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="animate-bounce-in text-6xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Pedido Realizado!</h1>
        <p className="mt-2 text-muted-foreground">
          Seu pedido foi enviado com sucesso.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all active:scale-[0.97]"
        >
          Voltar ao cardápio
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 text-xl font-bold text-foreground">Carrinho vazio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Adicione itens do cardápio para começar
        </p>
        <Link
          to="/"
          className="mt-6 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all active:scale-[0.97]"
        >
          Ver cardápio
        </Link>
      </div>
    );
  }

  const handleFinalize = () => {
    clear();
    setOrderPlaced(true);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-card px-4 py-4 shadow-sm">
        <Link
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-lg text-secondary-foreground transition-colors hover:bg-accent"
        >
          ←
        </Link>
        <h1 className="text-lg font-bold text-foreground">Carrinho ({count})</h1>
      </header>

      {/* Items */}
      <main className="mx-auto max-w-lg px-4 pt-4">
        <div className="space-y-3">
          {items.map((item) => {
            const extrasTotal = item.extras.reduce(
              (s, e) => s + e.price * e.quantity,
              0
            );
            const itemTotal = (item.sizePrice + extrasTotal) * item.quantity;

            return (
              <div
                key={item.id}
                className="rounded-xl bg-card p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {item.size}
                    </p>
                    {item.extras.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        + {item.extras.map((e) => `${e.quantity}x ${e.name}`).join(", ")}
                      </p>
                    )}
                    {item.observation && (
                      <p className="mt-0.5 text-xs italic text-muted-foreground">
                        "{item.observation}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                      −
                    </button>
                    <span className="w-4 text-center font-semibold text-card-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/80"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-primary">
                    {formatPrice(itemTotal)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card px-4 py-4">
        <div className="mx-auto max-w-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="text-xl font-bold text-foreground">{formatPrice(total)}</span>
          </div>
          <button
            onClick={handleFinalize}
            className="w-full rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-all active:scale-[0.97]"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
