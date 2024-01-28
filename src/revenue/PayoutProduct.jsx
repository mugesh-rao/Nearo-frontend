import { useEffect, useMemo, useState } from "react";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { getSessionId } from "../utils/get_session_id";
import Loader from "../utils/Loader";
const PayoutProduct = ({ seller_id }) => {
  const sessionId = getSessionId();
  const [preview, setPreview] = useState(false);
  const revenue_paid_product = (data) =>
    apiRequest({
      url: "/revenue/payout_order_product_details",
      method: "post",
      data: data,
    });

  const queryClient = useQueryClient();

  const { mutate: get_revenue_paid, isLoading } = useMutation(
    revenue_paid_product,
    {
      onSuccess: (data) => {
        console.log(data?.data.data);
        setLowData(data?.data.data);

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
  useEffect(() => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("page", 0);
    formData.append("seller_payout_id", seller_id);
    get_revenue_paid(formData);
  }, [seller_id]);

  return (
    <>
      {isLoading ? (
        <div className="grid place-items-center w-full h-screen">
          <Loader />{" "}
        </div>
      ) : (
        <div className="w-[500px] c500:w-full ">
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
                        Size :&nbsp;
                        <span className="text-black font-semibold">
                          {val?.size?`${val?.size},`:""} {val.colour}
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
                    <h4>&#x20B9; {val?.price_with_tax}</h4>
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
                      &#x20B9; {val?.seller_total_charges}
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
      )}
    </>
  );
};

export default PayoutProduct;
