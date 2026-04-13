import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const ProtectedRoute = () => {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
