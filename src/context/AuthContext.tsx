import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("[AuthContext] accessToken in memory:", accessToken);
  }, [accessToken]);

  // Use useMutation for logout if there is an API endpoint; otherwise clear local storage

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem("refreshToken"); // Remove refreshToken
    localStorage.removeItem("email"); // Remove email
    window.__accessToken = null;
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
