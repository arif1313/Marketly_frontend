import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Store, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { APP_NAME } from "../../Config/Config";
import { useAuth } from "../../pages/Auth/AuthContext";
import { useCart } from "../../pages/Cart/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search ? `/products?searchTerm=${encodeURIComponent(search)}` : "/products");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-base-100/95 backdrop-blur border-b border-base-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">
          <button className="lg:hidden" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="font-display text-2xl font-extrabold text-primary shrink-0">
            {APP_NAME}
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input input-bordered w-full rounded-full pr-10 focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50">
              <Search size={18} />
            </button>
          </form>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium ml-auto">
            <Link to="/products" className="hover:text-primary">Shop</Link>
            <Link to="/vendors" className="hover:text-primary">Shops</Link>
          </nav>

          <div className="flex items-center gap-3 ml-auto lg:ml-0">
            <Link to="/cart" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <ShoppingCart size={20} />
                {itemCount > 0 && <span className="badge badge-secondary badge-xs indicator-item">{itemCount}</span>}
              </div>
            </Link>

            {!user && (
              <Link to="/login" className="btn btn-primary btn-sm rounded-full px-5">
                Login
              </Link>
            )}

            {user && (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <User size={20} />
                </label>
                <ul tabIndex={0} className="dropdown-content menu menu-sm mt-3 z-50 p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
                  <li className="menu-title text-xs">{user.name}</li>
                  {user.role === "customer" && (
                    <li><Link to="/account/orders"><User size={15} /> My Orders</Link></li>
                  )}
                  {user.role === "vendor" && (
                    <li><Link to="/vendor"><Store size={15} /> Vendor Dashboard</Link></li>
                  )}
                  {user.role === "admin" && (
                    <li><Link to="/admin"><LayoutDashboard size={15} /> Admin Panel</Link></li>
                  )}
                  <li><button onClick={handleLogout} className="text-error"><LogOut size={15} /> Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-4 flex flex-col gap-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input input-bordered w-full rounded-full pr-10"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50">
                <Search size={18} />
              </button>
            </form>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="font-medium">Shop</Link>
            <Link to="/vendors" onClick={() => setMobileOpen(false)} className="font-medium">Shops</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
