import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiService.getCurrentUser()
        .then(response => {
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      isLoggedIn: !!user,
      logout,
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};