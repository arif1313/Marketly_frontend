# Marketly — Multi-Vendor Marketplace Frontend

React + Vite frontend for the multi-vendor marketplace, built to connect directly to your
`multivendor-backend` (Express + MongoDB) API.

## Stack
- React (Vite)
- Tailwind CSS + DaisyUI (custom "marketly" theme — indigo/orange, not the old black theme)
- react-router-dom (data router / `createBrowserRouter`)
- axios
- lucide-react (icons)
- react-toastify (notifications)

## Setup

```bash
npm install
cp .env.example .env   # edit VITE_API_URL if needed
npm run dev
```

By default `VITE_API_URL=http://localhost:5000/api/v1` — point this at your backend.
When you deploy the backend live, just update `.env` (or the platform's env vars) to the
live URL — nothing else in the code needs to change since every API call goes through
`src/Api/api.js`.

## How it talks to your backend
- **Guest cart/checkout**: the backend hands back a guest id via the `x-guest-id` response
  header (see `guestSession` middleware). The axios client in `src/Api/api.js` captures
  that header on every response and re-sends it as a request header on every subsequent
  call, so guests keep the same cart without logging in.
- **Auth**: JWT access token stored in `localStorage`, attached as `Authorization: Bearer`.
  Login also sends the current guest id so the backend can merge the guest cart into the
  customer's account cart.
- **Response shape**: every endpoint returns `{ success, message, meta?, data }` — handled
  uniformly across all `Api/*.js` files.

## Folder structure
```
src/
  Api/            axios client + one file per module (auth, vendor, product, category,
                  cart, order, review, admin) — mirrors your backend's route modules
  Config/         app constants, image URL resolver
  Layout/         MainLayout (public site), VendorLayout, AdminLayout (dashboard shells)
  Shared/         Navbar, Footer, ProductCard, RatingStars, Loading
  pages/
    Auth/         AuthContext, ProtectedRoute, Login, RegisterCustomer, RegisterVendor
    Cart/         CartContext (shared cart state), CartPage
    Home/         Public homepage
    Products/     Listing (filters/search/pagination) + Product details
    Shop/         Vendor storefront + browse-all-shops page
    Checkout/     Checkout form + order confirmation
    Account/      Customer order history
    Vendor/       Vendor dashboard (overview, products CRUD, orders, shop profile)
    Admin/        Admin dashboard (vendors, products, customers, orders, reviews)
  Ruters.jsx      All routes, wired with role-based ProtectedRoute guards
  main.jsx        AuthProvider + CartProvider + RouterProvider
```

## What's implemented
- Public storefront: home, product listing with category/price/sort filters, product
  details with gallery + reviews, vendor storefronts, browse-all-shops
- Guest cart (no login required) + full cart page, grouped by vendor
- Checkout: works for both "Add to Cart → Checkout" and "Order Now" (buy-now) flows,
  Cash on Delivery active, bKash shown as "Coming Soon" (disabled) per your requirements
- Multi-vendor order splitting is handled automatically by the backend — the confirmation
  page shows each resulting order (one per shop) if the cart had items from more than one
- Customer: register/login, order history
- Vendor: register (creates shop profile in one step), dashboard overview, full product
  CRUD (multi-image upload), order list with status updates, shop profile editing
- Admin: dashboard stats, vendor management (block/unblock/soft-delete/restore), product
  moderation (block/soft-delete/restore across all vendors), customer list + block,
  all-orders view with status updates, review moderation

## Notes
- Product `deliveryCharge` is per-product (set by the vendor when adding a product), matching
  your backend schema — the cart/checkout summary sums it per vendor group automatically.
- `paymentOptions` on the product add/edit form lets a vendor mark bKash support for later;
  checkout itself is locked to `cod` until bKash is wired up on the backend.
