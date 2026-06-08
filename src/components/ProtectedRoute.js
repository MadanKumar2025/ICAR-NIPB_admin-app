import { Navigate, useLocation } from "react-router-dom";
import { usePermissions } from "../components/hooks/usePermissions.js";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { hasAccessByUrl, loading } = usePermissions();

  const path = location.pathname.toLowerCase();
  
  if (token && path === "/login") {
    return <Navigate to="/" replace />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (path === "/") {
    return children;
  }

  if (!hasAccessByUrl(path)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
