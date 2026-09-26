import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthApi } from "../../Api/authApi";
import { useAuth } from "./AuthContext";
import { APP_NAME } from "../../Config/Config";

const RegisterVendor = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", contactNumber: "",
    shopName: "", brandName: "", description: "", address: "",
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      if (logo) fd.append("logo", logo);

      const { data } = await AuthApi.registerVendor(fd);
      login(data.data);
      toast.success("Shop created! Welcome to " + APP_NAME);
      navigate("/vendor");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-extrabold text-primary">{APP_NAME}</Link>
          <p className="text-base-content/60 mt-2 text-sm">Open your shop and start selling</p>
        </div>

        <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body gap-3">
            <p className="font-semibold text-sm text-base-content/70">Your details</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Your full name" required className="input input-bordered w-full" value={form.name} onChange={update("name")} />
              <input placeholder="Phone number" className="input input-bordered w-full" value={form.contactNumber} onChange={update("contactNumber")} />
            </div>
            <input type="email" placeholder="Email" required className="input input-bordered w-full" value={form.email} onChange={update("email")} />
            <input type="password" placeholder="Password (min 6 characters)" required className="input input-bordered w-full" value={form.password} onChange={update("password")} />

            <div className="divider my-1" />
            <p className="font-semibold text-sm text-base-content/70">Your shop</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Shop name" required className="input input-bordered w-full" value={form.shopName} onChange={update("shopName")} />
              <input placeholder="Brand name (optional)" className="input input-bordered w-full" value={form.brandName} onChange={update("brandName")} />
            </div>
            <textarea placeholder="Short shop description" rows={2} className="textarea textarea-bordered w-full" value={form.description} onChange={update("description")} />
            <input placeholder="Shop address" className="input input-bordered w-full" value={form.address} onChange={update("address")} />

            <label className="form-control">
              <span className="label-text text-sm mb-1">Shop logo (optional)</span>
              <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={(e) => setLogo(e.target.files[0])} />
            </label>

            {error && <p className="text-error text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn btn-secondary mt-2 rounded-full">
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Open my shop"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-base-content/60 mt-6">
          Already selling with us? <Link to="/login" className="text-primary font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterVendor;
