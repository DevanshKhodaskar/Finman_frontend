// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://finman-backend.vercel.app/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (phone_number, password) => {
    const res = await axios.post(
      "https://finman-backend.vercel.app/api/auth/login",
      { phone_number, password },
      { withCredentials: true }
    );
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    await axios.post("https://finman-backend.vercel.app/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
