import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/auth/hooks/useAuth';
import type { AuthRole } from '../../app/auth/types/auth';

type RequireAuthProps = {
  allowedRoles?: AuthRole[];
};

export function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
