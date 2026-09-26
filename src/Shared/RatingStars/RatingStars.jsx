import { Star } from "lucide-react";

const RatingStars = ({ rating = 0, count, size = 15 }) => {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            className={n <= rounded ? "fill-secondary text-secondary" : "fill-base-300 text-base-300"}
          />
        ))}
      </div>
      {typeof count === "number" && <span className="text-xs text-base-content/60">({count})</span>}
    </div>
  );
};

export default RatingStars;
