import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "../lib/session";

// Sends logged-out visitors to /login (and back here afterwards). With
// role="admin", non-admins are sent home. The API enforces the same rules.
const RequireAuth = ({ role, children }) => {
  const location = useLocation();
  const session = getSession();

  if (!session.token) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (role && session.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RequireAuth;
