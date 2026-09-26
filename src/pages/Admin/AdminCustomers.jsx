import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Ban, CheckCircle } from "lucide-react";
import { AdminApi } from "../../Api/adminApi";
import Loading from "../../Shared/Loading/Loading";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    AdminApi.customers({ limit: 100, searchTerm: search || undefined })
      .then(({ data }) => setCustomers(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search]);

  const toggleBlock = async (c) => {
    try {
      await AdminApi.blockUser(c._id, !c.isBlocked);
      toast.success(c.isBlocked ? "Customer unblocked" : "Customer blocked");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold">Customers</h1>
        <input placeholder="Search customers..." className="input input-bordered input-sm w-56" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <Loading label="Loading customers..." /> : (
        <div className="overflow-x-auto">
          <table className="table bg-base-100 border border-base-300 rounded-xl">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td className="font-medium text-sm">{c.name}</td>
                  <td className="text-sm">{c.email}</td>
                  <td className="text-sm">{c.contactNumber || "—"}</td>
                  <td>
                    {c.isBlocked ? (
                      <span className="badge badge-error badge-sm">Blocked</span>
                    ) : (
                      <span className="badge badge-success badge-sm">Active</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => toggleBlock(c)} className="btn btn-ghost btn-xs">
                      {c.isBlocked ? <CheckCircle size={14} className="text-success" /> : <Ban size={14} className="text-error" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && <p className="text-center text-base-content/50 py-8">No customers found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
