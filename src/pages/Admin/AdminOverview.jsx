import { useEffect, useState } from "react";
import { Store, Users, Package, ShoppingBag, DollarSign, Star } from "lucide-react";
import { AdminApi } from "../../Api/adminApi";
import { CURRENCY } from "../../Config/Config";
import Loading from "../../Shared/Loading/Loading";

const toneClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
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

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminApi.dashboardStats()
      .then(({ data }) => setStats(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading dashboard..." />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Admin Overview</h1>
      <p className="text-base-content/60 text-sm mb-6">Marketplace-wide statistics.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Store} label="Vendors" value={stats?.totalVendors ?? 0} />
        <StatCard icon={Users} label="Customers" value={stats?.totalCustomers ?? 0} tone="secondary" />
        <StatCard icon={Package} label="Products" value={stats?.totalProducts ?? 0} tone="accent" />
        <StatCard icon={ShoppingBag} label="Orders" value={stats?.totalOrders ?? 0} tone="warning" />
        <StatCard icon={DollarSign} label="Revenue" value={`${CURRENCY}${stats?.totalRevenue ?? 0}`} tone="success" />
        <StatCard icon={Star} label="Blocked vendors" value={stats?.blockedVendors ?? 0} />
      </div>

      {stats?.topVendors?.length > 0 && (
        <div className="card bg-base-100 border border-base-300 mt-6">
          <div className="card-body">
            <p className="font-semibold mb-3">Top performing shops</p>
            {stats.topVendors.map((v) => (
              <div key={v.vendorId} className="flex justify-between text-sm py-1.5 border-b border-base-200 last:border-0">
                <span>{v.shopName}</span>
                <span>{v.orders} orders · {CURRENCY}{v.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
