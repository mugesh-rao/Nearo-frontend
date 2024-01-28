import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../utils/BaseApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
const Help = () => {
  const send_help_request = (data) =>
    apiRequest({
      url: "Help_and_support/raise_request",
      method: "post",
      data: data,
    });

  const get_request_value = () => {
    const queryClient = useQueryClient();
    return useMutation(send_help_request, {
      onSuccess: (data) => {
        setMessage(data?.data)
        
        queryClient.invalidateQueries("sendphone_no");
      },
    });
  };

  const { mutate:sendRequest,isLoading } = get_request_value();
  // const [reqData,setReqData]=useState(null)
  const makeRequest = useCallback(() => {
    const formData = new FormData();
    formData.append("session_id", Cookies.get("session_id"));
    sendRequest(formData)
    
  }, []);

  const [message,setMessage]=useState("")

  // if (isLoading) {
  //   return (
  //     <h2 className="text-5xl text-red-500 h-screen flex justify-center  items-center">
  //       Loading....
  //     </h2>
  //   );
  // }
  return (
    <>
      <div className="mx-2 sm:mx-5 mt-8">
        <h1 className="text-2xl md:text-3xl font-semibold sm:text-black text-[#1687a7]">
          Help & Support
        </h1>
        <br />
        <h2 className="text-lg font-semibold">
          {" "}
          Welcome to our Seller Portal Help and Support page!
        </h2>
        <p className="my-2">
          Need assistance with your seller account? Click the {`"`}Call Us{`"`}{" "}
          button below to connect with our dedicated seller support team. We
          {`'`}re here to help you with product listing, inventory management,
          order fulfillment, payment and commission details, and more. Your
          success is important to us, and we{`'`}re committed to providing
          excellent support.
        </p>
        <br />
 
       {
        message&&message.message?<p className="text-xl capitalize text-red-400">{message?.message} </p>: <button className="btn1 w-full sm:w-[180px] my-2" onClick={makeRequest}
        disabled={isLoading}
        >
       
       {
        isLoading?<CircularProgress size={24} />:"Call Us"
       }
        </button>
       }
      </div>
    </>
  );
};

export default Help;
