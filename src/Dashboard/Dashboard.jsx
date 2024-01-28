import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { CiSearch } from "react-icons/ci";
import { lazy, Suspense } from "react";
import Loader from "../utils/Loader";
const Humburger = lazy(() => import("../humburger/Humburger"));
const DashMenu = lazy(() => import("./DashMenu"));

const Dashboard = () => {
  const Dispatch = useDispatch();
  useEffect(() => {
    Dispatch({
      type: "falseDash",
    });
  }, []);

  return (
    <>
      <div className="flex h-auto bg-gray-50">
        <div className="hidden lg:block w-[18%] z-20 ">
          <DashMenu />
        </div>

        <div className="w-full lg:w-[82%] ">
          <div className="flex justify-between h-[4.6rem] shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] p-2 items-center bg-white ">
            <div className="flex items-center lg:hidden ">
              <Humburger />

              {/* <LazyLoadImage
                src={logo}
                alt="Nearo"
                className="w-28 mx-3 custom400:mx-5 my-8 "
              /> */}
              <h1 className="heading text-4xl mx-3  text-[#1687a7]">nearo</h1>
            </div>
            <div className="hidden sm:flex items-center w-[75%] lg:w-[86%] bg-[#5a5a5a0a] rounded-lg ml-5 ">
              <CiSearch className="text-2xl text-[#1687a7] mx-2" />
              <input
                type="search"
                name="search"
                placeholder="Search Your Products"
                autoComplete="off"
                className=" w-full rounded-lg py-2 pr-2 bg-transparent outline-none  "
              />
            </div>

            <div className="flex items-center">
              <NavLink to={"/dashboard/search"}>
                {" "}
                <CiSearch className="text-3xl text-[#1687a7] sm:hidden bg-[#5a5a5a0a] rounded-lg h-10 w-10 p-2 " />
              </NavLink>

              <NotificationsNoneIcon
                sx={{
                  fontSize: 25,
                  cursor: "pointer",
                  color: "#1687A7",
                  margin: "0 7px 0 7px",
                }}
              />
              <NavLink to={"/shop/profile"}>
                <AccountBoxIcon
                  sx={{
                    fontSize: 40,
                    cursor: "pointer",
                    color: "#1687a7",
                  }}
                />
              </NavLink>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
                <Loader />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
