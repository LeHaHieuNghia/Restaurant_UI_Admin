// scenes/account/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create AuthContext
const AuthContext = createContext();

// Create a custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated on mount
  useEffect(() => {
    const user = localStorage.getItem("admin");
    if (user) {
      setIsAuthenticated(true); // User is authenticated
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("admin", "true"); // Store user in localStorage
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin"); // Remove user from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
