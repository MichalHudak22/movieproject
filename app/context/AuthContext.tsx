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
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
  logout: () => {},
});

interface Props {
  children: ReactNode;
}

let logoutTimeout: NodeJS.Timeout | null = null;

export const AuthProvider = ({ children }: Props) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
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
  if (!storedToken) return;

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error('Invalid token');
      return res.json();
    })
    .then(user => {
      setTokenState(storedToken);
      setUserState(user);
    })
    .catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTokenState(null);
      setUserState(null);
    });
}, []);


  // nastavenie tokenu + timeout na logout
  const setToken = (newToken: string | null, expiresInSeconds?: number) => {
    if (newToken) {
      console.log('Setting new token:', newToken);
      localStorage.setItem('token', newToken);
      setTokenState(newToken);

      if (logoutTimeout) clearTimeout(logoutTimeout);
      if (expiresInSeconds) {
        logoutTimeout = setTimeout(() => {
          console.log('Token expired, logging out...');
          logout();
        }, expiresInSeconds * 1000);
      }
    } else {
      console.log('Removing token');
      localStorage.removeItem('token');
      setTokenState(null);
      if (logoutTimeout) clearTimeout(logoutTimeout);
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
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
