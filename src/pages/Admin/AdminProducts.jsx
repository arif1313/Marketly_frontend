import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Ban, CheckCircle, Trash2, RotateCcw } from "lucide-react";
import { AdminApi } from "../../Api/adminApi";
import { CURRENCY, resolveImage } from "../../Config/Config";
import Loading from "../../Shared/Loading/Loading";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    AdminApi.products({ limit: 100, searchTerm: search || undefined })
      .then(({ data }) => setProducts(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search]);

  const toggleBlock = async (p) => {
    try {
      await AdminApi.blockProduct(p._id, !p.isBlocked);
      toast.success(p.isBlocked ? "Product unblocked" : "Product blocked");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Soft-delete this product?")) return;
    try {
      await AdminApi.deleteProduct(id);
      toast.success("Product deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleRestore = async (id) => {
    try {
      await AdminApi.restoreProduct(id);
      toast.success("Product restored");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <input placeholder="Search products..." className="input input-bordered input-sm w-56" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <Loading label="Loading products..." /> : (
        <div className="overflow-x-auto">
          <table className="table bg-base-100 border border-base-300 rounded-xl">
            <thead><tr><th>Product</th><th>Shop</th><th>Price</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={resolveImage(p.images?.[0])} className="w-9 h-9 rounded-lg object-cover bg-base-200" alt="" />
                      <span className="font-medium text-sm line-clamp-1 max-w-[180px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="text-sm">{p.vendorId?.shopName || "—"}</td>
                  <td className="text-sm">{CURRENCY}{p.price}</td>
                  <td>
                    {p.isDeleted ? (
                      <span className="badge badge-ghost badge-sm">Deleted</span>
                    ) : p.isBlocked ? (
                      <span className="badge badge-error badge-sm">Blocked</span>
                    ) : (
                      <span className="badge badge-success badge-sm">Active</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      {!p.isDeleted && (
                        <button onClick={() => toggleBlock(p)} className="btn btn-ghost btn-xs">
                          {p.isBlocked ? <CheckCircle size={14} className="text-success" /> : <Ban size={14} className="text-error" />}
                        </button>
                      )}
                      {p.isDeleted ? (
                        <button onClick={() => handleRestore(p._id)} className="btn btn-ghost btn-xs"><RotateCcw size={14} className="text-primary" /></button>
                      ) : (
                        <button onClick={() => handleDelete(p._id)} className="btn btn-ghost btn-xs"><Trash2 size={14} className="text-error" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="text-center text-base-content/50 py-8">No products found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
