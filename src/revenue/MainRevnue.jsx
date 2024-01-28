import { lazy, Suspense, useState } from "react";
const RevenueBar = lazy(() => import("./RevenueBar"));
import { Outlet } from "react-router";
import Loader from "../utils/Loader";


const MainRevnue = () => {
  const [timeFrame, setTimeFrame] = useState("this_week");

  return (
    <>
      <RevenueBar timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
      <Suspense
        fallback={
          <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
          <Loader />
        </div>
        }
      >
        <Outlet context={[timeFrame]}/>
      </Suspense>
    </>
  );
};

export default MainRevnue;
