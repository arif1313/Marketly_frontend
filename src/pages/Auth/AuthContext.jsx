import { createContext, useContext, useEffect, useState } from "react";
import { AuthApi } from "../../Api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      const savedVendor = localStorage.getItem("vendor");
      if (savedVendor) setVendor(JSON.parse(savedVendor));

      // Refresh from server in the background to catch role/status changes
      AuthApi.me()
        .then(({ data }) => {
          setUser(data.data.user);
          setVendor(data.data.vendor || null);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          if (data.data.vendor) localStorage.setItem("vendor", JSON.stringify(data.data.vendor));
        })
        .catch(() => {
          // token invalid/expired — clear silently
          logout();
        })
        .finally(() => setInitializing(false));
    } else {
      setInitializing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (data) => {
    setUser(data.user);
    setVendor(data.vendor || null);
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    if (data.vendor) localStorage.setItem("vendor", JSON.stringify(data.vendor));
    if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
  };

  const logout = () => {
    setUser(null);
    setVendor(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("vendor");
    localStorage.removeItem("refreshToken");
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, vendor, initializing, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
