import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Store } from "lucide-react";
import { useCart } from "./CartContext";
import { CURRENCY, resolveImage } from "../../Config/Config";

const CartPage = () => {
  const { cart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-base-content/20 mb-4" />
        <h1 className="font-display text-xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-base-content/60 mb-6">Browse products and add a few to get started.</p>
        <Link to="/products" className="btn btn-primary rounded-full px-6">Start shopping</Link>
      </div>
    );
  }

  // Group items by vendor for display, matching the backend's vendorGroups split
  const groups = {};
  cart.items.forEach((item) => {
    const vId = item.vendor?._id || item.vendorId;
    if (!groups[vId]) groups[vId] = { vendor: item.vendor, items: [] };
    groups[vId].items.push(item);
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          {Object.entries(groups).map(([vendorId, group]) => (
            <div key={vendorId} className="card bg-base-100 border border-base-300">
              <div className="card-body p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                  <Store size={14} /> {group.vendor?.shopName || "Shop"}
                </p>
                <div className="divide-y divide-base-300">
                  {group.items.map((item) => (
                    <div key={item.productId} className="py-3 flex items-center gap-3">
                      <img
                        src={resolveImage(item.image)}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-base-200 shrink-0"
                        onError={(e) => (e.target.src = "https://placehold.co/100x100?text=No+Image")}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-primary font-semibold text-sm">{CURRENCY}{item.unitPrice}</p>
                      </div>
                      <div className="join border border-base-300 rounded-full">
                        <button
                          className="join-item btn btn-ghost btn-xs"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="join-item px-3 flex items-center text-xs font-medium">{item.quantity}</span>
                        <button
                          className="join-item btn btn-ghost btn-xs"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.productId)} className="text-error/70 hover:text-error">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card bg-base-100 border border-base-300 h-fit sticky top-20">
          <div className="card-body">
            <p className="font-display font-bold text-lg mb-3">Order Summary</p>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Product total</span>
              <span>{CURRENCY}{cart.productTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Delivery charge</span>
              <span>{CURRENCY}{cart.deliveryCharge}</span>
            </div>
            <div className="divider my-1" />
            <div className="flex justify-between font-semibold">
              <span>Grand total</span>
              <span className="text-primary">{CURRENCY}{cart.grandTotal}</span>
            </div>
            <button onClick={() => navigate("/checkout")} className="btn btn-primary rounded-full mt-4">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
