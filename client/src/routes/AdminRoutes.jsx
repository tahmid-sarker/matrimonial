import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AdminRoutes = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/users")
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Find the logged-in user
  const roledUser = users.find((u) => u.email === user?.email);

  if (isLoading || !roledUser) {
    return (
      <div className="flex justify-center items-center h-screen space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-75"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-300"></div>
      </div>
    );
  }

  if (roledUser.role !== "admin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoutes;