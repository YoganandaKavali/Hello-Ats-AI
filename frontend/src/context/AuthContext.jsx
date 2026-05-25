import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Never restore session — always show login on load/refresh
  useEffect(() => {
    authService.clearPersistedSession();
    setReady(true);
  }, []);

  const login = async (credentials) => {
    const loggedIn = authService.login(credentials);
    setUser(loggedIn);
    return loggedIn;
  };

  const signup = async (data) => {
    authService.signup(data);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
