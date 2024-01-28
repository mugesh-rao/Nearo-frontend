import { startTransition, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import personalLogo from "../img/Humaaans - Wireframe.png";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { signupSchema } from "../schemas";
import { Link } from "react-router-dom";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../utils/BaseApi";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import toast from "react-hot-toast";

//this object is formik yup validation
let initialValues = {
  name: "",
  email: "",
  phoneNumber: "",
  otp: "",
  password: "",
};

const Personal = () => {
  // const notify = () =>
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const [timer, setTimer] = useState(59);
  const [isActive, setIsActive] = useState(false);
  // const { personalData2 } = useSelector((state) => state.showHide);
  const queryClient = useQueryClient();
  // this if for handling the whole form of personal details using formik Yup for validation
  let { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signupSchema,
      onSubmit: (values) => {
        const updatedValues = {
          ...values,
          session_id: session_id?.session_id,
        };
        Dispatch({ type: "storePersonalDetails", payload: updatedValues });
        // console.log(values);

        startTransition(() => {
          Dispatch({ type: "signUp" });
          navigate("/signup/shopdetails");
        });
      },
    });

  // in this useeffect i am contorolling navbar data show or hide
  useEffect(() => {
    Dispatch({
      type: "falselog",
    });
    Dispatch({
      type: "falser",
    });
  }, []);

  //this is back button for personal details
  const back = () => {
    navigate(-1);
    Dispatch({
      type: "truer",
    });
    Dispatch({
      type: "truelog",
    });
  };

  //this is for password show or hide
  const [pass, showPass] = useState(true);
  const showPassword = () => {
    showPass(!pass);
  };

  // this is for handling phone number value
  const [phone_no, setPhoneNo] = useState("");
  const handleInputChange = (event) => {
    const { name } = event.target;
    const newValue = event.target.value.replace(/\D/g, "");
    // console.log(value)
    if (name === "phoneNumber") {
      //   const sanitizedValue = value.startsWith("0") ? value.substring(1) : value;
      //   if (sanitizedValue.length = 10) {
      setPhoneNo(newValue);
      //      // Call handleChange from useFormik
      //   }     // Update phoneNumber state
    }
    handleChange(event); // Call handleChange from useFormik
  };

  //this usestate for otp key handling
  const [otpKey, setOtpKey] = useState();
  //this is a request to our main api
  const sendNumber = (otp) =>
    apiRequest({
      url: "/login/send_registration_otp",
      method: "post",
      data: otp,
    });

  // this is for send number to our api
  const { mutate: addOtp, isLoading: otpLoading } = useMutation(sendNumber, {
    onSuccess: (data) => {
      console.log("sucess_data",data);
      setOtpKey(data?.data);
      setOtpShow(true);
      if (data?.data.success == 0) {
        toast.error(data?.data.message);
        navigate(`/${data?.data.redirect}`);
      } else if (data?.data.success == 1) {
        toast.success(data?.data.message);
      }

      queryClient.invalidateQueries("sendphone_no");
    },
    onError:(err) => {
      console.log("err",err);
    },
    retry: {
      maxAttempts: 3,
      delay: (attempt) => {
        return attempt * 1000;
      },
    },
  });

  // this function is sending phone number to api while clikcing sendotp button
  const [otpShow, setOtpShow] = useState(false);

  // sending formdata ofphone number to our
  const sendOtp = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("phone_no", phone_no);

    addOtp(formData);

    if (!isActive && timer == 59) {
      setIsActive(true);
      setTimer(59);
    }
  };

  //this function is only for otpfield maximum numbers

  // this is for sendig request to our main api
  const verifyOtp = (otpData) =>
    apiRequest({
      url: `/login/verify_registration_otp`,
      method: "post",
      data: otpData,
    });
  // this is for handling api or sending data to api
  const [session_id, setSession_ID] = useState();
  const { mutate: vOtp, isLoading: verifyLoading } = useMutation(verifyOtp, {
    onSuccess: (data) => {
      setSession_ID(data?.data);
      Cookies.set("session_id", data?.data.session_id, { expires: 7 });

      queryClient.invalidateQueries("verify-otp");
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

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    // console.log(value)
    if (name === "otp") {
      setOtp(value); // Update phoneNumber state
    }

    handleChange(e); // Call
  };

  //mutution of verification otp
  // const { mutate: vOtp, isLoading: verifyLoading } = otpVerifier();
  const [otp, setOtp] = useState("");

  //sending formdata to our api for verify otp
  useEffect(() => {
    // Trigger API call when the OTP is 6 digits
    if (otp.length === 6) {
      verifyOtps();
      setIsActive(false);
      setTimer(59);
    }
  }, [otp]);
  const verifyOtps = async () => {
    const formData = new FormData();
    formData.append("phone_no", phone_no);
    formData.append("otp_key", otpKey?.otp_key);
    formData.append("otp", otp);
    try {
      await vOtp(formData);
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  };

  // timer\\

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            setIsActive(false);
            setTimer(59);
            return 59;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <>
      <div className="personal mt-20">
        <Button variant="text" sx={{ margin: "-60px 0 0 2%" }} onClick={back}>
          {" "}
          <KeyboardArrowLeftIcon /> Back
        </Button>

        <div className=" flex mx-auto w-[94%] justify-between items-center md:w-1/2 md:mx-12 ">
          <h1 className="text-2xl font-bold sm:text-3xl ">Personal Details</h1>
          <div>
            <div className="w-[100px] h-2 bg-[#6666] rounded-md">
              <div className="w-[30px] h-2 bg-[#1687a7] rounded-md "></div>
            </div>
            <p className="text-center my-2 text-[#1687a7]"> Step 1/3</p>
          </div>
        </div>

        <div className="login-box w-[94%] md:w-[74%] lg:w-[94%] rounded-xl mx-auto my-10 GAGAN  py-8 px-3 lg:px-8 lg:flex justify-between ">
          <div className="lg:w-[55%]">
            <form
              action="#"
              onSubmit={handleSubmit}
              className="w-full  text-[#5a5a5a] "
            >
              <p className="text-[1rem]">
                Name<sup>*</sup>{" "}
              </p>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                onFocus={(e) =>
                  e.target.setAttribute("autocomplete", "new-password")
                }
                className="w-full my-1 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] capitalize "
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
              <br />
              <div className="flex justify-between sm:items-center flex-col sm:flex-row mt-2 ">
                <div className="w-full sm:w-[72%] ">
                  <p className="text-[1rem]">
                    Phone Number<sup>*</sup>{" "}
                  </p>
                  <input
                    type="number"
                    name="phoneNumber"
                    placeholder="PhoneNumber"
                    className="w-full my-1 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] "
                    value={values.phoneNumber}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                    onFocus={(e) =>
                      e.target.setAttribute("autocomplete", "new-password")
                    }
                  />
                  <br />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="w-full sm:w-[27%]  ">
                  <p>&nbsp;</p>

                  {isActive ? (
                    <button
                      className="w-full my-1 p-2 text-lg font-semibold sm:p-[5px] input-border text-[#1687a7] cursor-not-allowed"
                      disabled={true}
                    >
                      00:{timer}
                    </button>
                  ) : (
                    <button
                      className="w-full my-2 p-2 text-lg font-semibold sm:p-[5px] input-border text-[#1687a7] "
                      onClick={sendOtp}
                      type="button"
                      disabled={
                        !(phone_no?.length == 10) ||
                        otpLoading ||
                        session_id?.success == 1
                      }
                    >
                      {otpLoading
                        ? ("sending", (<CircularProgress size={24} />))
                        : otpShow || isActive
                        ? "Resend OTP"
                        : "Send OTP"}
                    </button>
                  )}

                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="text-red-500 text-sm">&nbsp;</p>
                  )}
                </div>
              </div>
              {phone_no?.length == 10 && otpShow ? (
                <p className="text-[1rem] mt-2">
                  Enter OTP<sup>*</sup>{" "}
                </p>
              ) : (
                ""
              )}
              {phone_no?.length == 10 && otpShow ? (
                <div className=" input-border text-black w-full flex items-center my-1">
                  <input
                    type="number"
                    name="otp"
                    placeholder="Enter OTP"
                    className="w-full p-2 text-[.9rem] border-none rounded-lg placeholder:text-[#A2CFDC] outline-none text-[#1687a7] tracking-[20px] "
                    value={otp}
                    onChange={handleOtpChange}
                    onBlur={handleBlur}
                    maxLength="6"
                  />

                  <div className="mr-4">
                    {verifyLoading ? (
                      <CircularProgress size={20} thickness={4} />
                    ) : session_id?.success == 1 ? (
                      <FaCircleCheck className="text-2xl text-green-600" />
                    ) : session_id?.success == 0 ? (
                      <FaCircleXmark className="text-2xl text-red-600" />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
              {errors.otp && touched.otp && phone_no && (
                <p className="text-red-500 text-sm">{errors.otp}</p>
              )}
              {session_id?.success == 0 && (
                <p className="text-red-500 text-sm">
                  You have entered wrong otp !
                </p>
              )}
              <div>
                <p className="text-[1rem] mt-2">
                  Email<sup>*</sup>{" "}
                </p>
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  onFocus={(e) =>
                    e.target.setAttribute("autocomplete", "new-password")
                  }
                  className="w-full my-1 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] "
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div>
                <p className="text-[1rem] mt-2">
                  Password<sup>*</sup>{" "}
                </p>

                {/* <br /> */}

                <div className=" input-border text-black w-full flex items-center my-1  ">
                  <input
                    type={pass ? "password" : "text"}
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-2 text-[.9rem] border-none rounded-lg  placeholder:text-[#A2CFDC] outline-none  text-[#1687a7] "
                  />

                  <div
                    onClick={showPassword}
                    className=" cursor-pointer mx-1 text-[#1687a7]"
                  >
                    {pass ? (
                      <PiEyeSlashThin className="text-2xl" />
                     
                    ) : (
                      <PiEyeThin className="text-2xl" />
                    )}
                  </div>
                </div>

                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <br />
              <p className=" text-[#5a5a5a] ">
                Make your password strong by adding:
              </p>{" "}
              <ul className="text-sm font-extralight space-y-1 my-2">
                <li>
                  <sup>*</sup>Minimum 8 characters (letters & numbers)
                </li>
                <li>
                  <sup>*</sup>Minimum 1 special character (@ # $ % ! ^ & *)
                </li>
                <li>
                  <sup>*</sup>Minimum 1 capital letter (A-Z)
                </li>
                <li>
                  <sup>*</sup>Minimum 1 number (0-9)
                </li>
              </ul>
              <input
                type="submit"
                name="submit"
                value="Submit and Next"
                className="w-full my-2 p-[10px] font-semibold text-[.9rem] text-white bg-[#1687a7] rounded-lg cursor-pointer"
              />
              <p className="text-sm text-center sm:text-left">
                By clicking you agree to our
                <Link to={"/terms-and-conditions"} className="text-[#1687a7]">                
                  Terms & Conditions
                </Link>
                and{" "}
                <Link to={"/privacy-policy"} className="text-[#1687a7]">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>

          <div className="hidden lg:block">
            <img src={personalLogo} alt="ds" className="my-14" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Personal;
