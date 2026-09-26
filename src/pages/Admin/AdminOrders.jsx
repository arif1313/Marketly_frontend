import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminApi } from "../../Api/adminApi";
import { CURRENCY } from "../../Config/Config";
import Loading from "../../Shared/Loading/Loading";

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const statusColor = {
  pending: "badge-warning", confirmed: "badge-info", shipped: "badge-primary",
  delivered: "badge-success", cancelled: "badge-error",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const load = () => {
    setLoading(true);
    AdminApi.orders({ limit: 100, orderStatus: statusFilter || undefined })
      .then(({ data }) => setOrders(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const handleStatusChange = async (id, orderStatus) => {
    try {
      await AdminApi.updateOrderStatus(id, { orderStatus });
      toast.success("Order status updated");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold">All Orders</h1>
        <select className="select select-bordered select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {loading ? <Loading label="Loading orders..." /> : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card bg-base-100 border border-base-300">
              <div className="card-body p-5">
                <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                  <div>
                    <p className="font-semibold text-sm">Order #{order.orderNumber}</p>
                    <p className="text-xs text-base-content/50">
                      Shop: {order.vendorId?.shopName} · Customer: {order.customerId?.name || order.customerInfo?.name}
                    </p>
                  </div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="select select-bordered select-sm capitalize"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`badge badge-sm ${statusColor[order.orderStatus]}`}>{order.orderStatus}</span>
                  <span className="font-semibold text-primary">{CURRENCY}{order.grandTotal}</span>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-base-content/50 py-8">No orders found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
