import { lazy, Suspense } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box } from "@mui/system";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../utils/BaseApi";
const Loader = lazy(() => import("../utils/Loader.jsx"));
import LazyLoadImage from "./LazyLoadImage.jsx";
import DashContent from "../Dashboard/DashContent.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDateTime } from "../utils/dateTime.js";
import toast from "react-hot-toast";
import { Checkbox } from "@mui/material";
import { GoArrowRight } from "react-icons/go";
import { getSessionId } from "../utils/get_session_id.js";
import OrderSkeleton from "../SkeletonLoader/OrderSkeleton.jsx";

const Neworder = () => {
  const { activeLinkParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(activeLinkParam);
  const sessionId = getSessionId();
  const [ordreDetailIds, setOrderDetailIds] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  const handleChange = (event, index) => {
    const { value, checked } = event.target;
    const list = [...ordreDetailIds];
    if (checked) {
      list[index] = parseInt(value);
    } else {
      list[index] = null;
    }
    const filteredList = list.filter((item) => item !== null);
    setOrderDetailIds(filteredList);
  };


  useEffect(() => {
    setActiveLink(activeLinkParam);
  }, [activeLinkParam]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const send_newOrder = (data) =>
    apiRequest({
      url: "/orders/get_all_order_list",
      method: "post",
      data: data,
    });

  const { mutate: get_all_order, isLoading } = useMutation(send_newOrder, {
    onSuccess: (data) => {
      // Use Set to track existing product_ids
      const existingProductIds = new Set(
        newOrderData.map((item) => item.order_id)
      );

      // Filter out items with duplicate product_ids
      const newData = data?.data.data.filter(
        (item) => !existingProductIds.has(item.order_id)
      );

      setNewOrderData((prevData) => {
        // Use Set to ensure uniqueness in the merged data
        const newDataIds = new Set(newData.map((item) => item.order_id));

        // Filter out items with duplicate product_ids from prevData
        const filteredPrevData = prevData.filter(
          (item) => !newDataIds.has(item.order_id)
        );

        return [...filteredPrevData, ...newData];
      });

      if (newData.length === 0) {
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
  });

  const [newOrderData, setNewOrderData] = useState(
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
    if (!sessionId) {
      navigate("/login");
    } else {
      setPageNumber((prev) => prev + 1);
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("page", pageNumber);
      formData.append("payment_type", "All");
      formData.append("recent_orders_first", 1);
      formData.append("order_delivery_type", "All");
      formData.append("only_new_orders", 1);
      get_all_order(formData);
      return () => {};
    }
  }, []);

  const fetchData = () => {
    setPageNumber((prev) => prev + 1);
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("page", pageNumber);
    formData.append("payment_type", "All");
    formData.append("recent_orders_first", 1);
    formData.append("order_delivery_type", "All");
    formData.append("only_new_orders", 1);
    get_all_order(formData);
  };

  const confirm_order = (data) =>
    apiRequest({
      url: "/orders/confirm_order_product_status",
      method: "post",
      data: data,
    });

  const { mutate: confirmOrderStatus, isStatusLoading } = useMutation(
    confirm_order,
    {
      onSuccess: (data) => {
        if (data.data.success) {
          // fetchData();
          toast.success(data.data.message);
          window.location.reload();
        } else {
          toast.error(data.data.message);
        }
        queryClient.invalidateQueries("low_stocks_data");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  const confirmOrder = (data, isAccepted) => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("order_product_detail_id", data?.order_product_detail_id);
    formData.append("seller_status", isAccepted);
    confirmOrderStatus(formData);
  };

  const send_order_bill = (data) =>
    apiRequest({ url: "orders/get_bills", method: "post", data });

  const { mutate: get_bills, isLoading: loads } = useMutation(send_order_bill, {
    onSuccess: (data) => {
      if (data.data.success) {
        toast.success(data.data.message);
      } else {
        toast.error(data.data.message);
      }
      queryClient.invalidateQueries("order_delivered");
    },
    onError: (err) => {
      toast.error(err.data.message);
    },
    retry: {
      maxAttempts: 3,
      delay: (attempt) => {
        return attempt * 1000;
      },
    },
  });

  const getBill = (order_id) => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("order_id", order_id);
    get_bills(formData);
  };

  const create_shipment = (data) =>
    apiRequest({
      url: "orders/create_selected_products_shipment",
      method: "post",
      data,
    });

  const { mutate: createShipment, isLoading: shipmentLoading } = useMutation(
    create_shipment,
    {
      onSuccess: (data) => {
        if (data.data.success) {
          toast.success(data.data.message);
        } else {
          toast.error(data.data.message);
        }
        queryClient.invalidateQueries("order_delivered");
      },
      onError: (err) => {
        toast.error(err.data.message);
      },
      retry: {
        maxAttempts: 3,
        delay: (attempt) => {
          return attempt * 1000;
        },
      },
    }
  );

  const createShipmentOfSelectedProduct = (
    order_id,
    order_product_detail_ids
  ) => {
    var results = order_product_detail_ids.filter((element) => {
      return element !== undefined;
    });

    console.log(results);
    // results = results[0];

    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("order_id", order_id);
    results = results[0];
    for (var i = 0; i < results.length; i++) {
      formData.append(`order_product_detail_ids[${i}]`, results[i]);
    }
     createShipment(formData);
  };

  const mark_ready_for_ship = (data) =>
    apiRequest({ url: "orders/mark_ready_for_ship", method: "post", data });

  const { mutate: markReadyForShip, isLoading: readyForShipLoading } =
    useMutation(mark_ready_for_ship, {
      onSuccess: (data) => {
        if (data.data.success) {
          toast.success(data.data.message);
        } else {
          toast.error(data.data.message);
        }
        queryClient.invalidateQueries("order_delivered");
      },
      onError: (err) => {
        toast.error(err);
      },
      retry: {
        maxAttempts: 3,
        delay: (attempt) => {
          return attempt * 1000;
        },
      },
    });

  const markReadyForShipment = (order_id) => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("order_id", order_id);
    markReadyForShip(formData);
  };

  if (shipmentLoading || loads || readyForShipLoading || isStatusLoading) {
    return (
      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
        <Loader />
      </div>
    );
  }

  if ((!newOrderData || newOrderData.length == 0) && !isLoading) {
    return (
      <>
        {activeLink == "/dashboard/neworders" ? <DashContent /> : ""}
        <h2 className="h-[450px] text-xl text-center custom400:text-2xl sm:text-3xl text-gray-700 grid place-items-center w-full px-3">
          No new order received yet!
        </h2>
      </>
    );
  }

  return (
    <>
      {activeLink == "/dashboard/neworders" ? <DashContent /> : ""}
      <div className=" bg-white sm:shadow-[0_3px_10px_rgb(0,0,0,0.2)] sm:mx-2 rounded-lg py-2 ">
        <div className="hidden  sm:flex text-2xl font-semibold lg:text-3xl m-6 ">
          <h1> New Orders &nbsp;</h1>
          {newOrderData && (
            <div className="h-[40px] w-[50px] bg-[#FFF7F0] mx-2 rounded-lg grid place-items-center">
              <span className="text-[#F07614] text-[1.5rem]">
                {newOrderData?.length < 10 && newOrderData?.length > 0
                  ? `0${newOrderData?.length}`
                  : newOrderData?.length}
              </span>
            </div>
          )}
        </div>
        <div className="overflow-y-scroll h-[500px] my-8" id="target_this">
          <InfiniteScroll
            dataLength={newOrderData?.length || 0}
            next={fetchData}
            hasMore={hasMore}
            loader={
              <div className="flex items-center justify-center my-10 w-full h-[100px]">
                <Loader />{" "}
              </div>
            }
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all </b>
              </p>
            }
            scrollableTarget="target_this"
          >
            {isLoading ? (
              <OrderSkeleton data={[1]} data2={[1, 2, 3, 4, 5]} />
            ) : (
              <div>
                {newOrderData?.map((val, ind) => {
                  return (
                    <div
                      className=" my-6 px-2 custom400:px-4"
                      key={val?.order_id}
                    >
                      <div className=" flex justify-between ">
                        <p className="flex">
                          <b> {ind + 1} .</b>
                          &nbsp; &nbsp;
                          <div className="text-[#5a5a0a] sm:text-[#1687a7]">
                            {val.order_id && (
                              <h4 className="sm:text-lg">
                                Order ID: {val.order_id}
                              </h4>
                            )}
                            {val.order_time && (
                              <span className="hidden sm:block">
                                Order Date:{" "}
                                {formatDateTime(
                                  val.order_time
                                ).toLocaleDateString()}{" "}
                                {formatDateTime(
                                  val.order_time
                                ).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </p>

                        <div className="hidden sm:block   ">
                          {val.location && (
                            <span className="flex items-center justify-end text-[#1687a7]">
                              <LocationOnOutlinedIcon />
                              <Box sx={{ paddingTop: "5px" }}>
                                {" "}
                                {val.location}{" "}
                              </Box>
                            </span>
                          )}
                          {val?.order_delivery_type && (
                            <p className="text-green-500">
                              Order Type:{" "}
                              {val?.order_delivery_type == 1
                                ? "Store Pickup"
                                : "Delivery"}
                            </p>
                          )}
                        </div>
                      </div>
                      <br />
                      {val.order_seller_status === "2" ? (
                        <>
                          {val?.product_details
                            ?.filter(
                              (item) =>
                                item.seller_status === "1" &&
                                (item.order_product_status === "1" ||
                                  item.order_product_status === "2")
                            )
                            .map((value, ind) => {
                              return (
                                <>
                                  <div
                                    key={ind}
                                    className="flex items-center justify-between flex-row my-4"
                                  >
                                    <div className="flex sm:w-[60%]">
                                      <LazyLoadImage
                                        src={value.main_image}
                                        alt={value.main_image}
                                        className="max-w-[5rem] w-full "
                                      />

                                      <div className="ml-2">
                                        {value.product_title && (
                                          <h4 className=" text-wrap w-full my-2">
                                            {value.product_title}
                                          </h4>
                                        )}
                                        {value.total_price_with_tax && (
                                          <h4 className="font-bold text-2xl">
                                            &#x20B9;{" "}
                                            {value.total_price_with_tax}
                                          </h4>
                                        )}
                                      </div>
                                    </div>
                                    <div className="hidden sm:block font-semibold text-lg capitalize ">
                                      <p>
                                        {value?.colour}, {value?.size}
                                      </p>
                                    </div>
                                    <div className="text-[#73B7CA] flex space-x-4 justify-between items-center my-4 text-sm sm:justify-center ">
                                      <Checkbox
                                        name="order_product_detail_id"
                                        value={value.order_product_detail_id}
                                        onChange={(e) => {
                                          handleChange(e, ind);
                                        }}
                                        inputProps={{
                                          "aria-label": "controlled",
                                        }}
                                        sx={{
                                          color: "#1687a7",
                                          "&.Mui-checked": {
                                            color: "#1687a7",
                                          },
                                          "& .MuiSvgIcon-root": {
                                            fontSize: 28,
                                          },
                                        }}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            })}

                          <div className="mb-8 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4  justify-center sm:justify-end  w-full">
                            <button
                              className="btn1 p-3 px-10 w-full md:w-fit"
                              type="button"
                              onClick={() =>
                                createShipmentOfSelectedProduct(val?.order_id, [
                                  ordreDetailIds,
                                ])
                              }
                            >
                              Create shipment
                            </button>
                            <button
                              type="button"
                              className="bg-[#A2CFDC] w-full md:w-fit flex items-center justify-center p-3 px-8 rounded-lg text-[#1687a7]"
                              onClick={() =>
                                markReadyForShipment(val?.order_id)
                              }
                            >
                              Ready for Ship
                              <GoArrowRight className="ml-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {val?.product_details
                            ?.filter((item) => item.seller_status !== "2")
                            ?.map((value) => {
                              return (
                                <>
                                  <div
                                    key={value?.order_id}
                                    className="flex sm:items-center sm:justify-between flex-col sm:flex-row "
                                  >
                                    <div className="flex sm:w-[60%]">
                                      <LazyLoadImage
                                        src={value.main_image}
                                        alt={value.main_image}
                                        className="w-[80px] h-[100px] object-contain aspect-[3/2] "
                                      />

                                      <div className="ml-2">
                                        {value.product_title && (
                                          <h4 className="text-wrap w-full my-2 text-sm c500:text-[1rem]">
                                            {value.product_title}
                                          </h4>
                                        )}
                                        {value.total_price_with_tax && (
                                          <h4 className="font-semibold text-2xl">
                                            &#x20B9;{" "}
                                            {value.total_price_with_tax}{" "}
                                          </h4>
                                        )}
                                      </div>
                                    </div>

                                    <div className="hidden sm:block font-semibold text-lg capitalize ">
                                      <p>
                                        {value?.colour && (
                                          <span>{value.colour}, </span>
                                        )}
                                        {value?.size && (
                                          <span>{value.size}</span>
                                        )}
                                      </p>
                                    </div>

                                    <div className="hidden sm:block font-semibold text-lg">
                                      {val?.total_product_quantity && (
                                        <p>{val?.total_product_quantity} </p>
                                      )}
                                    </div>
                                    <div className="text-[#73B7CA] flex space-x-4 justify-between my-4 text-sm sm:hidden ">
                                      {value.colour && (
                                        <div>
                                          Color :
                                          <b className="text-[#1687a7] capitalize ">
                                            {value.colour}
                                          </b>
                                        </div>
                                      )}
                                      {value.size && (
                                        <div>
                                          Size:{" "}
                                          <b className="text-[#1687a7] uppercase">
                                            {value.size}
                                          </b>
                                        </div>
                                      )}
                                      {val.total_product_quantity && (
                                        <div>
                                          Qty. :
                                          <b className="text-[#1687a7] ">
                                            {val.total_product_quantity}
                                          </b>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex custom300:space-x-2 sm:space-x-4 justify-between custom450:justify-start  my-3 custom300:flex-row flex-col space-y-4 custom300:space-y-0 ">
                                    {value.seller_status === "1" ? (
                                      <button
                                        className="py-2 px-6 rounded-lg  bg-gray-400 text-white border-[#1587a7]  "
                                        disabled
                                        type="button"
                                      >
                                        Available
                                      </button>
                                    ) : (
                                      <button
                                        className="py-[12px] px-7 custom400:px-10 rounded-xl text-white bg-green-500 border hover:bg-transparent hover:text-green-500 hover:border-green-500 duration-500"
                                        onClick={() => confirmOrder(value, "1")}
                                        type="button"
                                      >
                                        Available
                                      </button>
                                    )}
                                    <button
                                      className="py-[12px] px-6 custom400:px-10 rounded-xl text-white bg-red-500 border hover:bg-transparent hover:text-red-500 hover:border-red-500 duration-500"
                                      onClick={() => confirmOrder(value, "2")}
                                      type="button"
                                    >
                                      Not Available
                                    </button>

                                    {/* <button className="btn1">
                                       {value.seller_status}
                                     </button> */}
                                  </div>
                                </>
                              );
                            })}
                        </>
                      )}

                      <div className="my-2 sm:hidden">
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
                              {val.location && (
                                <span>Order Location : {val.location}</span>
                              )}
                              <br />
                              {val?.order_delivery_type && (
                                <span>
                                  Order Type:{" "}
                                  {val?.order_delivery_type == 1
                                    ? "Store Pickup"
                                    : "Delivery"}
                                </span>
                              )}

                              {/* Payment Status : {val.payment_type} */}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      </div>

                      <div className="h-[1px] bg-gray-300 "></div>
                    </div>
                  );
                })}
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
      <br />
    </>
  );
};

export default Neworder;
