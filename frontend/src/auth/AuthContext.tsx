import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '../api/auth';
import { ApiError } from '../api/client';

interface AuthState {
  username: string | null;
  role: 'OWNER' | 'HELPER' | null;
  isLoggedIn: boolean;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    username: null,
    role: null,
    isLoggedIn: false,
    loading: true,
  });

  const checkStatus = useCallback(async () => {
    try {
      const data = await authApi.status();
      setState({
        username: data.username,
        role: data.role,
        isLoggedIn: true,
        loading: false,
      });
    } catch {
      setState({ username: null, role: null, isLoggedIn: false, loading: false });
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const login = async (username: string, password: string) => {
    if (!username.trim() || !password) {
      throw new Error('Username and password are required');
    }
    const data = await authApi.login({ username, password });
    if (!data.username || !data.role) {
      throw new Error('Login failed: invalid server response');
    }
    setState({
      username: data.username,
      role: data.role,
      isLoggedIn: true,
      loading: false,
    });
  };

  const register = async (username: string, password: string) => {
    try {
      await authApi.register({ username, password });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        throw new Error('Username already taken');
      }
      throw err;
    }
    const data = await authApi.login({ username, password });
    setState({
      username: data.username,
      role: data.role,
      isLoggedIn: true,
      loading: false,
    });
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setState({ username: null, role: null, isLoggedIn: false, loading: false });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
