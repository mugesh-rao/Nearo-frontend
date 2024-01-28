import { useNavigate } from "react-router";
import { dataBar } from "./Data";
import { useEffect, useState, useMemo } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BsBagCheck } from "react-icons/bs";
import { FiTruck } from "react-icons/fi";
import { BiCartDownload } from "react-icons/bi";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import Loader from "../utils/Loader";
import { getSessionId } from "../utils/get_session_id";
import { RxCrossCircled } from "react-icons/rx";
const DashContent = () => {
  const { activeLinkParam } = useParams();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(activeLinkParam);
  const sessionId = getSessionId();
  useEffect(() => {
    setActiveLink(activeLinkParam);
  }, [activeLinkParam]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const navigate = useNavigate();
  const home = () => {
    navigate("/dashboard/");
  };
  const newOrder = () => {
    navigate("/dashboard/neworders");
  };
  const ship = () => {
    navigate("/dashboard/shipping");
  };
  const delivered = () => {
    navigate("/dashboard/delivered");
  };
  const cancelled = () => {
    navigate("/dashboard/cancelled");
  };

  //this is our sub api for requesting main api
  const send_status_id = (data) =>
    apiRequest({
      url: "/dashboard/get_order_stats",
      method: "post",
      data: data,
    });

  const queryClient = useQueryClient();
  //this is our react query for posting the session id and get the data
  const get_stats = useMutation(send_status_id, {
    onSuccess: (data) => {
      setBarData(data?.data);
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
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      const formData = new FormData();
      // formData.append("session_id", "sess_s0n8LZtpnl");
      formData.append("session_id", sessionId);

      get_stats.mutate(formData);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
      <Loader />
    </div>
    );
  }

  return (
    <>
      {!isLoading && (
        <div className="hidden md:flex justify-between items-center px-2 py-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] lg:rounded-lg bg-white mx-2 my-5 " >
          <div className="flex items-center cursor-pointer " onClick={home}>
            <div
              style={{ background: dataBar[0].bg, color: dataBar[0].color }}
              className="p-3 rounded-lg "
            >
              <AiOutlineHome className="text-3xl " />
            </div>
            <p className="text-[#5a5a0a] mx-2 ">Home</p>
          </div>

          <div onClick={newOrder} className="flex items-center cursor-pointer">
            <div
              className="p-3 rounded-lg "
              style={{ background: dataBar[1].bg, color: dataBar[1].color }}
            >
              <BsBagCheck className="text-3xl" />{" "}
            </div>

            <div className="mx-2">
              <p className="text-[#5a5a0a]">New Order</p>
              <h1 className="text-xl font-semibold">
                {BarData?.data?.num_new_orders}
              </h1>
            </div>
          </div>
          <div onClick={ship} className="flex items-center cursor-pointer">
            <div
              className="p-3 rounded-lg "
              style={{
                background: dataBar[2].bg,
                color: dataBar[2].color,
              }}
            >
              {" "}
              <BiCartDownload className="text-3xl" />{" "}
            </div>

            <div className="mx-2">
              <p className="text-[#5a5a0a]">Ready for Ship</p>
              <h1 className="text-xl font-semibold">
                {BarData?.data?.num_rfs_orders}
              </h1>
            </div>
          </div>
          <div onClick={delivered} className="flex items-center cursor-pointer">
            <div
              className="p-3 rounded-lg "
              style={{ background: dataBar[3].bg, color: dataBar[3].color }}
            >
              {" "}
              <FiTruck className="text-3xl" />
            </div>

            <div className="mx-2">
              <p className="text-[#5a5a0a] "> Delivered</p>
              <h1 className="text-xl font-semibold">
                {BarData?.data?.num_delivered_orders}
              </h1>
            </div>
          </div>
          <div onClick={cancelled} className="flex items-center cursor-pointer">
            <div
              className="p-3 rounded-lg "
              style={{ background: dataBar[4].bg, color: dataBar[4].color }}
            >
              < RxCrossCircled  className="text-3xl" />{" "}
            </div>

            <div className="mx-2">
              <p className="text-[#5a5a0a] ">Cancel</p>
              <h1 className="text-xl font-semibold">
                {BarData?.data?.num_cancelled_orders}
              </h1>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className=" md:hidden bg-white pt-2">
          <h2 className="ml-4 text-xl font-semibold text-[#1687a7]">
            My Dashboard
          </h2>
          <div className="overflow-x-auto whitespace-nowrap my-2">
            <ul className="flex w-max h-10 justify-between space-x-8 sm:w-full">
              <li className="ml-4">
                <NavLink
                  to="/dashboard/"
                  isActive={() => activeLink === "/dashboard/"}
                  style={{
                    padding: "0 0 3px 0",
                    color: activeLink === "/dashboard/" ? "#1687A7" : "",
                    borderBottom:
                      activeLink === "/dashboard/" ? "2px solid #1687A7" : "",
                  }}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/neworders"
                  isActive={() => activeLink === "/dashboard/neworders"}
                  style={{
                    padding: "0 0 3px 0",
                    color:
                      activeLink === "/dashboard/neworders" ? "#1687A7" : "",
                    borderBottom:
                      activeLink === "/dashboard/neworders"
                        ? "2px solid #1687A7"
                        : "",
                  }}
                >
                  New Order({BarData?.data?.num_new_orders})
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/shipping"
                  isActive={() => activeLink === "/dashboard/shipping"}
                  style={{
                    padding: "0 0 3px 0",
                    color:
                      activeLink === "/dashboard/shipping" ? "#1687A7" : "",
                    borderBottom:
                      activeLink === "/dashboard/shipping"
                        ? "2px solid #1687A7"
                        : "",
                  }}
                >
                  Ready For Ship({BarData?.data?.num_rfs_orders})
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/delivered"
                  isActive={() => activeLink === "/dashboard/delivered"}
                  style={{
                    padding: "0 0 3px 0",
                    color:
                      activeLink === "/dashboard/delivered" ? "#1687A7" : "",
                    borderBottom:
                      activeLink === "/dashboard/delivered"
                        ? "2px solid #1687A7"
                        : "",
                  }}
                >
                  Delivered({BarData?.data?.num_delivered_orders})
                </NavLink>
              </li>
              <li className="pr-6">
                <NavLink
                  to="/dashboard/cancelled"
                  isActive={() => activeLink === "/dashboard/cancelled"}
                  style={{
                    padding: "0 0 3px 0",
                    color:
                      activeLink === "/dashboard/cancelled" ? "#1687A7" : "",
                    borderBottom:
                      activeLink === "/dashboard/cancelled"
                        ? "2px solid #1687A7"
                        : "",
                  }}
                >
                  Cancelled({BarData?.data?.num_cancelled_orders})
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default DashContent;
