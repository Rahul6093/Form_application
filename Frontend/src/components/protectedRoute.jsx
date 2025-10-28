import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />; // redirect to login if not logged in
  return children;
};

export default ProtectedRoute;
