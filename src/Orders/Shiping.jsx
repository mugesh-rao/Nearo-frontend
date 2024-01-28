import { lazy, Suspense } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Button } from "@material-tailwind/react";

import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../utils/BaseApi";
const Loader = lazy(() => import("../utils/Loader"));
import Bill from "./Bill";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OtpField from "./Otpfield";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashContent from "../Dashboard/DashContent";
import { getSessionId } from "../utils/get_session_id";
import { formatDateTime } from "../utils/dateTime";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog.jsx";
import LazyLoadImage from "./LazyLoadImage.jsx";
import OrderSkeleton from "../SkeletonLoader/OrderSkeleton.jsx";

const Shiping = () => {
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
  const [open, setOpen] = useState(false);
  const [shipmetn_id, setShipment_id] = useState("");
  //ready for ship product api
  const send_order_readyforShip = (data) =>
    apiRequest({
      url: "/orders/get_order_shipments",
      method: "post",
      data: data,
    });

  const queryClient = useQueryClient();

  //ready for ship dowenload bill api
  const download_bill_data = (data) =>
    apiRequest({ url: "orders/download_bill", method: "post", data });

  // 9347998091:navina_bhai

  const { mutate: get_readyforship, isLoading } = useMutation(
    send_order_readyforShip,
    {
      onSuccess: (data) => {
        console.log(data?.data.data);

        // Use Set to track existing product_ids
        const existingProductIds = new Set(
          lowData.map((item) => item.order_id)
        );

        // Filter out items with duplicate product_ids
        const newData = data?.data.data.filter(
          (item) => !existingProductIds.has(item.order_id)
        );

        setLowData((prevData) => {
          // Use Set to ensure uniqueness in the merged data
          const newDataIds = new Set(newData.map((item) => item.order_id));

          // Filter out items with duplicate product_ids from prevData
          const filteredPrevData = prevData.filter(
            (item) => !newDataIds.has(item.order_id)
          );

          return [...filteredPrevData, ...newData];
        });

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

  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("page", pageNumber);
      formData.append("shipment_status", 1);

      get_readyforship(formData);
    }
  }, [sessionId]);

  const fetchData = () => {
    setPageNumber((prev) => prev + 1);
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("page", pageNumber);
    formData.append("shipment_status", 1);
    get_readyforship(formData);
  };

  const [downloadBillData, setDownloadBillData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  if ((!lowData || lowData.length == 0)&&!isLoading) {
    return (
      <>
        {activeLink == "/dashboard/shipping" ? <DashContent /> : ""}
        <h2 className="h-[450px] text-xl text-center custom400:text-2xl sm:text-3xl text-gray-700 grid place-items-center w-full px-3">
          No order to pack
        </h2>
      </>
    );
  }

  return (
    <>
      {activeLink == "/dashboard/shipping" ? <DashContent /> : ""}
      <div className="bg-white sm:shadow-[0_3px_10px_rgb(0,0,0,0.2)] sm:mx-2 rounded-lg py-2">
        <div className="hidden  sm:flex text-2xl font-semibold lg:text-3xl m-6 ">
          <h1> Ready For Ship &nbsp;</h1>
          {lowData && (
            <div className="h-[40px] w-[50px] bg-[#e9f2f7] mx-2 rounded-lg grid place-items-center">
              <span className="  text-[#13b8f8] text-[1.5rem]  ">
                {lowData?.length < 10 && lowData?.length > 0
                  ? `0${lowData?.length}`
                  : lowData?.length}
              </span>
            </div>
          )}
        </div>

        {/* order list div=========== */}
        <div className="  overflow-y-scroll h-[500px] my-8 " id="target_this">
          <InfiniteScroll
            dataLength={lowData?.length || 0} //This is important field to render the next data
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
            {isLoading ? (
              <OrderSkeleton data={[1]} data2={[1, 2, 3, 4, 5]} />
            ) : (
              <div>
                {" "}
                {lowData.map((val, ind) => {
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
                                  Order Date:{" "}
                                  {formatDateTime(
                                    val.order_time
                                  ).toLocaleString()}
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
                                Order Type:{" "}
                                {val?.order_delivery_type == 1
                                  ? "Store Pickup"
                                  : "Delivery"}
                              </p>
                            )}
                          </div>
                        </div>
                        <br />
                        {val?.product_details?.map((val2) => {
                          return (
                            <>
                              <div
                                key={val2.order_id}
                                className="flex sm:items-center sm:justify-between flex-col sm:flex-row my-4 "
                              >
                                <div className="flex sm:w-[60%]">
                                  <LazyLoadImage
                                    src={val2?.main_image}
                                    alt={val2?.main_image}
                                    className="w-[80px] h-[100px] object-contain aspect-[3/2] "
                                  />

                                  <div className="ml-2">
                                    {val2.product_title && (
                                      <h4 className="text-wrap w-full my-2 text-sm c500:text-[1rem]">
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
                                  {val2.total_price_with_tax && (
                                    <h4 className="font-semibold text-2xl">
                                      &#x20B9; {val2.total_price_with_tax}
                                    </h4>
                                  )}
                                </div>

                                <div className="hidden sm:block font-semibold text-lg sm:mr-10">
                                  {val?.total_product_quantity && (
                                    <p>{val?.total_product_quantity} </p>
                                  )}
                                </div>
                                <div className="text-[#73B7CA] flex space-x-4 justify-between my-4 text-sm sm:hidden ">
                                  {val.colour && (
                                    <div>
                                      Color :
                                      <b className="text-[#1687a7] capitalize ">
                                        {val.colour}
                                      </b>
                                    </div>
                                  )}
                                  {val.size && (
                                    <div>
                                      Size:{" "}
                                      <b className="text-[#1687a7] uppercase">
                                        {val.size}
                                      </b>
                                    </div>
                                  )}
                                  {val.total_product_quantity && (
                                    <div>
                                      Qty. :{" "}
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
                        <div className="flex flex-col sm:flex-row  sm:items-center sm:justify-end sm:space-x-4 space-x-0 sm:space-y-0 space-y-4 ">
                          <div className="sm:hidden">
                            <Accordion
                              sx={{
                                background: "#D0E7ED",
                                borderRadius: "20px",
                              }}
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
                                  className="text-[#5a5a0a]"
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
                                    <p >
                                      Shipment Id: {val?.order_shipment_slip_id}
                                    </p>
                                  )}
                                
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

                          <Button
                            className="bg-green-600 text-[14px] p-3 px-8 "
                            onClick={() => [
                              setOpen(true),
                              setShipment_id(val?.order_shipment_slip_id)
                            ]}
                          >
                            Enter Code
                          </Button>

                          <PDFDownloadLink
                            document={<Bill bill_datas={downloadBillData} />}
                            fileName="Invoice"
                            onClick={() => {
                              const formData = new FormData();
                              formData.append("session_id", sessionId);
                              formData.append(
                                "order_shipment_slip_id",
                                val?.order_shipment_slip_id
                              );
                              console.log("shipment",val?.order_shipment_slip_id)
                              // Make the API call directly here
                              download_bill_data(formData)
                                .then((data) => {
                                  if (data?.data?.success) {
                                    setDownloadBillData(data?.data?.data);
                                   
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
                            {({ loading }) => (
                              <Button className="bg-[#1687a7] capitalize flex items-center justify-center text-[14px] p-3 px-8 w-full">
                                {loading ? "Loading..." : "Download Bill"}
                              </Button>
                            )}
                          </PDFDownloadLink>

                          <CustomDialog
                            open={open}
                            onNo={() => setOpen(false)}
                            size="medium"
                            title="Enter Code"
                            className="w-auto c500:w-[400px] mx-auto h-[550px]"
                          >
                            <div className="h-[250px] ">
                              <Typography
                                id="modal-modal-title"
                                variant="h6"
                                component="h2"
                              >
                                <div className=" custom400:p-4 max-w-max mx-auto my-2 mt-4">
                                  <Suspense
                                    fallback={
                                      <div className="h-screen grid place-items-center absolute bg-white z-20 top-0 right-0 bottom-0 left-0">
                                        <Loader />
                                      </div>
                                    }
                                  >
                                    <OtpField
                                      length={4}
                                      autoFocus
                                      secure
                                      shipment_id={shipmetn_id}
                                      setOpen={setOpen}
                                    />
                                  </Suspense>
                                </div>
                              </Typography>
                              <Typography
                                id="modal-modal-description"
                                sx={{ mt: 2 }}
                              ></Typography>
                            </div>
                          </CustomDialog>
                        </div>

                        <br />
                        <hr />
                        <br />
                      </div>
                    </>
                  );
                })}
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};

export default Shiping;
