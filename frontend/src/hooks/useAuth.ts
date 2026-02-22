import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, register, logout, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && localStorage.getItem('token')) {
      fetchUser();
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};

export const useRequireAuth = (redirectTo = '/login') => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate(redirectTo);
      return;
    }

    if (!isAuthenticated && !isLoading) {
      fetchUser().then(() => {
        if (!useAuthStore.getState().isAuthenticated) {
          navigate(redirectTo);
        }
      });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};

export const useRequireAdmin = (redirectTo = '/') => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user?.isAdmin) {
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, user, navigate, redirectTo]);

  return { isAdmin: user?.isAdmin, isLoading };
};

export default useAuth;
