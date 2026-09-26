import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { CURRENCY } from "../../Config/Config";

const OrderConfirmation = () => {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) return <Navigate to="/" replace />;

  const { orders, parentOrderId } = result;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <CheckCircle2 size={56} className="mx-auto text-success mb-4" />
      <h1 className="font-display text-2xl font-bold mb-2">Order placed successfully!</h1>
      <p className="text-base-content/60 mb-8">
        {parentOrderId
          ? "Your order was split across multiple shops — each will be delivered separately."
          : "Thank you for your order. You'll be contacted for delivery confirmation."}
      </p>

      <div className="space-y-4 text-left">
        {orders.map((order) => (
          <div key={order._id} className="card bg-base-100 border border-base-300">
            <div className="card-body p-5">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-sm">Order #{order.orderNumber}</p>
                <span className="badge badge-outline badge-sm capitalize">{order.orderStatus}</span>
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
              <div className="flex justify-between text-sm text-base-content/60">
                <span>Delivery charge</span>
                <span>{CURRENCY}{order.deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total (Cash on Delivery)</span>
                <span className="text-primary">{CURRENCY}{order.grandTotal}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/products" className="btn btn-primary rounded-full px-8 mt-10">Continue shopping</Link>
    </div>
  );
};

export default OrderConfirmation;
