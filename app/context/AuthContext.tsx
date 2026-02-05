'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email?: string;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null, expiresInSeconds?: number) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loadingAuth: boolean; // <-- toto je nové
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
  logout: () => {},
  loadingAuth: true, // <-- default hodnota
});

interface Props {
  children: ReactNode;
}

let logoutTimeout: NodeJS.Timeout | null = null;

export const AuthProvider = ({ children }: Props) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // <-- tu
  const router = useRouter();

  const logout = () => {
    console.log('Logging out...');
    setTokenState(null);
    setUserState(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (logoutTimeout) clearTimeout(logoutTimeout);
    router.push('/login');
  };

  // načítanie tokenu a usera z localStorage pri mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');

    if (!storedToken || !expiry) {
      setLoadingAuth(false);
      return;
    }

    const remainingTime = Number(expiry) - Date.now();
    if (remainingTime <= 0) {
      logout();
      setLoadingAuth(false);
      return;
    }

    setTokenState(storedToken);
    logoutTimeout = setTimeout(logout, remainingTime);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(user => setUserState(user))
      .catch(logout)
      .finally(() => setLoadingAuth(false));
  }, []);

  // nastavenie tokenu + timeout na logout
  const setToken = (newToken: string | null, expiresInSeconds?: number) => {
    if (newToken && expiresInSeconds) {
      const expiryTime = Date.now() + expiresInSeconds * 1000;
      localStorage.setItem('token', newToken);
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      setTokenState(newToken);

      if (logoutTimeout) clearTimeout(logoutTimeout);
      logoutTimeout = setTimeout(logout, expiresInSeconds * 1000);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      setTokenState(null);
    }
  };

  const setUser = (newUser: User | null) => {
    if (newUser) {
      console.log('Setting new user:', newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
    setUserState(newUser);
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, logout, loadingAuth }} // <-- pridane loadingAuth
    >
      {children}
    </AuthContext.Provider>
  );
};
