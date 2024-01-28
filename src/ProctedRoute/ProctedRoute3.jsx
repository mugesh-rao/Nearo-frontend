import React from "react";
import { Navigate, Outlet } from "react-router";

const ProctedRoute3 = ({ pageAuth }) => {
  if (!pageAuth) {
    return <Navigate to={"/dashboard"} />;
  }

  return <Outlet />;
};

export default ProctedRoute3;
