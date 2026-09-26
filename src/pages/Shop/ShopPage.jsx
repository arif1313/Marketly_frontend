import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Store, MapPin, Phone } from "lucide-react";
import { VendorApi } from "../../Api/vendorApi";
import { ReviewApi } from "../../Api/reviewApi";
import { resolveImage } from "../../Config/Config";
import ProductCard from "../../Shared/ProductCard/ProductCard";
import RatingStars from "../../Shared/RatingStars/RatingStars";
import Loading from "../../Shared/Loading/Loading";
import { useAuth } from "../Auth/AuthContext";

const ShopPage = () => {
  const { idOrSlug } = useParams();
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    setLoading(true);
    VendorApi.storefront(idOrSlug)
      .then(({ data }) => {
        setShop(data.data);
        return ReviewApi.vendorReviews(data.data.vendor._id);
      })
      .then(({ data }) => setReviews(data.data))
      .catch(() => setShop(null))
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await ReviewApi.createVendorReview(shop.vendor._id, reviewForm);
      const { data } = await ReviewApi.vendorReviews(shop.vendor._id);
      setReviews(data.data);
      toast.success("Thanks for your review!");
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    }
  };

  if (loading) return <Loading label="Loading shop..." />;
  if (!shop) return <p className="text-center py-20 text-base-content/60">Shop not found.</p>;

  const { vendor, products } = shop;

  return (
    <div>
      <div className="bg-base-200 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-base-100 overflow-hidden shrink-0 flex items-center justify-center border border-base-300">
            {vendor.logo ? (
              <img src={resolveImage(vendor.logo)} alt={vendor.shopName} className="w-full h-full object-cover" />
            ) : (
              <Store size={28} className="text-base-content/30" />
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{vendor.shopName}</h1>
            {vendor.brandName && <p className="text-sm text-base-content/60">{vendor.brandName}</p>}
            <RatingStars rating={vendor.avgRating} count={vendor.ratingCount} />
            <div className="flex gap-4 mt-2 text-xs text-base-content/60">
              {vendor.address && <span className="flex items-center gap-1"><MapPin size={12} /> {vendor.address}</span>}
              {vendor.contactNumber && <span className="flex items-center gap-1"><Phone size={12} /> {vendor.contactNumber}</span>}
            </div>
          </div>
        </div>
        {vendor.description && (
          <p className="max-w-7xl mx-auto px-6 pb-6 text-sm text-base-content/70 max-w-2xl">{vendor.description}</p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="font-display text-xl font-bold mb-5">{products.length} products</h2>
        {products.length === 0 ? (
          <p className="text-base-content/60">This shop hasn't listed any products yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p._id} product={{ ...p, vendorId: vendor }} />)}
          </div>
        )}

        <div className="mt-16 max-w-2xl">
          <h2 className="font-display text-xl font-bold mb-4">Shop reviews ({reviews.length})</h2>

          {user?.role === "customer" && (
            <form onSubmit={handleReviewSubmit} className="card bg-base-200 p-4 mb-6">
              <p className="text-sm font-medium mb-2">Rate this shop</p>
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
              <button className="btn btn-primary btn-sm mt-2 self-start rounded-full">Submit review</button>
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
    </div>
  );
};

export default ShopPage;
