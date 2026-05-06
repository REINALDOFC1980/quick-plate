import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useRef, useEffect } from "react";
import { categories, products, type Product } from "@/lib/menu-data";
import { CategoryBar } from "@/components/CategoryBar";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { CartBar } from "@/components/CartBar";

export const Route = createFileRoute("/")({
  component: MenuPage,
  head: () => ({
    meta: [
      { title: "Sabor da Casa | Cardápio Digital" },
      { name: "description", content: "Peça seus pratos favoritos online com praticidade" },
    ],
  }),
});

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleCategoryClick = useCallback((id: string) => {
    setActiveCategory(id);
    const el = sectionRefs.current[id];
    if (el) {
      const offset = 60;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  // Intersection observer for active category highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary px-4 pb-4 pt-6">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl font-bold text-primary-foreground">🍴 Sabor da Casa</h1>
          <p className="mt-1 text-sm text-primary-foreground/80">
            O melhor da culinária brasileira
          </p>
        </div>
      </header>

      {/* Category bar */}
      <div className="sticky top-0 z-30">
        <div className="mx-auto max-w-lg">
          <CategoryBar
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </div>

      {/* Menu sections */}
      <main className="mx-auto max-w-lg px-4 pt-4">
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat.id);
          return (
            <div
              key={cat.id}
              id={cat.id}
              ref={(el) => { sectionRefs.current[cat.id] = el; }}
            >
              <h2 className="mb-3 mt-6 text-lg font-bold text-foreground">
                {cat.icon} {cat.name}
              </h2>
              <div className="space-y-3">
                {catProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelectedProduct}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* Cart bar */}
      <CartBar />

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
