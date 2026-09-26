import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { CURRENCY, resolveImage } from "../../Config/Config";
import RatingStars from "../RatingStars/RatingStars";
import { useCart } from "../../pages/Cart/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const outOfStock = product.stock <= 0;

  return (
    <div className="group bg-base-100 border border-base-300 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <Link to={`/products/${product.slug || product._id}`} className="block aspect-square bg-base-200 overflow-hidden relative">
        <img
          src={resolveImage(product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.target.src = "https://placehold.co/400x400?text=No+Image")}
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 badge badge-secondary badge-sm font-semibold">Sale</span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-semibold">
            Out of stock
          </span>
        )}
      </Link>

      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <p className="text-xs text-primary font-medium truncate">
          {product.vendorId?.shopName || product.vendor?.shopName}
        </p>
        <Link to={`/products/${product.slug || product._id}`} className="font-display font-semibold text-sm leading-snug line-clamp-2 hover:text-primary">
          {product.name}
        </Link>

        <RatingStars rating={product.avgRating} count={product.ratingCount} size={13} />

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-primary">
              {CURRENCY}{hasDiscount ? product.discountPrice : product.price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-base-content/40 line-through">{CURRENCY}{product.price}</span>
            )}
          </div>
          <button
            disabled={outOfStock || loading}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product._id, 1);
            }}
            className="btn btn-primary btn-xs btn-circle"
            title="Add to cart"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
