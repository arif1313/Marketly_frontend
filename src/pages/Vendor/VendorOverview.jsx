import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, Clock, DollarSign } from "lucide-react";
import { ProductApi } from "../../Api/productApi";
import { OrderApi } from "../../Api/orderApi";
import { CURRENCY } from "../../Config/Config";
import { useAuth } from "../Auth/AuthContext";
import Loading from "../../Shared/Loading/Loading";

const toneClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};

const StatCard = ({ icon: Icon, label, value, tone = "primary" }) => (
  <div className="card bg-base-100 border border-base-300">
    <div className="card-body flex-row items-center gap-4 p-5">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${toneClasses[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-base-content/50">{label}</p>
        <p className="font-display text-xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const VendorOverview = () => {
  const { vendor } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ProductApi.myProducts({ limit: 100 }),
      OrderApi.vendorOrders({ limit: 100 }),
    ])
      .then(([p, o]) => {
        setProducts(p.data.data);
        setOrders(o.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading dashboard..." />;

  const pendingOrders = orders.filter((o) => o.orderStatus === "pending").length;
  const revenue = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((sum, o) => sum + o.grandTotal, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Welcome back, {vendor?.shopName || "Vendor"}</h1>
      <p className="text-base-content/60 text-sm mb-6">Here's how your shop is doing.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Total products" value={products.length} />
        <StatCard icon={ShoppingBag} label="Total orders" value={orders.length} tone="secondary" />
        <StatCard icon={Clock} label="Pending orders" value={pendingOrders} tone="warning" />
        <StatCard icon={DollarSign} label="Revenue" value={`${CURRENCY}${revenue}`} tone="success" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <p className="font-semibold mb-3">Recent orders</p>
            {orders.slice(0, 5).map((o) => (
              <div key={o._id} className="flex justify-between text-sm py-1.5 border-b border-base-200 last:border-0">
                <span>#{o.orderNumber}</span>
                <span className="capitalize badge badge-sm badge-outline">{o.orderStatus}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-base-content/50">No orders yet.</p>}
            <Link to="/vendor/orders" className="text-primary text-sm font-medium mt-3">View all orders →</Link>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <p className="font-semibold mb-3">Your products</p>
            {products.slice(0, 5).map((p) => (
              <div key={p._id} className="flex justify-between text-sm py-1.5 border-b border-base-200 last:border-0">
                <span className="line-clamp-1">{p.name}</span>
                <span>{CURRENCY}{p.price}</span>
              </div>
            ))}
            {products.length === 0 && <p className="text-sm text-base-content/50">No products yet.</p>}
            <Link to="/vendor/products" className="text-primary text-sm font-medium mt-3">Manage products →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOverview;
