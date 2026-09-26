import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store } from "lucide-react";
import { VendorApi } from "../../Api/vendorApi";
import { resolveImage } from "../../Config/Config";
import RatingStars from "../../Shared/RatingStars/RatingStars";
import Loading from "../../Shared/Loading/Loading";

const VendorsList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    VendorApi.list({ limit: 40 })
      .then(({ data }) => setVendors(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading shops..." />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-bold mb-6">All shops</h1>
      {vendors.length === 0 ? (
        <p className="text-base-content/60">No shops found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.map((v) => (
            <Link
              key={v._id}
              to={`/shops/${v.slug || v._id}`}
              className="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow"
            >
              <div className="card-body flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-base-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {v.logo ? (
                    <img src={resolveImage(v.logo)} alt={v.shopName} className="w-full h-full object-cover" />
                  ) : (
                    <Store size={24} className="text-base-content/30" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold truncate">{v.shopName}</p>
                  {v.brandName && <p className="text-xs text-base-content/50 truncate">{v.brandName}</p>}
                  <RatingStars rating={v.avgRating} count={v.ratingCount} size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorsList;
