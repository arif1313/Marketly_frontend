import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, Store } from "lucide-react";
import { ProductApi } from "../../Api/productApi";
import { CategoryApi } from "../../Api/categoryApi";
import { resolveImage } from "../../Config/Config";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import Loading from "../../Shared/Loading/Loading";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ProductApi.list({ limit: 8, sortBy: "createdAt", sortOrder: "desc" }),
      CategoryApi.list(),
    ])
      .then(([p, c]) => {
        setProducts(p.data.data);
        setCategories(c.data.data.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-primary-content">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge badge-secondary badge-outline mb-4">Many shops. One cart.</span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight">
              Discover products from independent shops near you
            </h1>
            <p className="mt-4 text-primary-content/80 max-w-md">
              Browse thousands of items from local vendors, order in one checkout, and pay cash on delivery.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/products" className="btn btn-secondary rounded-full px-6">
                Start shopping <ArrowRight size={16} />
              </Link>
              <Link to="/register/vendor" className="btn btn-outline btn-neutral text-white border-white/60 hover:bg-white/10 rounded-full px-6">
                Sell on {import.meta.env.VITE_APP_NAME || "Marketly"}
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
            <div className="w-full max-w-sm aspect-square rounded-3xl bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center">
              <Store size={96} className="text-white/70" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-base-300 bg-base-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-6 justify-center text-sm text-base-content/70">
          <div className="flex items-center gap-2"><Truck size={16} className="text-primary" /> Cash on delivery available</div>
          <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-primary" /> Verified vendors</div>
          <div className="flex items-center gap-2"><Store size={16} className="text-primary" /> New shops added weekly</div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="font-display text-2xl font-bold mb-6">Shop by category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/products?categoryId=${c._id}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-base-200 hover:bg-base-300 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-base-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={resolveImage(c.image)}
                    alt={c.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
                <span className="text-xs font-medium text-center">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 py-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">New arrivals</h2>
          <Link to="/products" className="text-primary text-sm font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loading label="Loading products..." />
        ) : products.length === 0 ? (
          <p className="text-base-content/60">No products yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
