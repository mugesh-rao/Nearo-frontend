import Rating from "@mui/material/Rating";
import { useMemo, useState, useEffect } from "react";

import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import React from "react";
import { getSessionId } from "../utils/get_session_id";
import { useNavigate } from "react-router-dom";
import LazyLoadImage from "../Orders/LazyLoadImage";
import Loader from "../utils/Loader";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog";
import SizeQuantity from "../Inventory/SizeQuantity";
export default function Product() {
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const handleQuantityOpen = (productData) => {
    setQuantityOpen(true);
    setProductId(productData);
  };
  // 8828800038
  const send_top_sellingId = (data) =>
    apiRequest({
      url: "/dashboard/get_top_selling_products ",
      method: "post",
      data,
    });

  const send_Low_stockId = (data) =>
    apiRequest({
      url: "/dashboard/get_low_stock_products",
      method: "post",
      data,
    });

  const queryClient = useQueryClient();
  const { mutate: get_top_selling_products, isLoading } = useMutation(
    send_top_sellingId,
    {
      onSuccess: (data) => {
        setTopSellingProduct(data?.data?.data);
        queryClient.invalidateQueries("session-id");
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
  const { mutate: get_low_stock_products, isLoading: loader } = useMutation(
    send_Low_stockId,
    {
      onSuccess: (data) => {
        setisLowStockData(data?.data?.data);
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
    }
  );

  const [isTopSellingData, setTopSellingProduct] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  const [isLowStockData, setisLowStockData] = useState(
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
      formData.append("session_id", sessionId);+
      get_top_selling_products(formData);
      get_low_stock_products(formData);
    }
  }, []);
  if (isLoading || loader) {
    return (
      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div
        className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]  
       md:flex lg:justify-between py-10 sm:rounded-t-lg mt-5 bg-white mx-2"
      >
        {/* 2divs are divided into display flex  */}
        {isTopSellingData && isTopSellingData.length > 0 ? (
          <div className=" md:w-[55%]">
            {/* title and filter setting  */}

            <h2 className="text-lg font-semibold sm:text-2xl mx-4 ">
              Top Selling Products
            </h2>
            <br />
            <div
              className={`${
                isTopSellingData?.length > 8 ? "h-[450px]" : "h-auto"
              } overflow-y-scroll  border-t border-gray-400 py-1 `}
            >
              {isTopSellingData?.map((val, ind) => {
                return (
                  <React.Fragment key={val.product_id}>
                    <div className={` flex items-center p-2 px-0 mx-2 space-x-3 ${ind===0?"border-b":"border-y"}   border-gray-300`}>
                      <div className="flex items-center w-[65%]  ">
                        <p
                          style={{ color: "rgba(0, 0, 0, 0.621)" }}
                          className="text-sm"
                        >
                          {ind + 1 < 10 ? `0${ind + 1}` : ind + 1}.
                        </p>

                        <LazyLoadImage
                          src={val.main_image}
                          alt={val.main_image}
                          className="w-12 h-14 sm:h-[4.5rem] sm:w-16 rounded-lg mx-1 object-contain "
                        />
                        <div>
                          <p className="text-wrap1 text-[13px] sm:text-[15px] mx-1">
                            {val.product_title}
                          </p>

                          <div className="hidden sm:flex items-center">
                            <Rating
                              name="half-rating"
                              value={val?.avg_review_stars}
                              precisio={0.5}
                              readOnly
                            />
                            <span className="text-[#5a5a0a] text-[12px] mx-2">
                              ({val.num_total_reviews})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex w-[28%] text-center justify-between font-semibold sm:text-xl">
                        <h4>{val.quantity_available} </h4>
                        <h4>&#x20B9; {val.price}</h4>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
        {/* { product 2 } */}
        {isLowStockData && isLowStockData.length > 0 ? (
          <div className="my-12 md:my-0 md:w-[44%] ">
            <h2 className="text-lg font-semibold mx-2 sm:text-2xl">
              Low Stocks
            </h2>
            <br />
            <div
              className={`${
                isTopSellingData?.length > 8 ? "h-[450px]" : "h-auto"
              } overflow-y-scroll border-t border-gray-400 py-1`}
            >
              {isLowStockData?.length > 0 ? (
                isLowStockData?.map((val,ind) => {
                  return (
                    <React.Fragment key={val.product_id}>
                      <div  className={`flex items-center justify-between p-2 mx-2 ${ind===0?"border-b":"border-y"} border-gray-300`}>
                     
                        <div className="flex items-center w-[65%]   ">
                          <LazyLoadImage
                            src={val.main_image}
                            alt={val.main_image}
                            className="w-12 h-14 sm:h-[4.5rem] sm:w-16 rounded-lg mx-1 object-contain"
                          />

                          <div className="mx-2">
                            <p className="text-wrap1 text-[13px] sm:text-[15px]">
                              {val.product_title}
                            </p>

                            <p style={{ color: "red" }}>
                              {val.quantity_available} left{" "}
                            </p>
                          </div>
                        </div>
                        <button
                          className="text-[12px] bg-red-100 px-5 py-2 rounded-xl"
                          onClick={(event) => [
                            handleQuantityOpen(val),
                            event.stopPropagation(),
                          ]}
                          type="button"
                        >
                          Add Stock
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="h-full flex items-center rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-2 mx-2 my-4 justify-between">
                  No Products
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      {quantityOpen && (
        <CustomDialog
          open={quantityOpen}
          onNo={() => setQuantityOpen(false)}
          size="small"
          title="Edit Quantities"
        >
          <SizeQuantity product={productId} setQuantityOpen={setQuantityOpen} />
        </CustomDialog>
      )}
    </>
  );
}
