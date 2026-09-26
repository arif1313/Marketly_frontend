import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthApi } from "../../Api/authApi";
import { useAuth } from "./AuthContext";
import { APP_NAME } from "../../Config/Config";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectByRole = (user) => {
    const from = location.state?.from;
    if (from) return navigate(from, { replace: true });
    if (user.role === "vendor") return navigate("/vendor", { replace: true });
    if (user.role === "admin") return navigate("/admin", { replace: true });
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await AuthApi.login(form);
      login(data.data);
      toast.success("Welcome back!");
      redirectByRole(data.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-extrabold text-primary">{APP_NAME}</Link>
          <p className="text-base-content/60 mt-2 text-sm">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body gap-3">
            <label className="form-control">
              <span className="label-text text-sm mb-1">Email</span>
              <input
                type="email"
                required
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="form-control">
              <span className="label-text text-sm mb-1">Password</span>
              <input
                type="password"
                required
                className="input input-bordered w-full"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>

            {error && <p className="text-error text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn btn-primary mt-2 rounded-full">
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Log in"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-base-content/60 mt-6">
          New here?{" "}
          <Link to="/register" className="text-primary font-medium">Create a customer account</Link>
          {" "}or{" "}
          <Link to="/register/vendor" className="text-primary font-medium">become a vendor</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
