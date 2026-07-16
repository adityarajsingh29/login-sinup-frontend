import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// Decodes JWT payload client-side
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    // Check local storage or system preference
    return localStorage.getItem('theme') || 'dark';
  });

  const logoutTimerRef = useRef(null);

  // Setup theme on load
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle setting auto logout timer
  const setAutoLogoutTimer = (token) => {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return;

    const expiryTime = decoded.exp * 1000; // exp is in seconds
    const currentTime = Date.now();
    const timeRemaining = expiryTime - currentTime;

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    if (timeRemaining <= 0) {
      logout();
      toast.warning('Session expired. Please log in again.');
    } else {
      logoutTimerRef.current = setTimeout(() => {
        logout();
        toast.warning('Your session has expired. Please log in again.');
      }, timeRemaining);
    }
  };

  // Check auth status on load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Check if expired before pinging API
      const decoded = parseJwt(token);
      if (decoded && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/check-auth');
        if (response.data.authenticated) {
          setUser(response.data.user);
          setAutoLogoutTimer(token);
        }
      } catch (err) {
        console.error('Initial check-auth failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  // Toggle light/dark mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sign up action
  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setAutoLogoutTimer(token);

      toast.success('Registration successful! Welcome aboard.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login action
  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setAutoLogoutTimer(token);

      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout action
  const logout = async () => {
    try {
      // Optional API call to inform backend
      await api.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      toast.info('Logged out successfully');
    }
  };

  const value = {
    user,
    loading,
    theme,
    toggleTheme,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
