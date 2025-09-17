import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (role && userRole !== role) return <Navigate to="/home" replace />;

  return children;
};

export default ProtectedRoute;
