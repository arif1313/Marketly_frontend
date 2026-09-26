import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { OrderApi } from "../../Api/orderApi";
import { CURRENCY } from "../../Config/Config";
import Loading from "../../Shared/Loading/Loading";

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const statusColor = {
  pending: "badge-warning", confirmed: "badge-info", shipped: "badge-primary",
  delivered: "badge-success", cancelled: "badge-error",
};

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    OrderApi.vendorOrders({ limit: 100 })
      .then(({ data }) => setOrders(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, orderStatus) => {
    try {
      await OrderApi.updateStatus(id, { orderStatus });
      toast.success("Order status updated");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    }
  };

  if (loading) return <Loading label="Loading orders..." />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-base-content/60">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card bg-base-100 border border-base-300">
              <div className="card-body p-5">
                <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-sm">Order #{order.orderNumber}</p>
                    <p className="text-xs text-base-content/50">
                      {order.customerInfo?.name} · {order.customerInfo?.phone}
                    </p>
                    <p className="text-xs text-base-content/50">{order.customerInfo?.address}</p>
                  </div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`select select-bordered select-sm capitalize`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="divide-y divide-base-300">
                  {order.items.map((item) => (
                    <div key={item.productId} className="py-1.5 flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{CURRENCY}{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="divider my-1" />
                <div className="flex justify-between font-semibold text-sm">
                  <span>Total <span className={`badge badge-xs ml-2 ${statusColor[order.orderStatus]}`}>{order.orderStatus}</span></span>
                  <span className="text-primary">{CURRENCY}{order.grandTotal}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
