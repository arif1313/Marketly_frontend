import { Link } from "react-router-dom";
import { APP_NAME } from "../../Config/Config";

const Footer = () => (
  <footer className="bg-neutral text-neutral-content mt-16">
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <p className="font-display text-xl font-extrabold text-white mb-2">{APP_NAME}</p>
        <p className="text-sm text-neutral-content/70 leading-relaxed">
          A marketplace where independent shops sell directly to you — one cart, many vendors.
        </p>
      </div>
      <div>
        <p className="font-semibold text-white mb-3 text-sm">Shop</p>
        <ul className="space-y-2 text-sm text-neutral-content/70">
          <li><Link to="/products" className="hover:text-white">All products</Link></li>
          <li><Link to="/vendors" className="hover:text-white">Browse shops</Link></li>
          <li><Link to="/cart" className="hover:text-white">Your cart</Link></li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-white mb-3 text-sm">Sell with us</p>
        <ul className="space-y-2 text-sm text-neutral-content/70">
          <li><Link to="/register/vendor" className="hover:text-white">Become a vendor</Link></li>
          <li><Link to="/vendor" className="hover:text-white">Vendor dashboard</Link></li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-white mb-3 text-sm">Account</p>
        <ul className="space-y-2 text-sm text-neutral-content/70">
          <li><Link to="/login" className="hover:text-white">Login</Link></li>
          <li><Link to="/register" className="hover:text-white">Create account</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs text-neutral-content/50">
      © {new Date().getFullYear()} {APP_NAME}. Cash on delivery available. bKash coming soon.
    </div>
  </footer>
);

export default Footer;
