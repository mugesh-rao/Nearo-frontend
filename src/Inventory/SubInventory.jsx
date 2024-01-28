import { lazy } from "react";
import Rating from "@mui/material/Rating";
import { BsPlusLg } from "react-icons/bs";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { CiFilter } from "react-icons/ci";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AiOutlineDelete } from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from "@material-tailwind/react";
import { FiPlus } from "react-icons/fi";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../utils/BaseApi";
import LazyImage from "./LazyImage.jsx";
import { useNavigate } from "react-router";
import { getSessionId } from "../utils/get_session_id.js";
import { BiChevronRight } from "react-icons/bi";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog.jsx";
import { FaStar } from "react-icons/fa6";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
const DynamicSkeleton = lazy(() =>
  import("../SkeletonLoader/DynamicSkeleton.jsx")
);

const Loader = lazy(() => import("../utils/Loader.jsx"));
const EditProduct = lazy(() => import("./EditProduct.jsx"));
const SizeQuantity = lazy(() => import("./SizeQuantity"));

const Inventory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePreviewOpen = (productData) => {
    setPreviewOpen(true);
    setProductId(productData);
    console.log("product data", productData);
  };

  const handleQuantityOpen = (productData) => {
    setQuantityOpen(true);
    setProductId(productData);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const gotoEditProduct = (id) => {
    navigate(`/dashboard/add_product/edit/${id}`);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const send_lowstock_session = (data) =>
    apiRequest({
      url: "/inventory/get_product_list",
      method: "post",
      data: data,
    });
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({
    ratings: -1,
    quantity_less: -1,
    quantity_greater: -1,
  });
  const { mutate: get_low_stocks, isLoading } = useMutation(
    send_lowstock_session,
    {
      onSuccess: (data) => {
        if (
          filter.quantity_greater === -1 &&
          filter.quantity_less === -1 &&
          filter.ratings === -1
        ) {
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

          if (newData?.length === 0) {
            setHasMore(false);
          }
        } else {
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

          if (newData?.length === 0) {
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
  const [submitFilter, setSubmitFilter] = useState({
    ratings: -1,
    quantity_less: -1,
    quantity_greater: -1,
  });

  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      setPageNumber((prev) => prev + 1);
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("avg_review_stars", submitFilter.ratings);
      formData.append("quantity_less", submitFilter.quantity_less);
      formData.append("quantity_greater", submitFilter.quantity_greater);
      formData.append("page", pageNumber);
      get_low_stocks(formData);
      return () => {};
    }
  }, [submitFilter]);

  const fetchData = () => {
    setPageNumber((prev) => prev + 1);
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("avg_review_stars", submitFilter.ratings);
    formData.append("quantity_less", submitFilter.quantity_less);
    formData.append("quantity_greater", submitFilter.quantity_greater);
    formData.append("page", pageNumber); // Use the updated page number
    get_low_stocks(formData);
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

  if (
    (!lowData || lowData.length === 0) &&
    !isLoading &&
    submitFilter.ratings == -1 &&
    submitFilter.quantity_greater == -1 &&
    submitFilter.quantity_less == -1
  ) {
    return (
      <h2 className="h-[450px] text-xl text-center font-semibold custom400:text-2xl sm:text-3xl grid place-items-center w-full px-3">
        😍Start listing Your Amazing Products
      </h2>
    );
  }

  return (
    <>
      <div className=" bg-white sm:mx-2 pt-8">
        {/* filters------------ */}
        <div className="flex justify-between mx-2 items-center">
          <div className="hidden  sm:flex items-center text-2xl font-semibold lg:text-3xl  space-x-4">
            <h1>All Products</h1>
            {lowData && (
              <div className="h-[40px] w-[50px] bg-orange-100 mx-2 rounded-lg grid place-items-center">
                <span className="  text-orange-500 text-[1.5rem]  ">
                  {lowData?.length < 10 && lowData?.length > 0
                    ? `0${lowData?.length}`
                    : lowData?.length}
                </span>
              </div>
            )}
          </div>

          <div className="flex  justify-end w-full space-x-5 sm:w-fit">
            <button
              className="btn2 flex items-center"
              onClick={() => navigate("/dashboard/add_product")}
            >
              <BsPlusLg /> Add product
            </button>
            <div>
              <button className="btn2 flex items-center" onClick={handleOpen}>
                <CiFilter className="text-2xl" />
                <span className="hidden sm:block">Filters</span>
              </button>
              {isOpen ? (
                <div className="max-w-[20rem] right-0 sm:max-w-[24rem] w-full bg-white p-4 absolute sm:right-10 mt-5 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-50 ">
                  <p
                    className="float-right text-xl cursor-pointer"
                    onClick={handleOpen}
                  >
                    <BsBoxArrowUpRight />
                  </p>
                  <h2 className="text-xl font-semibold ">Product Stock</h2>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {[0, 7, 29, 30].map((val) => {
                      return (
                        <label
                          className={`cursor-pointer ${
                            filter.quantity_less === val
                              ? "btn1"
                              : filter.quantity_greater === val
                              ? "btn1"
                              : "btn2"
                          }`}
                          key={val}
                        >
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            value={val}
                            onChange={() => {
                              if (val === 0) {
                                setFilter({
                                  ...filter,
                                  quantity_less: filter.quantity_less === 0 ? -1 : 0,
                                  quantity_greater: -1,
                                });
                              } else if (val === 7) {
                                setFilter({
                                  ...filter,
                                  quantity_less: filter.quantity_less === 7 ? -1 : 7,
                                  quantity_greater: -1,
                                });
                              } else if (val === 29) {
                                setFilter({
                                  ...filter,
                                  quantity_less: filter.quantity_less === 29 ? -1 : 29,
                                  quantity_greater: filter.quantity_greater === 8 ? -1 : 8,
                                });
                              } else if (val === 30) {
                                setFilter({
                                  ...filter,
                                  quantity_greater: filter.quantity_greater === 30 ? -1 : 30,
                                  quantity_less: -1,
                                });
                              }
                            }}
                            
                            className="hidden"
                          />
                          {val === 0 ? (
                            <span>Out Of Stock</span>
                          ) : val === 7 ? (
                            <span>Less than 7</span>
                          ) : val === 29 ? (
                            <span>Between 8 - 29</span>
                          ) : val === 30 ? (
                            <span>More than 30</span>
                          ) : (
                            ""
                          )}
                        </label>
                      );
                    })}
                  </div>

                  <h2 className="text-xl font-semibold my-3 ">Ratings</h2>
                  <div className="flex flex-wrap mt-2 gap-2">
                    {[5, 4, 3, 2].map((val) => {
                      return (
                        <label
                          className={`cursor-pointer text-center w-fit ${
                            filter.ratings === val
                              ? "btn1 py-3"
                              : "btn2 py-3 flex justify-center items-center"
                          }`}
                          key={val}
                        >
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            value={val}
                            onChange={() => {
                              setFilter({
                                ...filter,
                                ratings: filter.ratings === val ? -1 : val,
                              });
                            }}
                            className="hidden"
                          />

                          {val === 5 ? (
                            <div className="flex justify-center items-center">
                              <FaStar /> <FaStar />
                              <FaStar /> <FaStar /> <FiPlus />
                            </div>
                          ) : val === 4 ? (
                            <div className="flex justify-center items-center">
                              <FaStar /> <FaStar />
                              <FaStar /> <FaStar />
                            </div>
                          ) : val === 3 ? (
                            <div className="flex justify-center items-center">
                              <FaStar /> <FaStar />
                              <FaStar />
                            </div>
                          ) : val === 2 ? (
                            <div className="flex justify-center items-center ">
                              <FaStar /> <FaStar />
                            </div>
                          ) : (
                            ""
                          )}
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      className="btn2"
                      type="button"
                      onClick={() => {
                        handleOpen();
                        setFilter({
                          ...filter,
                          ratings: -1,
                          quantity_greater: -1,
                          quantity_less: -1,
                        });
                        setSubmitFilter({
                          ...submitFilter,
                          ratings: -1,
                          quantity_greater: -1,
                          quantity_less: -1,
                        });
                        setPageNumber(0);
                        setHasMore(true);
                      }}
                    >
                      Clear Filters
                    </button>
                    <button
                      className="btn2 bg-[#d0e7ed] "
                      type="button"
                      onClick={() => {
                        setPageNumber(0);
                        setIsOpen(!isOpen);
                        setLowData([]);
                        setSubmitFilter(filter);
                        setHasMore(true);
                      }}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <InfiniteScroll
          dataLength={lowData?.length || 0} //This is important field to render the next data
          next={fetchData}
          hasMore={hasMore}
          loader={
            <div className="flex items-center justify-center bg-white w-full">
              <Loader />
            </div>
          }
          endMessage={
            <p className="text-center my-4">
              {pageNumber > 1 ? (
                <b>No more data you have</b>
              ) : (
                <div className="h-[400px] w-full pt-[110px] font-bold text-2xl">
                  No Product Found!
                </div>
              )}
            </p>
          }
        >
          {isLoading ? (
            <DynamicSkeleton data={[1, 2, 3, 4, 5, 6, 7, 8]} />
          ) : (
            <div className="grid grid-cols-1 custom400:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-[7px] custom400:gap-2 md:gap-x-3 gap-y-5 my-10 mx-1">
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
                          className=" flex justify-between items-center z-[3] relative "
                          style={{ height: "45px" }}
                        >
                          <p className="bg-[#1687a7] text-white text-[12px] h-4 px-2 c500:h-6 pb-6 py-[5px] rounded-e-lg font-semibold  overflow-hidden">
                            {val?.discount_percent}% OFF
                          </p>
                          <div className="mr-2 z-10">
                            <Popover placement="bottom-end">
                              <PopoverHandler>
                                <Button className="bg-white p-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg text-black">
                                  <MoreVertIcon />
                                </Button>
                              </PopoverHandler>
                              <PopoverContent className=" flex flex-col">
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

                        <LazyImage
                          src={val?.main_image}
                          alt={val?.product_title}
                          className="block -z-10 object-contain -mt-[45px] aspect-[4/4] h-[240px] w-full rounded-t-lg "
                        />

                        <div className="m-2">
                          <div className="my-[3px] text-[13px] text-[#5a5a0a] ">
                            <span
                              className={`${
                                +val.quantity_available >
                                +val.product_low_quantity_stock
                                  ? "text-green-500 "
                                  : +val.quantity_available <=
                                    +val.product_low_quantity_stock && +val.quantity_available != 0
                                  ? "text-orange-500"
                                  : +val.quantity_available == 0
                                  ? "text-red-500"
                                  : ""
                              } font-bold`}
                            >
                              {/* {val.quantity_available},{val.product_low_quantity_stock} */}
                              {+val.quantity_available >
                              +val.product_low_quantity_stock
                                ? "In Stock"
                                : +val.quantity_available <=
                                  +val.product_low_quantity_stock && +val.quantity_available != 0
                                ? "Low Stock"
                                : +val.quantity_available === 0
                                ? "Out Of Stock"
                                : ""}
                            </span>
                          </div>
                          <div className="block ">
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
                              <Rating
                                name="half-rating"
                                value={val?.avg_review_stars}
                                precision={0.5}
                                readOnly
                                size="small"
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
                                ({val.avg_review_stars}){" "}
                              </span>
                            </p>
                          </div>

                          <div className="flex justify-between space-x-1 my-2">
                            <button
                              onClick={(event) => [
                                handleQuantityOpen(val),
                                event.stopPropagation(),
                              ]}
                              className="bg-[#1687a7] text-white w-full c500:w-[75%] flex justify-center p-[6px] pb-2 rounded-lg cursor-pointer  "
                            >
                              Edit Quantity
                            </button>
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

        {previewOpen && (
          <CustomDialog
            open={previewOpen}
            onNo={() => setPreviewOpen(false)}
            size="medium"
            title="Edit Product"
            // fullScreen={fullScreen}
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
            <SizeQuantity
              product={productId}
              setQuantityOpen={setQuantityOpen}
            />
          </CustomDialog>
        )}
      </div>
    </>
  );
};

export default Inventory;
