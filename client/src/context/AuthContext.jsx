import React, { createContext, useState, useCallback } from "react";
import axios from "../utils/axiosInstance";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("FinBridge_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return !!storedToken;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("/auth/login", { email, password });

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "FinBridge_user",
          JSON.stringify(response.data.user),
        );
        return response.data;
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("FinBridge_user");
  }, []);

  const updateUserProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      console.log("📤 Sending profile update request with data:", profileData);

      const response = await axios.put("/users/profile", profileData);

      console.log("✅ Received response from server:", response.data);

      if (response.data.success && response.data.user) {
        // Update global state with new user data
        const updatedUser = response.data.user;
        console.log("🔄 Updating global user state:", updatedUser);

        setUser(updatedUser);

        // Update localStorage to keep data in sync across tabs/refreshes
        localStorage.setItem("FinBridge_user", JSON.stringify(updatedUser));

        console.log(
          "💾 LocalStorage updated. User data synced across all components.",
        );

        return response.data;
      } else {
        throw new Error(response.data.message || "Profile update failed");
      }
    } catch (error) {
      console.error("❌ Profile update error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, loading, login, logout, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
