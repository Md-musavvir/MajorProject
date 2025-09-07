import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");

  // Not logged in → redirect to login
  if (!token) return <Navigate to="/login" replace />;

  // Role mismatch → redirect to home
  if (role && userRole !== role) return <Navigate to="/home" replace />;

  return children;
};

export default ProtectedRoute;
