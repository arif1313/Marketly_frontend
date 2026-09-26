import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CartApi } from "../../Api/cartApi";
import { toast } from "react-toastify";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], vendorGroups: [], productTotal: 0, deliveryCharge: 0, grandTotal: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const { data } = await CartApi.get();
      setCart(data.data);
    } catch {
      // silent — cart is best-effort on first load
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await CartApi.add(productId, quantity);
      setCart(data.data);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add to cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await CartApi.update(productId, quantity);
      setCart(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update cart");
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await CartApi.remove(productId);
      setCart(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove item");
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await CartApi.clear();
      setCart(data.data);
    } catch {
      // ignore
    }
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, refreshCart, addToCart, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
