
import { Navigate, Outlet } from "react-router-dom";
const ProctedRoute2 = ({ dashAuthnticate, dashpage }) => {
  if (!dashAuthnticate) {
    return <Navigate to={"/login"} />;
  }
  return <Outlet />;
};

export default ProctedRoute2;
