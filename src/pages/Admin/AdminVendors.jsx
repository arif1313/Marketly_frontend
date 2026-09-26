import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Ban, CheckCircle, Trash2, RotateCcw } from "lucide-react";
import { AdminApi } from "../../Api/adminApi";
import { resolveImage } from "../../Config/Config";
import Loading from "../../Shared/Loading/Loading";

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    AdminApi.vendors({ limit: 100, searchTerm: search || undefined })
      .then(({ data }) => setVendors(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search]);

  const toggleBlock = async (v) => {
    try {
      await AdminApi.blockVendor(v._id, !v.isBlocked);
      toast.success(v.isBlocked ? "Vendor unblocked" : "Vendor blocked");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Soft-delete this vendor? Their products will be hidden from the storefront.")) return;
    try {
      await AdminApi.deleteVendor(id);
      toast.success("Vendor deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleRestore = async (id) => {
    try {
      await AdminApi.restoreVendor(id);
      toast.success("Vendor restored");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold">Vendors</h1>
        <input
          placeholder="Search shops..."
          className="input input-bordered input-sm w-56"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? <Loading label="Loading vendors..." /> : (
        <div className="overflow-x-auto">
          <table className="table bg-base-100 border border-base-300 rounded-xl">
            <thead>
              <tr><th>Shop</th><th>Owner</th><th>Products</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={resolveImage(v.logo)} className="w-9 h-9 rounded-lg object-cover bg-base-200" alt="" onError={(e) => (e.target.style.visibility = "hidden")} />
                      <span className="font-medium text-sm">{v.shopName}</span>
                    </div>
                  </td>
                  <td className="text-sm">{v.userId?.name || "—"}<br /><span className="text-xs text-base-content/50">{v.userId?.email}</span></td>
                  <td className="text-sm">{v.productCount ?? "—"}</td>
                  <td>
                    {v.isDeleted ? (
                      <span className="badge badge-ghost badge-sm">Deleted</span>
                    ) : v.isBlocked ? (
                      <span className="badge badge-error badge-sm">Blocked</span>
                    ) : (
                      <span className="badge badge-success badge-sm">Active</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      {!v.isDeleted && (
                        <button onClick={() => toggleBlock(v)} className="btn btn-ghost btn-xs" title={v.isBlocked ? "Unblock" : "Block"}>
                          {v.isBlocked ? <CheckCircle size={14} className="text-success" /> : <Ban size={14} className="text-error" />}
                        </button>
                      )}
                      {v.isDeleted ? (
                        <button onClick={() => handleRestore(v._id)} className="btn btn-ghost btn-xs" title="Restore">
                          <RotateCcw size={14} className="text-primary" />
                        </button>
                      ) : (
                        <button onClick={() => handleDelete(v._id)} className="btn btn-ghost btn-xs" title="Delete">
                          <Trash2 size={14} className="text-error" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vendors.length === 0 && <p className="text-center text-base-content/50 py-8">No vendors found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminVendors;
