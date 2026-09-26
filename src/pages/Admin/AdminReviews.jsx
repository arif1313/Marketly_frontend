import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { AdminApi } from "../../Api/adminApi";
import RatingStars from "../../Shared/RatingStars/RatingStars";
import Loading from "../../Shared/Loading/Loading";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    AdminApi.reviews({ limit: 100 })
      .then(({ data }) => setReviews(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this review?")) return;
    try {
      await AdminApi.deleteReview(id);
      toast.success("Review removed");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <Loading label="Loading reviews..." />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Reviews Moderation</h1>

      {reviews.length === 0 ? (
        <p className="text-base-content/60">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="card bg-base-100 border border-base-300">
              <div className="card-body p-4 flex-row items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{r.customerId?.name || "Customer"}</p>
                  <p className="text-xs text-base-content/50">
                    {r.productId ? "Product review" : "Shop review"}
                  </p>
                  {r.comment && <p className="text-sm text-base-content/70 mt-1">{r.comment}</p>}
                  <RatingStars rating={r.rating} size={13} />
                </div>
                <button onClick={() => handleDelete(r._id)} className="btn btn-ghost btn-sm text-error">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
