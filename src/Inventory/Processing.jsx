import { lazy, Suspense } from "react";
const LazyRating = lazy(() => import("@mui/material/Rating"));
import EditProduct from "./EditProduct.jsx";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  useSelect,
} from "@material-tailwind/react";
import SizeQuantity from "./SizeQuantity";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { BsPlusLg } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../utils/BaseApi";
import Loader from "../utils/Loader.jsx";
import LazyImage from "./LazyImage.jsx";
import { useNavigate } from "react-router-dom";
import { getSessionId } from "../utils/get_session_id.js";
import { BiChevronRight } from "react-icons/bi";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog.jsx";
import DynamicSkeleton from "../SkeletonLoader/DynamicSkeleton.jsx";

const Processing = () => {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [productId, setProductId] = useState("");
  const handlePreviewOpen = (productData) => {
    setPreviewOpen(true);
    setProductId(productData);
  };

  const handleAlertOpen = (data, status) => {
    if (status == 2) {
      setAlertOpen(true);
      setAlertMessage(data);
    }
  };

  const handleQuantityOpen = (productData) => {
    setQuantityOpen(true);
    setProductId(productData);
  };

  const sessionId = getSessionId();

  const send_lowstock_session = (data) =>
    apiRequest({
      url: "/inventory/get_processing_product_list",
      method: "post",
      data: data,
    });
  const queryClient = useQueryClient();

  const { mutate: get_low_stocks, isLoading } = useMutation(
    send_lowstock_session,
    {
      onSuccess: (data) => {
        // Use Set to track existing product_ids
        const existingProductIds = new Set(
          lowData.map((item) => item.product_id)
        );

        // Filter out items with duplicate product_ids
        const newData = data?.data.data.filter(
          (item) => !existingProductIds.has(item.product_id)
        );

        setLowData((prevData) => {
          // Use Set to ensure uniqueness in the merged data
          const newDataIds = new Set(newData.map((item) => item.product_id));

          // Filter out items with duplicate product_ids from prevData
          const filteredPrevData = prevData.filter(
            (item) => !newDataIds.has(item.product_id)
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
    }
  );

  const [lowData, setLowData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return []; // Initialize as an empty array
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
      get_low_stocks(formData);
      return () => {};
    }
  }, [sessionId]);

  const fetchData = () => {
    setPageNumber((prev) => prev + 1);
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("page", pageNumber); // Use the updated page number
    get_low_stocks(formData);
  };

  const gotoEditProduct = (id) => {
    navigate(`/dashboard/add_product/edit/${id}`);
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading && pageNumber == 0) {
    return (
      <div className="h-screen grid place-items-center bg-white z-10 fixed top-0 right-0 bottom-0 left-0">
        <Loader />
      </div>
    );
  }

  if ((!lowData || lowData.length == 0) && !isLoading) {
    return (
      <h2 className="h-[450px] text-xl text-center custom400:text-2xl sm:text-3xl text-gray-700 grid place-items-center w-full px-3">
        No products in processing
      </h2>
    );
  }

  return (
    <>
      <div className=" bg-white sm:mx-2 py-8">
        {/* filters------------ */}
        <div className="flex justify-between mx-2 items-center">
          <div className="hidden  sm:flex text-2xl font-semibold lg:text-3xl ">
            <h1 className="capitalize">Processing</h1>
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

          <div className="flex justify-end w-full space-x-5 sm:w-fit">
            <button
              className="btn2 flex items-center"
              onClick={() => navigate("/dashboard/add_product")}
            >
              <BsPlusLg /> Add product
            </button>
          </div>
        </div>

        {/* add procucts======== */}
        <InfiniteScroll
          dataLength={lowData?.length || 0} //This is important field to render the next data
          next={fetchData}
          hasMore={hasMore}
          loader={
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {isLoading ? (
            <DynamicSkeleton data={[1, 2, 3, 4, 5, 6, 7, 8]} />
          ) : (
            <div className="grid grid-cols-1 custom400:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-[7px] custom400:gap-2 md:gap-x-3 gap-y-5 my-10 mx-1 ">
              {lowData &&
                lowData?.map((val) => {
                  return (
                    <>
                      <div
                        key={val?.product_id}
                        className="hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-500 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-lg h-[400px] cursor-pointer c500:cursor-default  mx-auto w-full custom300:w-[300px] custom400:w-full "
                        onClick={() => [
                          screenWidth < 500 ? setPreviewOpen(val) : "",
                        ]}
                      >
                        <div
                          className="flex justify-between items-center z-[3] relative "
                          style={{ height: "45px" }}
                        >
                          <p className="bg-[#1687a7] text-white text-[12px] h-4 px-2 c500:h-6 pb-6 py-[5px] rounded-e-lg font-semibold  overflow-hidden">
                            {val?.discount_percent}% OFF
                          </p>
                          <div className="mr-2 z-20">
                            <Popover placement="bottom-end">
                              <PopoverHandler>
                                <Button className="bg-white p-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg text-black">
                                  <MoreVertIcon />{" "}
                                </Button>
                              </PopoverHandler>
                              <PopoverContent className="flex flex-col">
                                <span
                                  className="capitalize flex items-center py-2 cursor-pointer"
                                  onClick={() =>
                                    gotoEditProduct(val?.product_id)
                                  }
                                >
                                  <RiErrorWarningLine className="text-lg" />
                                  &nbsp; Edit Product
                                </span>
                                <hr />
                                <span className="capitalize flex items-center py-2 cursor-not-allowed" aria-disabled={true}>
                                  <AiOutlineDelete className="text-lg" /> &nbsp;
                                  Archive Product
                                </span>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        {val?.main_image ? (
                          <LazyImage
                            src={val?.main_image}
                            alt={val?.product_title}
                            className="block -z-10 object-contain -mt-[45px] aspect-[4/4] h-[240px] w-full rounded-t-lg "
                          />
                        ) : (
                          <image
                            src={val?.main_image}
                            alt={val?.product_title}
                            className="block -z-10 object-contain -mt-[45px] aspect-[4/4] h-[240px] w-full rounded-t-lg "
                          />
                        )}

                        <div className="m-2">
                          <div className="block ">
                            <div className="my-[3px] text-[13px] text-[#5a5a0a] ">
                              {/* Free Delivery &nbsp; &nbsp;{" "} */}
                              <span
                                className={`${
                                  val.quantity_available >
                                  val.product_low_quantity_stock
                                    ? "text-green-500 "
                                    : val.quantity_available <=
                                      val.product_low_quantity_stock
                                    ? "text-orange-500"
                                    : val.quantity_available == 0
                                    ? "text-red-500"
                                    : "text-orange-500"
                                } font-bold`}
                              >
                                {val.quantity_available >
                                val.product_low_quantity_stock
                                  ? "In Stock"
                                  : val.quantity_available <=
                                    val.product_low_quantity_stock
                                  ? "Low Stock"
                                  : val.quantity_available == 0
                                  ? "Out Of Stock"
                                  : `${val.quantity_available} Left`}
                              </span>
                            </div>
                            <h4 className="whitespace-nowrap text-ellipsis overflow-hidden text-sm ">
                              {val?.product_title}{" "}
                            </h4>

                            <div className="flex items-end my-[2px]">
                              <p className="text-[#5a5a0a] text-[14px] line-through">
                                &#x20B9;{val?.mrp}
                              </p>
                              &nbsp; &nbsp;
                              <b className="text-green-500">
                                &#x20B9;{val.price}
                              </b>
                            </div>

                            <p className="flex items-end">
                              <LazyRating
                                name="half-rating"
                                value={val?.avg_review_stars}
                                precision={0.5}
                                size="small"
                                readOnly
                                sx={{ fontSize: "21px" }}
                              />
                              &nbsp;
                              <span
                                style={{
                                  color: "rgba(19, 19, 19, 0.458)",
                                  paddingTop: "3px",
                                  fontSize: "14px",
                                }}
                              >
                                ({val.avg_review_stars})
                              </span>
                            </p>
                          </div>

                          <div className="flex justify-between space-x-1 my-2">
                            {val.approval_status && (
                              <button
                                onClick={() =>
                                  handleAlertOpen(
                                    val.remarks,
                                    val.approval_status
                                  )
                                }
                                className={`${
                                  val.approval_status == 0
                                    ? "bg-[#13b8f8] text-white cursor-wait"
                                    : val.approval_status == 1
                                    ? "bg-green-600 text-white"
                                    : val.approval_status == 2
                                    ? "bg-gray-300 text-gray-500 "
                                    : ""
                                }  w-full c500:w-[75%] flex justify-center p-[6px] pb-2 rounded-lg  capitalize `}
                              >
                                {val.approval_status == 0
                                  ? "in process"
                                  : val.approval_status == 1
                                  ? "accpted"
                                  : val.approval_status == 2
                                  ? "rejected"
                                  : ""}
                              </button>
                            )}

                            <div className="">
                              <button
                                onClick={() => handlePreviewOpen(val)}
                                className=" border border-[#1687a7] rounded-lg w-[45px] hidden c500:flex justify-center items-center p-[6px] pb-2 "
                              >
                                <BiChevronRight className="text-[#1687a7] text-2xl" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          )}
        </InfiniteScroll>

        {alertOpen && (
          <CustomDialog
            open={alertOpen}
            onNo={() => setAlertOpen(false)}
            size="small"
            title="Remarks"
          >
            <div className="flex justify-center items-center">
              {alertMessage}
            </div>
          </CustomDialog>
        )}
        {previewOpen && (
          <CustomDialog
            open={previewOpen}
            onNo={() => setPreviewOpen(false)}
            size="medium"
            title="Edit Product"
          >
            <EditProduct product={productId} />
          </CustomDialog>
        )}
        {quantityOpen && (
          <CustomDialog
            open={quantityOpen}
            onNo={() => setQuantityOpen(false)}
            size="small"
            title="Edit Quantities"
          >
            <SizeQuantity product={productId} />
          </CustomDialog>
        )}
      </div>
    </>
  );
};

export default Processing;
