import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ProductApi } from "../../Api/productApi";
import { CURRENCY, resolveImage } from "../../Config/Config";
import Loading from "../../Shared/Loading/Loading";

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    ProductApi.myProducts({ limit: 100 })
      .then(({ data }) => setProducts(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await ProductApi.remove(id);
      toast.success("Product deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete product");
    }
  };

  if (loading) return <Loading label="Loading products..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">My Products</h1>
        <Link to="/vendor/products/new" className="btn btn-primary btn-sm rounded-full">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card bg-base-100 border border-base-300 p-10 text-center">
          <p className="text-base-content/60 mb-4">You haven't added any products yet.</p>
          <Link to="/vendor/products/new" className="btn btn-primary rounded-full self-center">Add your first product</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table bg-base-100 border border-base-300 rounded-xl">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={resolveImage(p.images?.[0])} className="w-10 h-10 rounded-lg object-cover bg-base-200" alt="" />
                      <span className="font-medium text-sm line-clamp-1 max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="text-sm">{CURRENCY}{p.price}</td>
                  <td className="text-sm">{p.stock}</td>
                  <td>
                    {p.isBlocked ? (
                      <span className="badge badge-error badge-sm">Blocked by admin</span>
                    ) : p.stock <= 0 ? (
                      <span className="badge badge-warning badge-sm">Out of stock</span>
                    ) : (
                      <span className="badge badge-success badge-sm">Active</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/vendor/products/${p._id}/edit`} className="btn btn-ghost btn-xs">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="btn btn-ghost btn-xs text-error">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
