import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { IAuth, UserProfile } from "../../types/auth";
import { authService } from "../../services";

export interface IAuthProviderProps {
  children: React.ReactNode;
}
const LOCAL_STORAGE_KEY__ACCESS_TOKEN = "access_token";

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<IAuth | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);

    if (token) {
      setAuth({ accessToken: token });
      authService.getProfile().then(setUser).catch(console.error);
    }

    setIsLoading(false);
  }, []);

  const login = useCallback((authData: IAuth, userData?: UserProfile) => {
    localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, authData.accessToken);
    setAuth(authData);
    if (userData) setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    setAuth(null);
    setUser(null);
  }, []);

  const isAuthenticated = useMemo(() => !!auth, [auth]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
