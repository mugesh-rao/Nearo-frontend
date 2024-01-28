import { lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSessionId } from "../utils/get_session_id";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
const Loader = lazy(() => import("../utils/Loader"));
import Pagination from "@mui/material/Pagination";
import { useOutletContext } from "react-router-dom";
import DashContent from "../Dashboard/DashContent";

const blue = {
  marginRight: " 30px",
  padding: "7px 20px",
  borderRadius: "10px",
  border: "none",
  background: " #E8F5E9",
  color: "#0ab855",
};

const red = {
  padding: "7px 20px",
  borderRadius: "10px",
  border: "none",
  background: " #EF4D4D26",
  color: "red",
  marginRight: "18px",
};

const TotalRevenue = () => {
  const [timeFrame] = useOutletContext();
  const { activeLinkParam } = useParams();
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const [activeLink, setActiveLink] = useState(activeLinkParam);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  useEffect(() => {
    setActiveLink(activeLinkParam);
  }, [activeLinkParam]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);
  //ready for ship product api
  const revenue_details_api = (data) =>
    apiRequest({
      url: "/revenue/revenue_details",
      method: "post",
      data: data,
    });

  const queryClient = useQueryClient();

  const { mutate: get_revenue_details, isLoading } = useMutation(
    revenue_details_api,
    {
      onSuccess: (data) => {
        console.log(data?.data.data);

        setLowData(data?.data.data);

        if (lowData?.length === 0) {
          setHasMore(false);
        }

        queryClient.invalidateQueries("low_stocks_data");
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
    }
  );

  const [lowData, setLowData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return [];
    }, [queryClient])
  );

  //we are psoting our session id for api requesting

  // post session_id
  // post page
  // Post timeframe (‘this_week’, ‘this_month’, ‘this_year’)
  // post filters (‘All’, ‘pending’ (i.e., payment slip not generated, in return period), ‘payble’)

  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("page", pageNumber);
      formData.append("timeframe", timeFrame);
      formData.append("filters", "All");

      get_revenue_details(formData);
    }
  }, [sessionId, timeFrame]);

  const fetchData = (e, val) => {
    setPageNumber(val - 1);
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("page", val - 1);
    formData.append("timeframe", timeFrame);
    formData.append("filters", "All");
    get_revenue_details(formData);
  };

  if (isLoading && pageNumber === 0) {
    return (
      <div className="h-screen grid place-items-center absolute bg-white z-20 top-0 right-0 bottom-0 left-0">
        <Suspense fallback={<div>Loading...</div>}>
          <Loader />
        </Suspense>
      </div>
    );
  }
  if (lowData.length == 0 || !lowData) {
    return (
      <>
        {activeLink == "/dashboard/revenue/payble_amount" ? (
          <DashContent />
        ) : (
          ""
        )}
        <h2 className="h-[450px] text-xl text-center custom400:text-2xl sm:text-3xl text-gray-700 grid place-items-center w-full px-3">
        No total revenue
      </h2>
      </>
    );
  }

  return (
    <>
      <div className="p-2 custom400:mx-2 ">
        <h1 className="text-2xl sm:text-3xl font-semibold text-black my-6">
          Total Revenue
        </h1>
        <div className="flex justify-between my-3 w-[90%] mx-auto text-[#1687a7] ">
          <p>Products</p>
          <div className="hidden md:flex justify-between items-center w-[42%] space-x-3">
            <p>Commission</p>
            <p>Payble Amt.</p>
            <p>Status</p>
          </div>
        </div>

        {lowData && 
          <div className=" overflow-y-scroll  border-y border-gray-400 w-full">
            {lowData?.map((val, ind) => {
              return (
                <>
                  <div
                    className={`flex items-center custom400:p-2 py-3 justify-between  ${
                      ind + 1 == lowData?.length
                        ? ""
                        : "md:border-b border-gray-300"
                    } `}
                  >
                    <div className="flex items-center w-full md:w-[55%]   ">
                      <p style={{ color: "rgba(0, 0, 0, 0.621)" }}>
                        {ind + 1 < 10 ? `0${ind + 1}` : ind + 1}.
                      </p>
                      <img
                        src={val?.main_image}
                        alt="product-imgs"
                        className="h-[95px] w-[80px] object-contain rounded-sm mx-1 border "
                      />
                      <div className="custom400:mx-2 w-full">
                        <p className="text-wrap text-[14px] sm:text-[16px]">
                          {val?.product_title}
                        </p>
                        <p className="text-gray-700">
                          Size:
                          <span className="text-black font-semibold">
                            {val?.size}
                          </span>
                        </p>
                        <h2 className="text-lg sm:text-xl font-semibold flex space-x-5 ">
                          <p> &#x20B9; {val?.price_with_tax}</p>
                          &nbsp; &nbsp;
                          <p className="block md:hidden ">
                           
                              {val?.order_product_status === "1" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light mr-5">
                                  New
                                </button>
                              ) : val?.order_product_status === "2" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Order in process{" "}
                                </button>
                              ) : val?.order_product_status === "3" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Ready for ship{" "}
                                </button>
                              ) : val?.order_product_status === "4" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  On the way{" "}
                                </button>
                              ) : val?.order_product_status === "5" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Return Period{" "}
                                </button>
                              ) : val?.order_product_status === "6" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light mr-5">
                                  Paid
                                </button>
                              ) : val?.order_product_status === "7" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Returned
                                </button>
                              ) : val?.order_product_status === "8" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Returned
                                </button>
                              ) : val?.order_product_status === "9" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Returned
                                </button>
                              ) : val?.order_product_status === "10" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Returned
                                </button>
                              ) : val?.order_product_status === "11" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Cancelled by seller
                                </button>
                              ) : val?.order_product_status === "12" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Cancelled by customer
                                </button>
                              ) : val?.order_product_status === "16" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Canceled by system
                                </button>
                              ) : val?.order_product_status === "14" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Order not accepted by customer
                                </button>
                              ) : val?.order_product_status === "15" ? (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Order not accepted by customer & delivered to
                                  seller
                                </button>
                              ) : (
                                <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                                  Cancelled{" "}
                                </button>
                              )}
                           
                          </p>
                        </h2>
                      </div>
                    </div>

                    <div className="hidden md:flex w-[38%] text-center justify-between items-center font-semibold sm:text-xl space-x-3 ">
                      <h4>&#x20B9; {val?.tax}</h4>
                      <h4>{val?.payble_amount_to_seller} </h4>
                      <div className="mx-auto block">
                        {val?.order_product_status === "1" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light mr-5">
                            New
                          </button>
                        ) : val?.order_product_status === "2" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Order in process{" "}
                          </button>
                        ) : val?.order_product_status === "3" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Ready for ship{" "}
                          </button>
                        ) : val?.order_product_status === "4" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            On the way{" "}
                          </button>
                        ) : val?.order_product_status === "5" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Return Period{" "}
                          </button>
                        ) : val?.order_product_status === "6" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light mr-5">
                            Paid
                          </button>
                        ) : val?.order_product_status === "7" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Returned
                          </button>
                        ) : val?.order_product_status === "8" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Returned
                          </button>
                        ) : val?.order_product_status === "9" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Returned
                          </button>
                        ) : val?.order_product_status === "10" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Returned
                          </button>
                        ) : val?.order_product_status === "11" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Cancelled by seller
                          </button>
                        ) : val?.order_product_status === "12" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Cancelled by customer
                          </button>
                        ) : val?.order_product_status === "16" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Canceled by system
                          </button>
                        ) : val?.order_product_status === "14" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Order not accepted by customer
                          </button>
                        ) : val?.order_product_status === "15" ? (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Order not accepted by customer & delivered to seller
                          </button>
                        ) : (
                          <button className=" text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                            Cancelled{" "}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex md:hidden ${
                      ind + 1 == lowData?.length
                        ? ""
                        : "md:border-b border-gray-300"
                    } justify-between my-2 mx-2 custom400:mx-6 text-[#1687a7] text-sm`}
                  >
                    <p>
                      Commissions :{" "}
                      <span className="text-black font-semibold text-lg">
                        &#x20B9; {val?.tax}
                      </span>{" "}
                    </p>
                    <p>
                      {" "}
                      Payble Amt. :{" "}
                      <span className="text-black font-semibold text-lg">
                        &#x20B9; {val?.payble_amount_to_seller}
                      </span>{" "}
                    </p>
                  </div>
                </>
              );
            })}
          </div>
     }
      </div>
      <div className=" w-full flex my-4 justify-center">
        <Pagination
          count={lowData?.length}
          variant="outlined"
          shape="rounded"
          onChange={fetchData}
          siblingCount={0}
          boundaryCount={2}
          size="large"
          color="primary"
        />
      </div>
    </>
  );
};

export default TotalRevenue;
