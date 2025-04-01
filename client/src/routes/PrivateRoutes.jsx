import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-75"></div>
        <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-150"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-300"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={location.pathname} />;
  }

  return children;
};

export default PrivateRoutes;