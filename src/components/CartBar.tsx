import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/menu-data";

export function CartBar() {
  const { count, total } = useCart();

  if (count === 0) return null;

  return (
    <div className="animate-cart-slide-up fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
      <Link
        to="/carrinho"
        className="flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-4 shadow-xl transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/20 text-sm font-bold text-primary-foreground">
            {count}
          </span>
          <span className="text-sm font-semibold text-primary-foreground">Ver carrinho</span>
        </div>
        <span className="text-base font-bold text-primary-foreground">
          {formatPrice(total)}
        </span>
      </Link>
    </div>
  );
}
