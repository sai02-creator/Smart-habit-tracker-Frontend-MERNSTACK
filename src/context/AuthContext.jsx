import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  // SAFE USER STATE
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");

      // Prevent crash if value is missing or invalid
      if (!raw || raw === "undefined") {
        return null;
      }

      return JSON.parse(raw);
    } catch (error) {
      console.error("Invalid user in localStorage:", error);

      localStorage.removeItem("user");

      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // CHECK AUTH ON APP LOAD
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/profile")
      .then((res) => {
        const userData = res.data.data;

        setUser(userData);

        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );
      })
      .catch((error) => {
        console.error("Profile fetch failed:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const userData = res.data.user;

    localStorage.setItem("token", res.data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

    return userData;
  };

  // REGISTER
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    const userData = res.data.user;

    localStorage.setItem("token", res.data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

    return userData;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // UPDATE USER
  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};