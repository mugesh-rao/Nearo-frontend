import { lazy, Suspense } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box } from "@mui/system";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../utils/BaseApi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashContent from "../Dashboard/DashContent.jsx";
const Loader = lazy(() => import("../utils/Loader.jsx"));
import { getSessionId } from "../utils/get_session_id.js";
import { formatDateTime } from "../utils/dateTime";
import OrderSkeleton from "../SkeletonLoader/OrderSkeleton.jsx";
const Cancelled = () => {
  const { activeLinkParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(activeLinkParam);

  useEffect(() => {
    setActiveLink(activeLinkParam);
  }, [activeLinkParam]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const send_cancelled_order = (data) =>
    apiRequest({
      url: "/orders/get_cancelled_order_list",
      method: "post",
      data: data,
    });
  const queryClient = useQueryClient();

  const { mutate: get_cancelled_order, isLoading } = useMutation(
    send_cancelled_order,
    {
      onSuccess: (data) => {
        console.log(data?.data.data);

        // Use Set to track existing product_ids
        const existingProductIds = new Set(
          cancelledData.map((item) => item.product_id)
        );

        // Filter out items with duplicate product_ids
        const newData = data?.data.data.filter(
          (item) => !existingProductIds.has(item.product_id)
        );

        setCancelledData((prevData) => {
          // Use Set to ensure uniqueness in the merged data
          const newDataIds = new Set(newData.map((item) => item.product_id));

          // Filter out items with duplicate product_ids from prevData
          const filteredPrevData = prevData.filter(
            (item) => !newDataIds.has(item.product_id)
          );

          return [...filteredPrevData, ...newData];
        });

        if (cancelledData?.length === 0) {
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

  const [cancelledData, setCancelledData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return [];
    }, [queryClient])
  );
  //we are psoting our session id for api requesting

  useEffect(() => {
    if (!getSessionId()) {
      navigate("/login");
    } else {
    const formData = new FormData();
    formData.append("session_id", getSessionId());
    formData.append("page", pageNumber);
    get_cancelled_order(formData);
    }
  }, []);

  const fetchData = () => {
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);
    const formData = new FormData();
    formData.append("session_id", getSessionId());
    formData.append("page", pageNumber);
    get_cancelled_order(formData);
  };


  if ((!cancelledData||cancelledData.length==0)&&!isLoading) {
    return (
      <>
        {activeLink == "/dashboard/cancelled" ? <DashContent /> : ""}
        <h2  className="h-[450px] text-xl text-center custom400:text-2xl sm:text-3xl text-gray-700 grid place-items-center w-full px-3">
        No order cancelled
        </h2>
      </>
    );
  }

  return (
    <>
      {activeLink == "/dashboard/cancelled" ? <DashContent /> : ""}
      <div className="bg-white sm:shadow-[0_3px_10px_rgb(0,0,0,0.2)] sm:mx-2 rounded-lg py-2">
      <div className="hidden  sm:flex text-2xl font-semibold lg:text-3xl m-6 ">
          <h1> Cancelled &nbsp;</h1>
          {cancelledData && (
            <div className="h-[40px] w-[50px] bg-violet-100 mx-2 rounded-lg grid place-items-center">
              <span className="  text-violet-600 text-[1.5rem]  ">
                {cancelledData?.length < 10 && cancelledData?.length > 0
                  ? `0${cancelledData?.length}`
                  : cancelledData?.length}
              </span>
            </div>
          )}
        </div>

        {/* order list div=========== */}
        <div className="  overflow-y-scroll h-[500px] my-8" id="target_this">
          <InfiniteScroll
            dataLength={cancelledData?.length || 0} //This is important field to render the next data
            next={fetchData}
            hasMore={hasMore}
            loader={
              <div className="flex items-center justify-center">
                <Loader /> <p className="text-xl text-red-400">inventory</p>{" "}
              </div>
            }
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
            scrollableTarget="target_this"
          >
           {
            isLoading?<OrderSkeleton data={[1]} data2={[1, 2, 3, 4, 5]} />:<div> {cancelledData &&
              cancelledData?.map((val, ind) => {
                return (
                  <>
                    <div className=" my-6 px-2 custom400:px-4 ">
                      <div
                        className=" flex justify-between "
                        key={val.order_id}
                      >
                        <p className="flex">
                          <b> {ind + 1}.</b>
                          &nbsp; &nbsp;
                          <div className="text-[#5a5a0a] sm:text-[#1687a7] ">
                            {val.order_id && (
                              <h4 className="sm:text-lg">
                                Order ID: {val.order_id}
                              </h4>
                            )}
                            {val.order_time && (
                              <span className="hidden sm:block">
                                Order Date: {formatDateTime(
                                  val.order_time
                                ).toLocaleDateString()}{" "}
                                {formatDateTime(
                                  val.order_time
                                ).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </p>

                        <div className="hidden sm:flex flex-col items-end">
                        {val.order_shipment_slip_id && (
                          <p className="text-[#1687a7]">
                            Shipment Id: {val?.order_shipment_slip_id}
                          </p>
                        )}
                          {val?.order_delivery_type && (
                            <p className="text-green-500">
                              Order Type: {val?.order_delivery_type==1?"Store Pickup":"Delivery"}
                            </p>
                          )}
                        </div>
                      </div>
                      <br />
                      {val.product_details?.map((val2) => {
                        return (
                          <>
                            <div
                              key={val2.order_product_detail_id}
                              className="flex sm:items-center sm:justify-between flex-col sm:flex-row my-4 "
                            >
                              <div className="flex sm:w-[60%]">
                                <img
                                  src={val2.main_image}
                                  alt="ds"
                                  className="max-w-[5rem] w-full "
                                />

                                <div className="ml-2">
                                  {val2.product_title && (
                                    <h4 className=" text-wrap w-full my-2">
                                      {val2.product_title}
                                    </h4>
                                  )}
                                  {val2.total_price_with_tax && (
                                    <h4 className="font-semibold text-2xl">
                                      &#x20B9; {val2.total_price_with_tax}
                                    </h4>
                                  )}
                                </div>
                              </div>

                              <div className="hidden sm:block font-semibold text-lg capitalize ">
                                <p>
                                  {val2.colour && <span>{val2.colour},</span>}
                                  {val2.size && <span>{val2.size}</span>}
                                </p>
                              </div>

                              <div className="hidden sm:block font-semibold text-lg sm:mr-10">
                                {val?.total_product_quantity && (
                                  <p>{val?.total_product_quantity} </p>
                                )}
                              </div>
                              <div className="text-[#73B7CA] flex space-x-4 justify-between my-4 text-sm sm:hidden ">
                                {val.colour && (
                                  <div>
                                    Colour :
                                    <b className="text-[#1687a7] capitalize ">
                                      {val.colour}
                                    </b>
                                  </div>
                                )}
                                {val.size && (
                                  <div>
                                    Size:
                                    <b className="text-[#1687a7] uppercase">
                                      {val.size}
                                    </b>
                                  </div>
                                )}
                                {val.total_product_quantity && (
                                  <div>
                                    Qty.:
                                    <b className="text-[#1687a7] ">
                                      {val.total_product_quantity}
                                    </b>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })}

                      <div className="my-4 sm:hidden">
                        <Accordion
                          sx={{ background: " #D0E7ED", borderRadius: "20px" }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography sx={{ color: "#1687a7" }}>
                              Order Details
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography
                              className=" text-[#5a5a0a] "
                              style={{ fontSize: "14px" }}
                            >
                               {val.order_time && (
                                <span>
                                Order Date :{" "}
                                {formatDateTime(
                                  val.order_time
                                ).toLocaleDateString()}
                              </span>
                              )}
                              <br />
                              {val.order_shipment_slip_id && (
                            <p className="text-[#1687a7]">
                              Shipment Id: {val?.order_shipment_slip_id}
                            </p>
                          )}
                              <br />
                              {val.payment_type && (
                                <span>Order Type: {val?.order_delivery_type==1?"Store Pickup":"Delivery"}</span>
                              )}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                      <hr />
                      <br />
                    </div>
                  </>
                );
              })}</div>
           }
          </InfiniteScroll>
        </div>
      </div>
      <br />
    </>
  );
};

export default Cancelled;
