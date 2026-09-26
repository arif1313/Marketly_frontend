export const APP_NAME = "Marketly";
export const CURRENCY = "৳";
export const UPLOADS_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(
  "/api/v1",
  ""
);

// Turns a backend-relative path like "/uploads/xyz.jpg" into a full URL.
export const resolveImage = (path, fallback = "/placeholder.png") => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  return `${UPLOADS_BASE_URL}${path}`;
};
