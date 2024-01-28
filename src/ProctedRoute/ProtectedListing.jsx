
import { Navigate, Outlet } from "react-router-dom";
const ProtectedListing = ({ listingAuthnticated, detailspage }) => {
  if (!listingAuthnticated) {
    return <Navigate to={"/shop/editprofile"} />;
  }
  return <Outlet />;
};

export default ProtectedListing;
