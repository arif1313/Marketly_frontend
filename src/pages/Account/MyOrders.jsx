import { useEffect, useState } from "react";
import { OrderApi } from "../../Api/orderApi";
import { CURRENCY } from "../../Config/Config";
import Loading from "../../Shared/Loading/Loading";

const statusColor = {
  pending: "badge-warning",
  confirmed: "badge-info",
  shipped: "badge-primary",
  delivered: "badge-success",
  cancelled: "badge-error",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderApi.myOrders()
      .then(({ data }) => setOrders(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading your orders..." />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-base-content/60">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card bg-base-100 border border-base-300">
              <div className="card-body p-5">
                <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-sm">Order #{order.orderNumber}</p>
                    <p className="text-xs text-base-content/50">{order.vendorId?.shopName}</p>
                  </div>
                  <span className={`badge badge-sm capitalize ${statusColor[order.orderStatus] || "badge-outline"}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="divide-y divide-base-300">
                  {order.items.map((item) => (
                    <div key={item.productId} className="py-2 flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{CURRENCY}{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="divider my-1" />
                <div className="flex justify-between font-semibold text-sm">
                  <span>Total</span>
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

export default MyOrders;
