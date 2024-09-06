import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const authenticationDone = sessionStorage.getItem("userToken");

  return authenticationDone ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;