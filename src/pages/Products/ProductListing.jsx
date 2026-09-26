import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductApi } from "../../Api/productApi";
import { CategoryApi } from "../../Api/categoryApi";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import Loading from "../../Shared/Loading/Loading";

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPage: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchTerm = searchParams.get("searchTerm") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    CategoryApi.list().then(({ data }) => setCategories(data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12, sortBy, sortOrder };
    if (searchTerm) params.searchTerm = searchTerm;
    if (categoryId) params.categoryId = categoryId;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    ProductApi.list(params)
      .then(({ data }) => {
        setProducts(data.data);
        setMeta(data.meta);
      })
      .finally(() => setLoading(false));
  }, [searchTerm, categoryId, minPrice, maxPrice, sortBy, sortOrder, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <p className="font-semibold text-sm mb-2">Category</p>
        <select className="select select-bordered select-sm w-full" value={categoryId} onChange={(e) => updateParam("categoryId", e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <p className="font-semibold text-sm mb-2">Price range</p>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" className="input input-bordered input-sm w-full" value={minPrice} onChange={(e) => updateParam("minPrice", e.target.value)} />
          <input type="number" placeholder="Max" className="input input-bordered input-sm w-full" value={maxPrice} onChange={(e) => updateParam("maxPrice", e.target.value)} />
        </div>
      </div>
      <div>
        <p className="font-semibold text-sm mb-2">Sort by</p>
        <select
          className="select select-bordered select-sm w-full"
          value={`${sortBy}_${sortOrder}`}
          onChange={(e) => {
            const [sb, so] = e.target.value.split("_");
            const next = new URLSearchParams(searchParams);
            next.set("sortBy", sb);
            next.set("sortOrder", so);
            setSearchParams(next);
          }}
        >
          <option value="createdAt_desc">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="avgRating_desc">Top rated</option>
        </select>
      </div>
      {(categoryId || minPrice || maxPrice || searchTerm) && (
        <button onClick={clearFilters} className="btn btn-ghost btn-sm w-full">Clear all filters</button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">
          {searchTerm ? `Results for "${searchTerm}"` : "All products"}
        </h1>
        <button className="lg:hidden btn btn-outline btn-sm" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block">
          <FilterPanel />
        </aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setFiltersOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-72 bg-base-100 p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold">Filters</p>
                <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <Loading label="Loading products..." />
          ) : products.length === 0 ? (
            <p className="text-base-content/60 py-12 text-center">No products match your filters.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {meta.totalPage > 1 && (
                <div className="join flex justify-center mt-10">
                  {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`join-item btn btn-sm ${p === meta.page ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
