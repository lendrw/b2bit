import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { IAuth } from "../../types/auth";

export interface IAuthProviderProps {
  children: React.ReactNode;
}
const LOCAL_STORAGE_KEY__ACCESS_TOKEN = "access_token";

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<IAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);

    if (token) {
      setAuth({
        accessToken: token,
      });
    }

    setIsLoading(false);
  }, []);

  const login = useCallback((authData: IAuth) => {
    localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, authData.accessToken);
    setAuth(authData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    setAuth(null);
  }, []);

  const isAuthenticated = useMemo(() => !!auth, [auth]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
