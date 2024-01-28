import { useState, useEffect, useMemo, lazy, Suspense } from "react";

import { CiSearch, CiFilter } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const Loader = lazy(() => import("../utils/Loader"));
import { AiOutlineDownload } from "react-icons/ai";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../utils/BaseApi";
import { getSessionId } from "../utils/get_session_id";
import LazyLoadImage from "./LazyLoadImage.jsx";
import { formatDateTime } from "../utils/dateTime";
import OrderSkeleton from "../SkeletonLoader/OrderSkeleton.jsx";
import { RxCross2 } from "react-icons/rx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Bill from "./Bill.jsx";
const Order = () => {
  const blue = {
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
    // marginRight: "18px",
  };

  const { activeLinkParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(activeLinkParam);
  const sessionId = getSessionId();

  useEffect(() => {
    setActiveLink(activeLinkParam);
  }, [activeLinkParam]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);

  //ready for ship product api
  const send_order_readyforShip = (data) =>
    apiRequest({
      url: "/orders/get_all_order_list",
      method: "post",
      data: data,
    });

  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({
    payment_type: "All",
    delivery_type: "All",
  });
  const { mutate: get_readyfor_ship, isLoading } = useMutation(
    send_order_readyforShip,
    {
      onSuccess: (data) => {
        // Use Set to track existing product_ids

        if (filter.payment_type == "All") {
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
        } else {
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

  const [newOrderData, setNewOrderData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return [];
    }, [queryClient])
  );

  const [submitFilter, setSubmitFilter] = useState({
    payment_type: "All",
    delivery_type: "All",
  });

  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      setPageNumber((prev) => prev + 1);
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("page", pageNumber);
      formData.append("payment_type", submitFilter.payment_type);
      formData.append("order_delivery_type", submitFilter.delivery_type);
      formData.append("recent_orders_first", 1);
      formData.append("only_new_orders", 0);

      get_readyfor_ship(formData);
      return () => {};
    }
  }, [submitFilter]);

  const fetchData = () => {
    setPageNumber((prev) => prev + 1);
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("page", pageNumber);
    formData.append("payment_type", submitFilter.payment_type);
    formData.append("recent_orders_first", 1);
    formData.append("only_new_orders", 0);
    get_readyfor_ship(formData);
  };
  const send_order_bill = (data) =>
    apiRequest({ url: "orders/get_bills", method: "post", data });

  const { mutate: get_bills, isLoading: loads } = useMutation(send_order_bill, {
    onSuccess: (data) => {
      if (data?.data?.success) {
        setBillData(data?.data?.order_shipment_slip_ids);
      }
      queryClient.invalidateQueries("order_delivered");
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
  const [billData, setBillData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );
  const getBills = (orderId) => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("order_id", orderId);
    get_bills(formData);
  };
  //filters
  const [alignMent, setAlignMent] = useState(false);

  const download_bill_data = (data) =>
    apiRequest({ url: "orders/download_bill", method: "post", data });

  const [downloadBillData, setDownloadBillData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  if (isLoading && pageNumber === 0) {
    return (
      <div className="h-screen grid place-items-center absolute bg-white z-20 top-0 right-0 bottom-0 left-0">
        <Loader />
      </div>
    );
  }

  if (
    (!newOrderData || newOrderData.length == 0) &&
    !isLoading &&
    submitFilter.delivery_type == "All" &&
    submitFilter.payment_type == "All"
  ) {
    return (
      <p className="h-[450px] text-xl text-center custom400:text-2xl sm:text-3xl text-gray-700 grid place-items-center w-full px-3">
        Ready for Orders
      </p>
    );
  }

  return (
    <>
      <div className=" bg-white sm:shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] mt-2 sm:mx-2 rounded-lg py-2 ">
        <div className="hidden  sm:flex text-2xl font-semibold lg:text-3xl m-6 ">
          <h1> All Orders &nbsp;</h1>
          {newOrderData && (
            <div className="h-[40px] w-[50px] bg-[#FAE4F6] mx-2 rounded-lg grid place-items-center">
              <span className="text-[#F03BD3] text-[1.5rem]">
                {newOrderData?.length < 10 && newOrderData?.length > 0
                  ? `0${newOrderData?.length}`
                  : newOrderData?.length}
              </span>
            </div>
          )}
        </div>

        <div className="flex mx-1 custom400:mx-5 space-x-1  custom400:space-x-5">
          <div className="flex items-center w-full bg-[#5a5a5a0a] rounded-lg ">
            <CiSearch className="text-2xl text-[#1687a7] mx-2 " />
            <input
              type="search"
              name="search"
              placeholder="Search Your Products"
              autoComplete="off"
              className=" w-full rounded-lg py-1 bg-transparent outline-none"
            />
          </div>

          <button
            className="flex items-center p-2 px-6 btn2 bg-cyan-50"
            onClick={() => setAlignMent(true)}
          >
            <CiFilter className="text-xl" /> <p>filters</p>
          </button>

          {alignMent && (
            <div className="max-w-[20rem] right-0 sm:max-w-[24rem] w-full bg-white p-4 absolute sm:right-10 mt-5 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-50 ">
              <div className="flex justify-between items-center ">
                <h2 className="text-xl font-semibold">Order Type</h2>
                <RxCross2
                  className="text-2xl hover:text-red-500 hover:text-3xl duration-500 cursor-pointer "
                  onClick={() => setAlignMent(false)}
                />
              </div>

              <div className="flex flex-wrap gap-2 my-4">
                {[1, 2].map((val) => {
                  return (
                    <label
                      className={`cursor-pointer ${
                        filter.delivery_type == val ? "btn1" : "btn2"
                      }`}
                      key={val}
                    >
                      <input
                        type="checkbox"
                        value={val}
                        onChange={() => {
                          if (val === 1) {
                            setFilter({
                              ...filter,
                              delivery_type:
                                filter.delivery_type === 1 ? "All" : 1,
                            });
                          } else if (val == 2) {
                            setFilter({
                              ...filter,
                              delivery_type:
                                filter.delivery_type === 2 ? "All" : 2,
                            });
                          }
                        }}
                        className="hidden"
                      />
                      {val === 1 ? (
                        <span>Store Pickup</span>
                      ) : val === 2 ? (
                        <span>Delivery</span>
                      ) : (
                        ""
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="my-7">
                <div className="h2 text-xl font-semibold">Payment Status</div>
                <div className="flex flex-wrap gap-2 my-4">
                  {["COD", "ONLINE PAYMENT"].map((val) => {
                    return (
                      <label
                        className={`cursor-pointer ${
                          filter.payment_type == val ? "btn1" : "btn2"
                        }`}
                        key={val}
                      >
                        <input
                          type="checkbox"
                          value={val}
                          onChange={() => {
                            if (val == "COD") {
                              setFilter({
                                ...filter,
                                payment_type:
                                  filter.payment_type === "COD" ? "All" : "COD",
                              });
                            } else if (val == "ONLINE PAYMENT") {
                              setFilter({
                                ...filter,
                                payment_type:
                                  filter.payment_type === "ONLINE PAYMENT"
                                    ? "All"
                                    : "ONLINE PAYMENT",
                              });
                            }
                          }}
                          className="hidden"
                        />
                        {val === "COD" ? (
                          <span>COD</span>
                        ) : (
                          <span>Paid Online</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between  custom300:space-x-4 my-4 flex-col custom300:flex-row ">
                <button
                  className="btn2"
                  type="button"
                  onClick={() => {
                    setFilter({
                      ...filter,
                      payment_type: "All",
                      delivery_type: "All",
                    });
                    setSubmitFilter({
                      ...submitFilter,
                      payment_type: "All",
                      delivery_type: "All",
                    });
                    setPageNumber(0);
                    setHasMore(true);
                  }}
                >
                  Cleat Filter
                </button>
                <button
                  className="btn2 bg-cyan-50 my-4 custom300:my-0 "
                  type="button"
                  onClick={() => {
                    setPageNumber(0);
                    setAlignMent(false);
                    setNewOrderData([]);
                    setSubmitFilter(filter);
                    setHasMore(true);
                  }}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* order list div=========== */}
        <div className=" overflow-y-scroll h-[500px] my-10 " id="target_this">
          <InfiniteScroll
            dataLength={newOrderData?.length || 0}
            next={fetchData}
            hasMore={hasMore}
            loader={
              <div className="flex items-center justify-center my-10 w-full ">
                <Loader />
              </div>
            }
            endMessage={
              <p className="text-center my-4">
                {pageNumber > 1 ? (
                  <b>No more data you have</b>
                ) : (
                  <div className="h-[400px] w-full pt-[110px] font-bold text-2xl">
                    No Order Found!
                  </div>
                )}
              </p>
            }
            scrollableTarget="target_this"
          >
            {isLoading ? (
              <OrderSkeleton data={[1]} data2={[1, 2, 3, 4, 5]} />
            ) : (
              <div>
                {newOrderData.map((val, ind) => {
                  return (
                    <>
                      <div className="my-6 px-1 custom400:px-4 ">
                        <div className=" flex justify-between " key={ind}>
                          <div className="flex">
                            <b> {ind + 1}.</b>
                            &nbsp; &nbsp;
                            <div className="text-[#5a5a0a] sm:text-[#1687a7] ">
                              {val?.order_id && (
                                <h4 className="sm:text-lg">
                                  Order ID: {val?.order_id}
                                </h4>
                              )}
                              {val?.order_time && (
                                <span className="hidden sm:block">
                                  Order Date:{" "}
                                  {formatDateTime(
                                    val.order_time
                                  ).toLocaleDateString()}{" "}
                                  &nbsp;
                                  {formatDateTime(
                                    val.order_time
                                  ).toLocaleTimeString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="hidden sm:block   ">
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
                        {val?.product_details?.map((value, ind) => {
                          return (
                            <div
                              key={ind}
                              className="flex sm:items-center sm:justify-between flex-col sm:flex-row my-4"
                            >
                              <div className="flex sm:w-[60%]">
                                <LazyLoadImage
                                  src={value?.main_image}
                                  alt={value?.main_image}
                                  className="w-[80px] h-[100px] object-contain aspect-[3/2] "
                                />

                                <div className="ml-2 mr-4 sm:mr-10">
                                  {value.product_title && (
                                    <h4 className="text-wrap w-full my-2 text-sm c500:text-[1rem]">
                                      {value.product_title}
                                    </h4>
                                  )}
                                  {value.total_price_with_tax && (
                                    <h4 className="font-semibold text-2xl">
                                      &#x20B9; {value.total_price_with_tax}{" "}
                                    </h4>
                                  )}
                                </div>
                              </div>

                              <div className="hidden sm:block font-semibold text-lg capitalize ">
                                <p>
                                  {value?.colour}, {value?.size}
                                </p>
                              </div>

                              <div className="text-[#73B7CA] flex space-x-2 justify-between items-center my-4 text-sm sm:justify-center ">
                                <div className="sm:hidden">
                                  Color :
                                  <b className="text-[#1687a7] capitalize ">
                                    {value?.colour}
                                  </b>
                                </div>
                                <div className="sm:hidden">
                                  Size:
                                  <b className="text-[#1687a7] uppercase">
                                    {value?.size}
                                  </b>
                                </div>

                                {value?.order_product_status === "1" ? (
                                  <button style={blue}>New </button>
                                ) : value?.order_product_status === "2" ? (
                                  <button style={blue}>
                                    Order in process{" "}
                                  </button>
                                ) : value?.order_product_status === "3" ? (
                                  <button style={blue}>Ready for ship </button>
                                ) : value?.order_product_status === "4" ? (
                                  <button style={blue}>On the way </button>
                                ) : value?.order_product_status === "5" ? (
                                  <button style={blue}>
                                    Order Delivered (in return period){" "}
                                  </button>
                                ) : value?.order_product_status === "6" ? (
                                  <button style={blue}>Order Delivered</button>
                                ) : value?.order_product_status === "7" ? (
                                  <button style={blue}>
                                    Returned (issued by customer)
                                  </button>
                                ) : value?.order_product_status === "8" ? (
                                  <button style={blue}>
                                    Return picked by courier
                                  </button>
                                ) : value?.order_product_status === "9" ? (
                                  <button style={blue}>
                                    Return delivered to seller
                                  </button>
                                ) : value?.order_product_status === "10" ? (
                                  <button style={blue}>
                                    Refund issued (to customer & cutted payment
                                    from seller)
                                  </button>
                                ) : value?.order_product_status === "11" ? (
                                  <button style={red}>
                                    Cancelled by seller
                                  </button>
                                ) : value?.order_product_status === "12" ? (
                                  <button style={red}>
                                    Cancelled by customer
                                  </button>
                                ) : value?.order_product_status === "16" ? (
                                  <button style={red}>
                                    Canceled by system
                                  </button>
                                ) : value?.order_product_status === "14" ? (
                                  <button style={blue}>
                                    Order not accepted by customer
                                  </button>
                                ) : value?.order_product_status === "15" ? (
                                  <button style={blue}>
                                    Order not accepted by customer & delivered
                                    to seller
                                  </button>
                                ) : (
                                  <button style={red}>Cancelled </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div className="mt-3 mx-auto w-[96%] sm:hidden ">
                          <Accordion
                            sx={{
                              background: " #D0E7ED",
                              borderRadius: "50px",
                            }}
                            // className="rounded-3xl bg-cyan-200"
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
                              <Typography>
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
                                  <span>Location : {val.location}</span>
                                )}
                                <br />
                                {val.payment_type && (
                                  <span>
                                    Order Type:{" "}
                                    {val?.order_delivery_type == 1
                                      ? "Store Pickup"
                                      : "Delivery"}
                                  </span>
                                )}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        </div>

                        <Popover
                          animate={{
                            mount: { y: 0 },
                            unmount: { y: 25 },
                          }}
                        >
                          <PopoverHandler
                            onClick={() => [getBills(val?.order_id)]}
                          >
                            <button className="btn1 sm:float-right mx-auto w-[96%] sm:w-[200px] flex items-center justify-center my-3 sm:p-[11px] p-3 rounded-xl">
                              Download Bill{" "}
                              <IoIosArrowDown className="text-xl ml-3" />
                            </button>
                          </PopoverHandler>

                          <PopoverContent className="w-[90%] mx-auto sm:w-[200px] mr-5 hover:outline-none">
                            {loads ? (
                              <div className="grid place-items-center">
                                <Loader />
                              </div>
                            ) : billData ? (
                              billData.length > 0 ? (
                                billData.map((bill, index) => (
                                  <PDFDownloadLink
                                    key={index}
                                    document={
                                      <Bill bill_datas={downloadBillData} />
                                    }
                                    fileName="Invoice"
                                    onClick={() => {
                                      const formData = new FormData();
                                      formData.append("session_id", sessionId);
                                      formData.append(
                                        "order_shipment_slip_id",
                                        bill
                                      );

                                      // Make the API call directly here
                                      download_bill_data(formData)
                                        .then((data) => {
                                          if (data?.data?.success) {
                                            setDownloadBillData(
                                              data?.data?.data
                                            );
                                            console.log(data?.data?.data);
                                          }
                                          queryClient.invalidateQueries(
                                            "order_delivered"
                                          );
                                        })
                                        .catch((err) => {
                                          console.log(err);
                                        });
                                    }}
                                  >
                                    <button
                                      className={`${
                                        index % 2 == 0
                                          ? "hover:bg-cyan-50 duration-500"
                                          : "hover:bg-gray-50 duration-500"
                                      } hover:text-cyan-600 capitalize rounded-lg w-full flex items-center justify-between px-4 p-2 ${
                                        index === billData.length - 1
                                          ? ""
                                          : "border-b border-gray-200"
                                      }`}
                                    >
                                      download pdf {index + 1}{" "}
                                      &nbsp;&nbsp;&nbsp;
                                      <AiOutlineDownload className="text-xl" />
                                    </button>
                                  </PDFDownloadLink>
                                ))
                              ) : (
                                <p className="font-semibold text-center capitalize">
                                  No bill found
                                </p>
                              )
                            ) : (
                              <p className="font-semibold text-center capitalize">
                                No bill found
                              </p>
                            )}
                          </PopoverContent>
                        </Popover>

                        <br />
                        <br />
                        <br />
                        <hr />
                      </div>
                    </>
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

export default Order;
