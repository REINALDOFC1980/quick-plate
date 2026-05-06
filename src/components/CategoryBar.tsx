import { useCallback, useEffect, useRef, useState } from "react";
import { categories } from "@/lib/menu-data";

interface CategoryBarProps {
  activeCategory: string;
  onCategoryClick: (id: string) => void;
}

export function CategoryBar({ activeCategory, onCategoryClick }: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (id: string) => {
      onCategoryClick(id);
    },
    [onCategoryClick]
  );

  return (
    <div className="bg-card shadow-sm">
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
