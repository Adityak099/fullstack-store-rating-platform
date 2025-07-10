import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          // Check if token is expired
          if (decoded.exp * 1000 > Date.now()) {
            setUser(decoded);
            setToken(storedToken);
          } else {
            // Token expired, remove it
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      console.log('Login response:', response);
      console.log('Response data:', response.data);
      
      const { token: newToken } = response.data.data; // Fixed: token is in response.data.data
      
      if (!newToken || typeof newToken !== 'string') {
        throw new Error('Invalid token received from server');
      }
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Decode token to get user info
      const decoded = jwtDecode(newToken);
      setUser(decoded);
      
      return { success: true, user: decoded };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      console.log('Register response:', response);
      console.log('Response data:', response.data);
      
      const { token: newToken } = response.data.data; // Fixed: token is in response.data.data
      
      if (!newToken || typeof newToken !== 'string') {
        throw new Error('Invalid token received from server');
      }
      
      // Auto-login after successful registration
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Decode token to get user info
      const decoded = jwtDecode(newToken);
      setUser(decoded);
      
      return { success: true, user: decoded };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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