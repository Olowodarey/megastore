"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Search, X } from "lucide-react";
import { useSearchProductsQuery } from "../_services/fetchquerry";
import ModernProductCard from "../_components/ModernProductCard";
import { Skeleton } from "@/components/ui/skeleton";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";
  const [input, setInput] = useState(q);

  useEffect(() => { setInput(q); }, [q]);

  const { data, isLoading, isFetching } = useSearchProductsQuery(q, { skip: !q });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const loading = isLoading || isFetching;
  const results = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="w-full pl-12 pr-12 py-3.5 text-base border border-input rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
            />
            {input && (
              <button
                type="button"
                onClick={() => { setInput(""); router.push("/search"); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Heading */}
        {q && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {loading ? "Searching…" : `Results for "${q}"`}
            </h1>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-1">
                {total === 0 ? "No products found" : `${total} product${total !== 1 ? "s" : ""} found`}
              </p>
            )}
          </div>
        )}

        {/* Empty state — no query */}
        {!q && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Type something to search</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Try &quot;headphones&quot;, &quot;laptop&quot; or &quot;shoes&quot;</p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && q && total === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-semibold text-foreground">No results for &quot;{q}&quot;</p>
            <p className="text-sm text-muted-foreground mt-2">Try a different keyword or browse categories</p>
          </div>
        )}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((product) => (
              <ModernProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background max-w-7xl mx-auto px-4 py-10">
        <Skeleton className="h-14 w-full max-w-2xl rounded-xl mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
