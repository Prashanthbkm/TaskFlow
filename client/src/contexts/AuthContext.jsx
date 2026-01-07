import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../config/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inline styles for loading state
  const loadingContainerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  };

  const loadingSpinnerStyle = {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  };

  const loadingTextStyle = {
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '16px'
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data.data.user);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login({ email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens and user
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      toast.success('Login successful! Welcome back!');
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userData);
      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens and user
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      toast.success('Registration successful! Welcome aboard!');
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await authAPI.logout({ refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Clear state
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setError(null);

      toast.success('Logged out successfully');
    }
  }, [refreshToken]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const updateProfile = async (updates) => {
    try {
      const response = await authAPI.updateProfile(updates);
      const updatedUser = response.data.data.user;
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      toast.success('Profile updated successfully');
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    register,
    updateProfile,
    loading,
    error,
    clearError,
    isAuthenticated: !!accessToken && !!user
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={loadingSpinnerStyle}></div>
          <p style={loadingTextStyle}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};