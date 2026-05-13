import { useAuthStore } from '../../../store/auth.store';

export function useAuth() {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  return { user, token, setAuth, clearAuth };
}
