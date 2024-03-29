import { useUser } from './api/useUser';
import useLocalStorage from 'use-local-storage';

export const useAuth = () => {
  const [userId, setUserId] = useLocalStorage<string | undefined>(
    'userId',
    undefined,
  );
  const { user, isLoading } = useUser({ userId });

  const isAuth = !!userId;

  const logout = () => {
    setUserId(undefined);
  };

  const login = (userId: string) => {
    setUserId(userId);
  };

  return {
    user,
    isLoading,
    isAuth,
    login,
    logout,
  };
};
