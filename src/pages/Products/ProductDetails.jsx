import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Minus, Plus, ShoppingCart, Store, Truck } from "lucide-react";
import { ProductApi } from "../../Api/productApi";
import { ReviewApi } from "../../Api/reviewApi";
import { CURRENCY, resolveImage } from "../../Config/Config";
import { useCart } from "../Cart/CartContext";
import { useAuth } from "../Auth/AuthContext";
import RatingStars from "../../Shared/RatingStars/RatingStars";
import Loading from "../../Shared/Loading/Loading";

const ProductDetails = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    ProductApi.getOne(idOrSlug)
      .then(({ data }) => {
        setProduct(data.data);
        return ReviewApi.productReviews(data.data._id);
      })
      .then(({ data }) => setReviews(data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const handleOrderNow = () => {
    navigate("/checkout", { state: { buyNow: { productId: product._id, quantity } } });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await ReviewApi.createProductReview(product._id, reviewForm);
      const { data } = await ReviewApi.productReviews(product._id);
      setReviews(data.data);
      toast.success("Thanks for your review!");
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loading label="Loading product..." />;
  if (!product) return <p className="text-center py-20 text-base-content/60">Product not found.</p>;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const outOfStock = product.stock <= 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-base-200 rounded-2xl overflow-hidden mb-3">
            <img
              src={resolveImage(product.images?.[activeImage])}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "https://placehold.co/600x600?text=No+Image")}
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImage ? "border-primary" : "border-base-300"}`}
                >
                  <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <Link to={`/shops/${product.vendorId?.slug || product.vendorId?._id}`} className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mb-2">
            <Store size={14} /> {product.vendorId?.shopName}
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
          <RatingStars rating={product.avgRating} count={product.ratingCount} />

          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-display text-3xl font-extrabold text-primary">{CURRENCY}{displayPrice}</span>
            {hasDiscount && <span className="text-base-content/40 line-through">{CURRENCY}{product.price}</span>}
          </div>

          <p className="text-sm text-base-content/70 mt-4 leading-relaxed">{product.description || "No description provided."}</p>

          <div className="flex items-center gap-2 text-sm text-base-content/60 mt-4">
            <Truck size={15} /> Delivery charge: {CURRENCY}{product.deliveryCharge} · Cash on Delivery
            {product.paymentOptions !== "cod" && " (bKash coming soon)"}
          </div>

          <p className={`text-sm mt-2 font-medium ${outOfStock ? "text-error" : "text-success"}`}>
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </p>

          {!outOfStock && (
            <div className="flex items-center gap-4 mt-6">
              <div className="join border border-base-300 rounded-full">
                <button className="join-item btn btn-ghost btn-sm" onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus size={14} /></button>
                <span className="join-item px-4 flex items-center text-sm font-medium">{quantity}</span>
                <button className="join-item btn btn-ghost btn-sm" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}><Plus size={14} /></button>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              disabled={outOfStock}
              onClick={() => addToCart(product._id, quantity)}
              className="btn btn-outline btn-primary rounded-full flex-1"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button
              disabled={outOfStock}
              onClick={handleOrderNow}
              className="btn btn-primary rounded-full flex-1"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 max-w-2xl">
        <h2 className="font-display text-xl font-bold mb-4">Reviews ({reviews.length})</h2>

        {user?.role === "customer" && (
          <form onSubmit={handleReviewSubmit} className="card bg-base-200 p-4 mb-6">
            <p className="text-sm font-medium mb-2">Leave a review</p>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                  className={`text-2xl ${n <= reviewForm.rating ? "text-secondary" : "text-base-300"}`}
                >★</button>
              ))}
            </div>
            <textarea
              placeholder="Share your experience (optional)"
              className="textarea textarea-bordered w-full text-sm"
              rows={2}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            />
            <button disabled={submittingReview} className="btn btn-primary btn-sm mt-2 self-start rounded-full">
              Submit review
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-base-content/50">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="border-b border-base-300 pb-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{r.customerId?.name || "Customer"}</p>
                  <RatingStars rating={r.rating} size={13} />
                </div>
                {r.comment && <p className="text-sm text-base-content/70 mt-1">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
