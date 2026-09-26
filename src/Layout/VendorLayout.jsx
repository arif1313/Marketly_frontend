import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, Package, ShoppingBag, Store, ArrowLeft } from "lucide-react";
import { APP_NAME } from "../Config/Config";
import { useAuth } from "../pages/Auth/AuthContext";

const links = [
  { to: "/vendor", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/vendor/products", label: "Products", icon: Package },
  { to: "/vendor/orders", label: "Orders", icon: ShoppingBag },
  { to: "/vendor/profile", label: "Shop Profile", icon: Store },
];

const VendorLayout = () => {
  const { vendor } = useAuth();

  return (
    <div className="min-h-screen flex bg-base-200">
      <aside className="w-60 shrink-0 bg-neutral text-neutral-content flex flex-col">
        <div className="p-5 border-b border-white/10">
          <p className="font-display text-xl font-extrabold text-white">{APP_NAME}</p>
          <p className="text-xs text-neutral-content/60 mt-1">{vendor?.shopName || "Vendor Panel"}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-white" : "text-neutral-content/80 hover:bg-white/10"
                }`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="p-4 border-t border-white/10 text-sm text-neutral-content/70 hover:text-white flex items-center gap-2">
          <ArrowLeft size={15} /> Back to store
        </Link>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
