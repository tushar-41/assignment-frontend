"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedJwt = Cookies.get("jwt");
    const storedUser = Cookies.get("user");
    if (storedJwt && storedUser) {
      setJwt(storedJwt);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function login(jwt, user) {
    Cookies.set("jwt", jwt, { expires: 7 });
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
    setJwt(jwt);
    setUser(user);
  }

  function logout() {
    Cookies.remove("jwt");
    Cookies.remove("user");
    setJwt(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, jwt, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
