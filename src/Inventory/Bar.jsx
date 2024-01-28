import { dataBar } from "../Dashboard/Data";
import { useNavigate } from "react-router";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { DiGhostSmall } from "react-icons/di";
import { FcProcess } from "react-icons/fc";
import { RiErrorWarningLine } from "react-icons/ri";
import { PiArchiveTray } from "react-icons/pi";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { useEffect, useMemo, useState } from "react";
import Loader from "../utils/Loader";
import { getSessionId } from "../utils/get_session_id";
import { MdProductionQuantityLimits } from "react-icons/md";
import { BsHourglassSplit } from "react-icons/bs";
const Bar = () => {
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const { activeLinkParam } = useParams();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(activeLinkParam);

  useEffect(() => {
    setActiveLink(activeLinkParam);
  }, [activeLinkParam]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const newOrder = () => {
    navigate("processing");
  };
  const allOrder = () => {
    navigate("/dashboard/inventory");
  };
  const ship = () => {
    navigate("lowstocks");
  };

  const exchange = () => {
    navigate("exchange");
  };

  //this is our sub api for requesting main api
  const send_status_id = (data) =>
    apiRequest({
      url: "dashboard/get_shop_product_stats",
      method: "post",
      data: data,
    });

  const queryClient = useQueryClient();
  //this is our react query for posting the session id and get the data
  const { mutate, isLoading } = useMutation(send_status_id, {
    onSuccess: (data) => {
      console.log(data?.data.data);
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
  //we are posting our session id for api requesting

  useEffect(() => {
    const formData = new FormData();
    formData.append("session_id", sessionId);

    mutate(formData);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <>
    
      <div className="hidden md:flex justify-between items-center px-2 py-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] lg:rounded-lg bg-white mx-2 my-5 ">
        <div onClick={allOrder} className="flex items-center cursor-pointer ">
          <div
            style={{ background: dataBar[1].bg, color: dataBar[1].color }}
            className="p-3 rounded-lg "
          >
            <DiGhostSmall className="text-3xl " />
          </div>

          <div className="mx-2">
            <p className="text-[#5a5a0a]">All Products</p>
            <h1 className="text-xl font-semibold">
              {BarData && BarData?.num_all_products}{" "}
            </h1>
          </div>
        </div>

        <div onClick={newOrder} className="flex items-center cursor-pointer ">
          <div
            style={{
              background: dataBar[2].bg,
              color: dataBar[2].color,
            }}
            className="p-3 rounded-lg "
          >
            <BsHourglassSplit className="text-3xl " />
          </div>

          <div className="mx-2">
            <p className="text-[#5a5a0a]">Processing</p>
            <h1 className="text-xl font-semibold">
              {BarData && BarData?.num_processing}{" "}
            </h1>
          </div>
        </div>

        <div onClick={ship} className="flex items-center cursor-pointer ">
          <div
            style={{ background: dataBar[3].bg, color: dataBar[3].color }}
            className="p-3 rounded-lg "
          >
            <MdProductionQuantityLimits className="text-3xl " />
          </div>

          <div className="mx-2">
            <p className="text-[#5a5a0a]">Low Stock </p>
            <h1 className="text-xl font-semibold">
              {BarData && BarData?.num_low_stock}{" "}
            </h1>
          </div>
        </div>

        <div onClick={exchange} className="flex items-center cursor-pointer">
          <div
            style={{ background: dataBar[4].bg, color: dataBar[4].color }}
            className="p-3 rounded-lg "
          >
            <RiErrorWarningLine className="text-3xl " />
          </div>

          <div className="mx-2">
            <p className="text-[#5a5a0a]">Out of Stock</p>
            <h1 className="text-xl font-semibold">
              {BarData && BarData?.num_out_of_stock}{" "}
            </h1>
          </div>
        </div>

        <div
        aria-disabled={true}
          className="flex items-center cursor-not-allowed"
        >
          <div
            // style={{ background: dataBar[4].bg, color: dataBar[4].color }}

            className="p-3 rounded-lg bg-red-100 text-red-400 "
          >
            <PiArchiveTray className="text-3xl " />
          </div>

          <div className="mx-2">
            <p className="text-[#5a5a0a]">Archive &nbsp;&nbsp;&nbsp;</p>
            <h1 className="text-xl font-semibold">0</h1>
          </div>
        </div>
      </div>

      <div className="responsive custom800:hidden bg-white pt-2">
        <h2 className="ml-4 text-xl font-semibold text-[#1687a7]">Inventory</h2>
        <div className="overflow-x-auto whitespace-nowrap mt-2">
          <ul className="flex w-max  h-10 justify-between space-x-8  sm:w-full">
            <li className="ml-4">
              <NavLink
                to={"/dashboard/inventory"}
                isActive={() => activeLink === "/dashboard/inventory"}
                style={{
                  padding: "0 0 3px 0",
                  color: activeLink === "/dashboard/inventory" ? "#1687A7" : "",
                  borderBottom:
                    activeLink === "/dashboard/inventory"
                      ? "2px solid #1687A7"
                      : "",
                }}
              >
                All Products ({BarData && BarData?.num_all_products})
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"processing"}
                isActive={() =>
                  activeLink === "/dashboard/inventory/processing"
                }
                style={{
                  padding: "0 0 3px 0",
                  color:
                    activeLink === "/dashboard/inventory/processing"
                      ? "#1687A7"
                      : "",
                  borderBottom:
                    activeLink === "/dashboard/inventory/processing"
                      ? "2px solid #1687A7"
                      : "",
                }}
              >
                Processing ({BarData && BarData?.num_processing})
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"lowstocks"}
                isActive={() => activeLink === "/dashboard/inventory/lowstocks"}
                style={{
                  padding: "0 0 3px 0",
                  color:
                    activeLink === "/dashboard/inventory/lowstocks"
                      ? "#1687A7"
                      : "",
                  borderBottom:
                    activeLink === "/dashboard/inventory/lowstocks"
                      ? "2px solid #1687A7"
                      : "",
                }}
              >
                Low Stock ({BarData && BarData?.num_low_stock})
              </NavLink>
            </li>

            <li className="pr-6">
              <NavLink
                to={"exchange"}
                isActive={() => activeLink === "/dashboard/inventory/exchange"}
                style={{
                  padding: "0 0 3px 0",
                  color:
                    activeLink === "/dashboard/inventory/exchange"
                      ? "#1687A7"
                      : "",
                  borderBottom:
                    activeLink === "/dashboard/inventory/exchange"
                      ? "2px solid #1687A7"
                      : "",
                }}
              >
                Out Of Stock ({BarData && BarData?.num_out_of_stock})
              </NavLink>
            </li>

            {/* <li className="pr-6">
              <p
              
                isActive={() => activeLink === "/dashboard/inventory/archive"}
                style={{
                  padding: "0 0 3px 0",
                  color:
                    activeLink === "/dashboard/inventory/archive"
                      ? "#1687A7"
                      : "",
                  borderBottom:
                    activeLink === "/dashboard/inventory/archive"
                      ? "2px solid #1687A7"
                      : "",
                }}
              >
                Archice (no)
              </p>
            </li> */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Bar;
