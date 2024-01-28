import { lazy, Suspense } from "react";
import { dataBar } from "../Dashboard/Data";
// import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { BsBoundingBox, BsBagCheck } from "react-icons/bs";
import { BiCartDownload } from "react-icons/bi";
import { FiTruck } from "react-icons/fi";
import { RxCrossCircled } from "react-icons/rx";
const Loader = lazy(() => import("../utils/Loader.jsx"));
import { getSessionId } from "../utils/get_session_id.js";

const Orderbar = () => {
  const navigate = useNavigate();
  const sessionId = getSessionId();

  const newOrder = () => {
    navigate("neworder");
  };
  const allOrder = () => {
    navigate("/dashboard/orders");
  };
  const ship = () => {
    navigate("shipping");
  };
  const exchange = () => {
    navigate("delivered");
  };
  const cancel = () => {
    navigate("cancelled");
  };

  const { activeLinkParam } = useParams();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(activeLinkParam);

  useEffect(() => {
    setActiveLink(activeLinkParam);
  }, [activeLinkParam]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  //this is our sub api for requesting main api
  const send_status_id = (data) =>
    apiRequest({
      url: "/dashboard/get_order_stats",
      method: "post",
      data: data,
    });

  const queryClient = useQueryClient();
  //this is our react query for posting the session id and get the data
  const { mutate, isLoading } = useMutation(send_status_id, {
    onSuccess: (data) => {
      setBarData(data?.data?.data);
      queryClient.invalidateQueries("session_id");
    },
    onError: (err) => {
      console.log(err);
    },
    retry: {
      maxAttempts: 3,
      delay: (attempt) => {
        return attempt * 1000;
      },
    },
  });
  //using use memohook we are storing the response data of api
  const [BarData, setBarData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );
  //we are psoting our session id for api requesting

  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      const formData = new FormData();

      // formData.append("session_id", "sess_s0n8LZtpnl");
      formData.append("session_id", sessionId);
      mutate(formData);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen grid place-items-center absolute bg-white z-20 top-0 right-0 bottom-0 left-0">
        <Suspense fallback={<div>Loading...</div>}>
          <Loader />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      {/* <div className="dash-content"> */}
      <div className="hidden md:flex justify-between items-center px-2 py-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] lg:rounded-lg bg-white mx-2 my-5 ">
        <div className="flex items-center cursor-pointer " onClick={allOrder}>
          <div
            style={{ background: dataBar[0].bg, color: dataBar[0].color }}
            className="p-3 rounded-lg "
          >
            <BsBoundingBox className="text-3xl " />
          </div>

          <div className="mx-2">
            <p className="text-[#5a5a0a]">All Orders</p>
            <h1 className="text-xl font-semibold">
              {BarData && BarData?.num_all_orders}{" "}
            </h1>
          </div>
        </div>

        <div onClick={newOrder} className="flex items-center cursor-pointer">
          <div
            style={{ background: dataBar[1].bg, color: dataBar[1].color }}
            className="p-3 rounded-lg "
          >
            <BsBagCheck className="text-3xl" />{" "}
          </div>

          <div className="mx-2">
            <p className="text-[#5a5a0a]">New Order</p>
            <h1 className="text-xl font-semibold">
              {BarData && BarData?.num_new_orders}
            </h1>
          </div>
        </div>

        <div onClick={ship} className="flex items-center cursor-pointer">
          <div
            style={{
              background: dataBar[2].bg,
              color: dataBar[2].color,
            }}
            className="p-3 rounded-lg "
          >
            {" "}
            <BiCartDownload className="text-3xl" />{" "}
          </div>

          <div className="mx-2">
            <p className="text-[#5a5a0a]">Ready for Ship</p>
            <h1 className="text-xl font-semibold">
              {BarData && BarData?.num_rfs_orders}
            </h1>
          </div>
        </div>
        <div onClick={exchange} className="flex items-center cursor-pointer">
          <div
            style={{ background: dataBar[3].bg, color: dataBar[3].color }}
            className="p-3 rounded-lg "
          >
            {" "}
            <FiTruck className="text-3xl" />{" "}
          </div>

          <div className="mx-2">
            <p className="text-[#5a5a0a]">Delivered</p>
            <h1 className="text-xl font-semibold">
              {BarData && BarData?.num_delivered_orders}
            </h1>
          </div>
        </div>
        <div onClick={cancel} className="flex items-center cursor-pointer">
          <div
            style={{ background: dataBar[4].bg, color: dataBar[4].color }}
            className="p-3 rounded-lg "
          >
            {" "}
            <RxCrossCircled className="text-3xl" />{" "}
          </div>

          <div className="mx-2">
            <p className="text-[#5a5a0a]">Cancelled</p>
            <h1 className="text-xl font-semibold">
              {BarData && BarData?.num_cancelled_orders}
            </h1>
          </div>
        </div>
      </div>

      <div className=" md:hidden   bg-white pt-2">
        <h2 className="ml-4 text-xl font-semibold text-[#1687a7]">Order</h2>
        <div className="overflow-x-auto whitespace-nowrap my-2">
          <ul className="flex w-max h-10 justify-between space-x-8 sm:w-full">
            <li className="ml-4">
              <NavLink
                to={"/dashboard/orders"}
                isActive={() => activeLink === "/dashboard/orders"}
                style={{
                  padding: "0 0 3px 0",
                  color: activeLink === "/dashboard/orders" ? "#1687A7" : "",
                  borderBottom:
                    activeLink === "/dashboard/orders"
                      ? "2px solid #1687A7"
                      : "",
                }}
              >
                All Orders ({BarData && BarData?.num_all_orders})
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"neworder"}
                isActive={() => activeLink === "/dashboard/orders/neworder"}
                style={{
                  padding: "0 0 3px 0",
                  color:
                    activeLink === "/dashboard/orders/neworder"
                      ? "#1687A7"
                      : "",
                  borderBottom:
                    activeLink === "/dashboard/orders/neworder"
                      ? "2px solid #1687A7"
                      : "",
                }}
              >
                New Order ({BarData && BarData?.num_new_orders})
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"shipping"}
                isActive={() => activeLink === "/dashboard/orders/shipping"}
                style={{
                  padding: "0 0 3px 0",
                  color:
                    activeLink === "/dashboard/orders/shipping"
                      ? "#1687A7"
                      : "",
                  borderBottom:
                    activeLink === "/dashboard/orders/shipping"
                      ? "2px solid #1687A7"
                      : "",
                }}
              >
                Ready For Ship ({BarData && BarData?.num_rfs_orders})
              </NavLink>
            </li>

            <li>
              <NavLink
                to={"delivered"}
                isActive={() => activeLink === "/dashboard/orders/delivered"}
                style={{
                  padding: "0 0 3px 0",
                  color:
                    activeLink === "/dashboard/orders/delivered"
                      ? "#1687A7"
                      : "",
                  borderBottom:
                    activeLink === "/dashboard/orders/delivered"
                      ? "2px solid #1687A7"
                      : "",
                }}
              >
                Delivered ({BarData && BarData?.num_delivered_orders})
              </NavLink>
            </li>

            <li className="pr-6">
              <NavLink
                to={"cancelled"}
                isActive={() => activeLink === "/dashboard/orders/cancelled"}
                style={{
                  padding: "0 0 3px 0",
                  color:
                    activeLink === "/dashboard/orders/cancelled"
                      ? "#1687A7"
                      : "",
                  borderBottom:
                    activeLink === "/dashboard/orders/cancelled"
                      ? "2px solid #1687A7"
                      : "",
                }}
              >
                Cancelled ({BarData && BarData?.num_cancelled_orders})
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default Orderbar;
