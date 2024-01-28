// import Orderbar from './Orderbar.jsx'
import { lazy, Suspense } from "react";
import { Outlet } from "react-router";
import Loader from "../utils/Loader.jsx";
const Orderbar = lazy(() => import("./Orderbar.jsx"));
const OutletOrder = () => {
  return (
    <>
      <Orderbar />
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center w-full ">
            <Loader />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </>
  );
};

export default OutletOrder;
