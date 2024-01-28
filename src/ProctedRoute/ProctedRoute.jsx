
import { Navigate, Outlet } from "react-router-dom";
const ProctedRoute = ({ isAuthnticated, detailspage }) => {
  if (!isAuthnticated) {
    return <Navigate to={"/signup/personaldetails"} />;
  }
  return <Outlet />;
};

export default ProctedRoute;
