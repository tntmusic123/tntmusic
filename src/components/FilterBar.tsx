"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface FilterBarProps {
  categories: string[];
  currentCategory: string;
  baseUrl: string;
}

export function FilterBar({ categories, currentCategory, baseUrl }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "전체") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`${baseUrl}?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleFilter(cat)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shadow-sm border ${
            cat === currentCategory
              ? "bg-gold border-gold text-white shadow-gold/20"
              : "bg-background border-border text-muted-foreground hover:bg-gold/10 hover:border-gold/30 hover:text-gold"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
