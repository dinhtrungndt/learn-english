import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, getUserProfile, logout as authLogout, login as authLogin, register as authRegister } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const localUser = getCurrentUser();
        if (localUser) {
          setUser(localUser);
          try {
            const currentUser = await getUserProfile();
            setUser(prev => ({ ...prev, ...currentUser }));
          } catch (profileError) {
            console.warn('Session expired or invalid token');
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authLogin(username, password);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    return await authRegister(userData);
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
  };

  const authContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading ? children : <div className="h-screen w-full flex items-center justify-center text-[#58CC02] font-bold text-xl">Đang tải...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
