import { lazy, useRef, useState } from "react";
import PropTypes from "prop-types";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { getSessionId } from "../utils/get_session_id";

const Loader = lazy(() => import("../utils/Loader"));

const OtpField = ({ length, shipment_id, setOpen }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  OtpField.propTypes = {
    length: PropTypes.number.isRequired,
    shipment_id: PropTypes.string.isRequired,
  };
  // console.log(shipment_id,"gagn")
  const inputRefs = useRef([]);
  const sessionId = getSessionId();
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    let newValue = value;

    if (index === length - 1) {
      newValue = value.slice(0, 1);
    }

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = newValue;
      return newOtp;
    });

    if (value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (index < length - 1 && value !== "") {
      inputRefs.current[index + 1].focus();
    }
    // // Call the handleChanges function with the updated OTP
    // const updatedOtp = [...otp];
    // updatedOtp[index] = newValue;
    // handleChanges(updatedOtp.join(""));
  };

  const queryClient = useQueryClient();
  const send_mark_shipment_delivered = (data) =>
    apiRequest({
      url: "/orders/mark_shipment_delivered",
      method: "post",
      data: data,
    });
const [warning,setWarning]=useState(null)
  const { mutate: send_readyforship_otp, isLoading } = useMutation(
    send_mark_shipment_delivered,
    {
      onSuccess: (data) => {
        console.log(data?.data);
        setWarning(data?.data)
        queryClient.invalidateQueries("order_delivered");
        // setOpen(false);
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

  const send_ready_otp = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("order_shipment_slip_id", shipment_id);
    formData.append("delivery_otp", otp.join("")); // Join the array to create a string
    await send_readyforship_otp(formData);
  };

  return (
    <>
      {!isLoading ? (
        <form action="" onSubmit={send_ready_otp}>
          <div className="flex justify-center space-x-2">
            {otp?.map((digit, index) => (
              <input
                key={index}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-12 h-12 text-4xl border border-cyan-300 text-cyan-700 text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                required
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
         {warning?.success==0&&<p className="my-2 text-center text-red-600 text-sm "> {warning?.message}</p>}
        
          <button
            className="mt-3 text-white btn1 p-2 c500:font-semibold mx-auto w-full duration-500"
            type="submit"
          >
            Continue
          </button>

          <p className="text-center my-3 mx-4  text-sm">
            if you don{`'`}t know check &nbsp;
            <span className="text-black font-semibold">My Order</span> <br />
            we had already sent it
          </p>
        </form>
      ) : (
        <div className="">
          <Loader />
        </div>
      )}
    </>
  );
};

export default OtpField;
