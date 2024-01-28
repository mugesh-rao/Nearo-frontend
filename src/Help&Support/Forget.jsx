import { BsArrowLeft, BsFingerprint } from "react-icons/bs";
import { Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import { forgetPassword } from "../schemas";
import { TfiEmail } from "react-icons/tfi";
import { PiPasswordLight } from "react-icons/pi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { apiRequest } from "../utils/BaseApi.js";
import PropTypes from "prop-types";

const initialValues = {
  newPassword: "",
  confirmPassword: "",
  otp: Array.from({ length: 6 }, () => ""),
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Forget = ({ setForgetOpen }) => {
  Forget.propTypes = {
    setForgetOpen: PropTypes.func.isRequired,
  };

  const [open, setOpen] = useState(false);
  const [see, setSee] = useState({
    a: false,
    b: false,
  });

  const sentOtp = (values) =>
    apiRequest({
      url: "/login/send_otp_forgot_password",
      method: "post",
      data: values,
    });

  const [emailErr, setEmailErr] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (value) => {
      const formData = new FormData();
      formData.append("email", value?.email);
      sentOtp(formData).then((res) => {
        if (res?.data.success == 1) {
          setOpen(true);
          toast.success(res?.data.message);
          // setForgetOpen(false);
        } else {
          setEmailErr(res?.data);
        }
      });
    },
  });
  const forgetPass = (values) =>
    apiRequest({
      url: "/login/verify_and_change_password_forgot_password",
      method: "post",
      data: values,
    });

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldError,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues,
    validationSchema: forgetPassword,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("email", formik.values.email);
      formData.append("otp", values.otp.join(""));
      formData.append("new_password", values?.newPassword);
      forgetPass(formData).then((res) => {
        if (res?.data.success == 1) {
          toast.success(res?.data.message);
          setForgetOpen(false);
        } else {
          toast.error(res?.data.message);
        }
      });
    },
  });

  ///otp field

  const handleFocus = (index) => {
    if (index < values.otp.length - 1 && values.otp[index] !== "") {
      setFieldTouched(`otp[${index}]`, true);
      setFieldError(`otp[${index}]`, undefined);
      setFieldValue(`otp[${index + 1}]`, "");
      inputRefs.current[index + 1].current.focus();
    }
  };

  const inputRefs = useRef(
    Array.from({ length: values.otp.length }, (_, i) => React.createRef())
  );

  const handleChanges = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    setFieldValue(`otp[${index}]`, value);
    setFieldTouched(`otp[${index}]`, true);

    if (value === "" && index > 0) {
      setFieldError(`otp[${index}]`, undefined);
      inputRefs.current[index - 1].current.focus();
    } else if (index < values.otp.length - 1 && value !== "") {
      setFieldTouched(`otp[${index}]`, true);
      inputRefs.current[index + 1].current.focus();
    } else if (index === values.otp.length - 1 && value === "") {
      setFieldValue(`otp[${index}]`, "");
      setFieldTouched(`otp[${index}]`, true);
    }
  };

  return (
    <>
      {open == false && (
        <div>
          <BsFingerprint className=" rounded-lg text-5xl border border-cyan-300 p-2 text-cyan-600" />
          <p className="my-4 text-sm text-[#5a5a0a]">
            No Worries we{`'`}ll send you setup instructions.{" "}
          </p>
          <form action="" className="my-5 " onSubmit={formik.handleSubmit}>
            <input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter Your Email ID"
              className="w-full p-2 border border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 "
              required
            />
            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            ) : (
              emailErr && (
                <p className="text-red-500 text-sm mt-1">
                  {emailErr?.message}{" "}
                </p>
              )
            )}

            <br />
            <br />
            <button
              className="btn1 text-white font-semibold py-[10px] w-full"
              type="submit"
              disabled={!formik.isValid}
            >
              Send OTP
            </button>
          </form>
          <Link to={"/login"}>
            {" "}
            <p className="text-lg font-semibold flex items-center justify-center">
              {" "}
              <BsArrowLeft className="text-xl font-semibold" />
              &nbsp; Back To Log in
            </p>{" "}
          </Link>
        </div>
      )}

      {open && (
        <div>
          <div>
            <TfiEmail className=" rounded-lg text-5xl border border-cyan-300 p-2 text-cyan-600" />

            <div className="custom400:border border-black custom400:p-4 max-w-max mx-auto my-2 mt-4">
              <div className="grid gap-2 c500:grid-cols-6 custom400:grid-cols-5 grid-cols-3">
                {values.otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    className={`w-12 h-12 text-4xl border border-cyan-500 text-cyan-700 text-center focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                      errors.otp && touched.otp && errors.otp[index]
                        ? "border-red-500"
                        : ""
                    }`}
                    value={digit}
                    onChange={(e) => handleChanges(e, index)}
                    onKeyDown={(e) =>
                      e.key >= "0" && e.key <= "9" && handleFocus(index)
                    }
                    ref={inputRefs.current[index]}
                    required
                  />
                ))}
              </div>

              {errors.otp && touched.otp ? (
                <div style={{ color: "red", marginTop: "0.5rem" }}>
                  {errors.otp}
                </div>
              ) : null}
            </div>
          </div>
          {/* passwords  */}
          <br />
          <div>
            <PiPasswordLight className=" rounded-lg text-5xl border border-cyan-300 p-2 text-cyan-600" />
            <h2 className="text-xl sm:text-3xl font-semibold my-2 text-black">
              Set new password
            </h2>
            <p className="text-sm">Must be at least 8 charectors.</p>
            <p className="text-[1rem] font-semibold mt-5">
              New password<sup>*</sup>{" "}
            </p>
            <div
              className="flex items-center "
              style={{ borderBottom: "1px solid gray" }}
            >
              <input
                type={see.a ? "text" : "password"}
                name="newPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.newPassword}
                className=" p-2 focus:outline-none w-full "
              />

              {see.a ? (
                <BsEye
                  onClick={() => setSee({ ...see, a: !see.a })}
                  className="text-xl"
                />
              ) : (
                <BsEyeSlash
                  onClick={() => setSee({ ...see, a: !see.a })}
                  className="text-xl"
                />
              )}
            </div>
            {errors.newPassword && touched.newPassword ? (
              <h5 style={{ color: "red" }} className="text-sm">
                {errors.newPassword}
              </h5>
            ) : (
              ""
            )}
            <p className="text-[1rem] font-semibold mt-5">
              Confirm password<sup>*</sup>{" "}
            </p>
            <div
              className="flex   items-center focus:bg-cyan-100"
              style={{ borderBottom: "1px solid gray" }}
            >
              <input
                type={see.b ? "text" : "password"}
                name="confirmPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                className=" p-2 focus:outline-none w-full "
              />

              {see.b ? (
                <BsEye
                  onClick={() => setSee({ ...see, b: !see.b })}
                  className="text-xl"
                />
              ) : (
                <BsEyeSlash
                  onClick={() => setSee({ ...see, b: !see.b })}
                  className="text-xl"
                />
              )}
            </div>
            {errors.confirmPassword && touched.confirmPassword ? (
              <h5 style={{ color: "red" }} className="my-3 text-sm">
                {errors.confirmPassword}
              </h5>
            ) : (
              ""
            )}
            <button
              onClick={handleSubmit}
              className="w-full text-white btn1   font-semibold mx-auto  my-4"
            >
              Reset Password
            </button>
          </div>
          {/* passwords  */}

          <Link to={"/login"}>
            {" "}
            <p className="text-lg font-semibold flex items-center justify-center mb-8">
              {" "}
              <BsArrowLeft className="text-xl font-semibold" />
              &nbsp; Back To Log in
            </p>{" "}
          </Link>
        </div>
      )}
    </>
  );
};

export default Forget;
