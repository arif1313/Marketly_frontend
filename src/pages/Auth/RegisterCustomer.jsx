import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthApi } from "../../Api/authApi";
import { useAuth } from "./AuthContext";
import { APP_NAME } from "../../Config/Config";

const RegisterCustomer = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", contactNumber: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await AuthApi.registerCustomer(form);
      login(data.data);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-extrabold text-primary">{APP_NAME}</Link>
          <p className="text-base-content/60 mt-2 text-sm">Create your customer account</p>
        </div>

        <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body gap-3">
            <input placeholder="Full name" required className="input input-bordered w-full" value={form.name} onChange={update("name")} />
            <input type="email" placeholder="Email" required className="input input-bordered w-full" value={form.email} onChange={update("email")} />
            <input type="password" placeholder="Password (min 6 characters)" required className="input input-bordered w-full" value={form.password} onChange={update("password")} />
            <input placeholder="Phone number (optional)" className="input input-bordered w-full" value={form.contactNumber} onChange={update("contactNumber")} />
            <input placeholder="Address (optional)" className="input input-bordered w-full" value={form.address} onChange={update("address")} />

            {error && <p className="text-error text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn btn-primary mt-2 rounded-full">
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Create account"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-base-content/60 mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterCustomer;
