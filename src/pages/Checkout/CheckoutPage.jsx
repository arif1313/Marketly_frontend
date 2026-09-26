import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { OrderApi } from "../../Api/orderApi";
import { ProductApi } from "../../Api/productApi";
import { useCart } from "../Cart/CartContext";
import { useAuth } from "../Auth/AuthContext";
import { CURRENCY, resolveImage } from "../../Config/Config";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  const buyNow = location.state?.buyNow; // { productId, quantity } or undefined (cart checkout)
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.contactNumber || "",
    email: user?.email || "",
    address: user?.address || "",
    city: "",
    note: "",
  });

  useEffect(() => {
    if (buyNow) {
      ProductApi.getOne(buyNow.productId).then(({ data }) => setBuyNowProduct(data.data));
    }
  }, [buyNow]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const isBuyNow = Boolean(buyNow);
  const productTotal = isBuyNow
    ? buyNowProduct
      ? (buyNowProduct.discountPrice || buyNowProduct.price) * buyNow.quantity
      : 0
    : cart.productTotal;
  const deliveryCharge = isBuyNow ? (buyNowProduct?.deliveryCharge || 0) : cart.deliveryCharge;
  const grandTotal = productTotal + deliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        customerInfo: form,
        paymentMethod: "cod",
      };
      if (isBuyNow) {
        payload.productId = buyNow.productId;
        payload.quantity = buyNow.quantity;
      }

      const { data } = await OrderApi.place(payload);
      if (!isBuyNow) await refreshCart();
      toast.success("Order placed successfully!");
      navigate("/order-confirmation", { state: { result: data.data } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  if (!isBuyNow && (!cart.items || cart.items.length === 0)) {
    return <p className="text-center py-24 text-base-content/60">Your cart is empty.</p>;
  }
  if (isBuyNow && !buyNowProduct) {
    return <p className="text-center py-24 text-base-content/60">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-300">
          <div className="card-body gap-3">
            <p className="font-semibold text-sm text-base-content/70">Delivery details</p>
            <input placeholder="Full name" required className="input input-bordered w-full" value={form.name} onChange={update("name")} />
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Phone number" required className="input input-bordered w-full" value={form.phone} onChange={update("phone")} />
              <input type="email" placeholder="Email (optional)" className="input input-bordered w-full" value={form.email} onChange={update("email")} />
            </div>
            <textarea placeholder="Full delivery address" required rows={2} className="textarea textarea-bordered w-full" value={form.address} onChange={update("address")} />
            <input placeholder="City (optional)" className="input input-bordered w-full" value={form.city} onChange={update("city")} />
            <textarea placeholder="Order note (optional)" rows={2} className="textarea textarea-bordered w-full" value={form.note} onChange={update("note")} />

            <div className="divider my-1" />
            <p className="font-semibold text-sm text-base-content/70">Payment method</p>
            <label className="flex items-center gap-3 border border-primary rounded-lg p-3 cursor-pointer bg-primary/5">
              <input type="radio" checked readOnly className="radio radio-primary radio-sm" />
              <span className="text-sm font-medium">Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-3 border border-base-300 rounded-lg p-3 opacity-50">
              <input type="radio" disabled className="radio radio-sm" />
              <span className="text-sm">bKash — Coming Soon</span>
            </label>

            {error && <p className="text-error text-sm">{error}</p>}

            <button disabled={loading} className="btn btn-primary mt-3 rounded-full">
              {loading ? <span className="loading loading-spinner loading-sm" /> : `Place Order — ${CURRENCY}${grandTotal}`}
            </button>
          </div>
        </form>

        <div className="card bg-base-100 border border-base-300 h-fit">
          <div className="card-body">
            <p className="font-display font-bold text-lg mb-3">Order Summary</p>
            {isBuyNow ? (
              <div className="flex items-center gap-3 mb-3">
                <img src={resolveImage(buyNowProduct.images?.[0])} className="w-14 h-14 rounded-lg object-cover bg-base-200" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{buyNowProduct.name}</p>
                  <p className="text-xs text-base-content/50">Qty: {buyNow.quantity}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="line-clamp-1">{item.name} × {item.quantity}</span>
                    <span>{CURRENCY}{item.subtotal}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="divider my-1" />
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Product total</span>
              <span>{CURRENCY}{productTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-base-content/60">Delivery charge</span>
              <span>{CURRENCY}{deliveryCharge}</span>
            </div>
            <div className="divider my-1" />
            <div className="flex justify-between font-semibold">
              <span>Grand total</span>
              <span className="text-primary">{CURRENCY}{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
