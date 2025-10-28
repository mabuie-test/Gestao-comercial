import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendedor';
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'gestao_comercial_auth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as { user: User; token: string };
      setUser(parsed.user);
      setToken(parsed.token);
      api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: accessToken, user: userPayload } = response.data;
    setUser(userPayload);
    setToken(accessToken);
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userPayload, token: accessToken }));
    navigate('/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    delete api.defaults.headers.common.Authorization;
    navigate('/login');
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [login, logout, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
