import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Usage: <Route element={<ProtectedRoute roles={["vendor"]} />}>...children</Route>
const ProtectedRoute = ({ roles }) => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
