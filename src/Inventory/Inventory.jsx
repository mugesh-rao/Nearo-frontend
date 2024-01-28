import { Suspense, lazy } from "react";
const Bar = lazy(() => import("./Bar.jsx"));
import { Outlet } from "react-router";
import Loader from "../utils/Loader.jsx";
const Inventory = () => {
  return (
    <>
      <Bar />
      <Suspense
        fallback={
          <div className="h-screen w-full grid place-items-center fixed top-0 right-0 bottom-0 left-0">
            <Loader />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </>
  );
};

export default Inventory;
