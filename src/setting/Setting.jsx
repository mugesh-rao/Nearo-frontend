import { useState, Fragment, useEffect, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useFormik } from "formik";
import { ChangePass } from "../schemas";
import toast from "react-hot-toast";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";

const Terms = lazy(() => import("./Terms.jsx"));
const Privacy = lazy(() => import("./Privacy.jsx"));
const Newbank = lazy(() => import("./Newbank.jsx"));
import Cookies from "js-cookie";
import Loader from "../utils/Loader.jsx";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog.jsx";
import Forget from "../Help&Support/Forget.jsx";
const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 62,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "400ms",
    "&.Mui-checked": {
      transform: "translateX(36px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const Setting = () => {
  const [see, setSee] = useState({
    a: false,
    b: false,
    c: false,
  });
  const navigate = useNavigate();
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
  const [forgetOpen, setForgetOpen] = useState(false);
  const showpass = (nums) => {
    setSee(nums);
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: ChangePass,
      onSubmit: (values) => {
        const formData = new FormData();
        formData.append("session_id", Cookies.get("session_id"));
        formData.append("old_password", values.oldPassword);
        formData.append("new_password", values.newPassword);
        updatePassword(formData);
      },
    });

  const send_temporary = (data) =>
    apiRequest({
      url: `/settings/temporary_off`,
      method: "post",
      data,
    });
  const get_temporary = (data) =>
    apiRequest({
      url: `/settings/get_shop_temp_off_details`,
      method: "post",
      data,
    });

  const queryClient = useQueryClient();
  const [tempSwitch, setTempSwitch] = useState(null);
  const {
    mutate,
    isError,
    error,
    isLoading: temp_load,
  } = useMutation(send_temporary, {
    onSuccess: (data) => {
      setTempSwitch(data?.data?.message);
      queryClient.invalidateQueries("temporary off");
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
  const [temporary, setTemporary] = useState();
  const { mutate: get_temporary_data, isLoading: temp_loader } = useMutation(
    get_temporary,
    {
      onSuccess: (data) => {
        setTemporary(data?.data?.data);

        queryClient.invalidateQueries("temporary off");
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
  useEffect(() => {
    const formData = new FormData();
    formData.append("session_id", Cookies.get("session_id"));
    // formData.append("temporary_off", 1);
    get_temporary_data(formData);
  }, [tempSwitch]);

  // useEffect(()=>{
  //   temporaryOFF()
  // },[])
  const temporaryOFF = () => {
    const formData = new FormData();
    formData.append("session_id", Cookies.get("session_id"));
    formData.append("temporary_off", temporary?.is_temporary_off == 1 ? 0 : 1);
    mutate(formData);
  };

  const sendPasswordData = (data) =>
    apiRequest({
      url: "/settings/change_password",
      method: "post",
      data,
    });

  const {
    mutate: updatePassword,
    isLoading,
    isError: passError,
    error: passErr,
  } = useMutation(sendPasswordData, {
    onSuccess: (data) => {
      if (data?.data?.success == 0) {
        toast.error(data?.data?.message);
      } else if (data?.data?.success == 1) {
        toast.success(data?.data?.message);
        navigate("/login");
      }
      queryClient.invalidateQueries("change password");
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

  function Icon({ id, open }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          id === open ? "rotate-180" : ""
        } h-5 w-5 transition-transform`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    );
  }

  if (temp_load || temp_loader) {
    return (
      <div className="h-screen flex items-center justify-center">
      <Loader/>
      
     </div>
    );
  }

  return (
    <>
      <div className="px-5   ">
        <h1 className="text-2xl sm:text-3xl text-[#1687a7] sm:text-black font-semibold my-8">
          Settings
        </h1>
        <br />
        {/* <div className="flex justify-between items-center my-3 ">
          <h3 className="text-lg sm:text-xl font-semibold">Notification</h3>
          <FormControlLabel control={<IOSSwitch defaultChecked />} />
        </div> */}
        {/* <hr />
        <br /> */}
        <div className="flex justify-between items-center my-3">
          <h3 className="text-lg sm:text-xl font-semibold">Temporary off</h3>
          <FormControlLabel
            control={
              <IOSSwitch
                checked={temporary?.is_temporary_off == 1 ? true : false}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            onClick={temporaryOFF}
          />
        </div>
        <hr />
        <Fragment>
          <Accordion
            open={open === 1}
            icon={<Icon id={1} open={open} />}
            className=" my-5  "
          >
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="text-lg sm:text-xl font-semibold"
            >
              Change Password
            </AccordionHeader>
            <AccordionBody>
              {!isLoading ? (
                <div>
                  <div className="flex justify-between ">
                    <p className="text-[1rem] font-semibold">
                      Current Password<sup>*</sup>{" "}
                    </p>
                    <p className="underline cursor-pointer" onClick={()=>setForgetOpen(true)}>
                      Forget Password ?
                    </p>
                  </div>
                  <div
                    className="flex my-3 items-center "
                    style={{ borderBottom: "1px solid gray" }}
                  >
                    <input
                      type={see.a ? "text" : "password"}
                      name="oldPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.oldPassword}
                      autoComplete="new-password"
                      onFocus={(e) =>
                        e.target.setAttribute("autocomplete", "new-password")
                      }
                      className=" p-2 focus:outline-none w-full bg-transparent "
                    />
                    {see.a ? (
                      <BsEye
                      onClick={() => setSee({ ...see, a: false })}
                        className="text-xl"
                      />
                    ) : (
                      <BsEyeSlash
                      onClick={() => setSee({ ...see, a:true })}
                        className="text-xl"
                      />
                    )}
                  </div>
                  {errors.oldPassword && touched.oldPassword ? (
                    <h5 style={{ color: "red" }} className="error-para">
                      {errors.oldPassword}
                    </h5>
                  ) : (
                    ""
                  )}
                  <p className="text-[1rem] font-semibold mt-5">
                    New password<sup>*</sup>{" "}
                  </p>
                  <div
                    className="flex my-3 items-center "
                    style={{ borderBottom: "1px solid gray" }}
                  >
                    <input
                      type={see.b ? "text" : "password"}
                      name="newPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.newPassword}
                      autoComplete="new-password"
                      onFocus={(e) =>
                        e.target.setAttribute("autocomplete", "new-password")
                      }
                      className=" p-2 focus:outline-none w-full bg-transparent "
                    />

                    {see.b ? (
                      <BsEye
                        onClick={() => setSee({ ...see, b: false })}
                        className="text-xl"
                      />
                    ) : (
                      <BsEyeSlash
                      onClick={() => setSee({ ...see, b: true })}
                        className="text-xl"
                      />
                    )}
                  </div>
                  {errors.newPassword && touched.newPassword ? (
                    <h5 style={{ color: "red" }} className="error-para">
                      {errors.newPassword}
                    </h5>
                  ) : (
                    ""
                  )}
                  <p className="text-[1rem] font-semibold mt-5">
                    Confirm password<sup>*</sup>{" "}
                  </p>
                  <div
                    className="flex  my-3 items-center focus:bg-cyan-100"
                    style={{ borderBottom: "1px solid gray" }}
                  >
                    <input
                      type={see.c ? "text" : "password"}
                      name="confirmPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirmPassword}
                      autoComplete="new-password"
                      onFocus={(e) =>
                        e.target.setAttribute("autocomplete", "new-password")
                      }
                      className=" p-2 focus:outline-none w-full bg-transparent "
                    />

                    {see.c ? (
                      <BsEye
                      onClick={() => setSee({ ...see, c: false })}
                        className="text-xl"
                      />
                    ) : (
                      <BsEyeSlash
                      onClick={() => setSee({ ...see, c: true })}
                        className="text-xl"
                      />
                    )}
                  </div>
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <h5 style={{ color: "red" }} className="my-3">
                      {errors.confirmPassword}
                    </h5>
                  ) : (
                    ""
                  )}
                  <p className="last-para">
                    Make your password strong by adding:
                  </p>{" "}
                  <ul>
                    <li>Minimum 8 characters (letters & numbers)</li>
                    <li>Minimum 1 special character (@ # $ % ! ^ & *)</li>
                    <li>Minimum 1 capital letter (A-Z)</li>
                    <li>Minimum 1 number (0-9)</li>
                  </ul>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn1 my-5 w-full sm:w-[230px] font-semibold"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <h1 className=" h-full w-full bg-white text-2xl ">
                  Loading...
                </h1>
              )}
            </AccordionBody>
          </Accordion>

          <Accordion
            open={open === 2}
            icon={<Icon id={2} open={open} />}
            className=" my-5"
          >
            <AccordionHeader
              onClick={() => handleOpen(2)}
              className="text-lg sm:text-xl font-semibold"
            >
              Change Bank Account
            </AccordionHeader>
            <AccordionBody>
              <Suspense fallback={"loading..."}>
                <Newbank />
              </Suspense>
            </AccordionBody>
          </Accordion>

          <Accordion
            open={open === 3}
            icon={<Icon id={3} open={open} />}
            className=" my-5"
          >
            <AccordionHeader onClick={() => handleOpen(3)}>
              Terms & Conditions
            </AccordionHeader>
            <AccordionBody>
              <Suspense fallback={"loading..."}>
                <Terms />
              </Suspense>
            </AccordionBody>
          </Accordion>
          <Accordion
            open={open === 4}
            icon={<Icon id={4} open={open} />}
            className=" my-5"
          >
            <AccordionHeader onClick={() => handleOpen(4)}>
              Privacy Policy
            </AccordionHeader>
            <AccordionBody>
              <Suspense fallback={"loading..."}>
                <Privacy />
              </Suspense>
            </AccordionBody>
          </Accordion>
        </Fragment>
      </div>



      {forgetOpen && (
        <CustomDialog
          open={forgetOpen}
          onNo={() => setForgetOpen(false)}
          size="medium"
          title="Forget Password?"
          fullScreen={false}
          className="w-auto c500:w-[500px] mx-auto h-[550px] "
        >
          <Suspense
            fallback={
              <div className="flex justify-center">
                <Loader />
              </div>
            }
          >
            <Forget setForgetOpen={setForgetOpen} />
          </Suspense>
        </CustomDialog>
      )}
    </>
  );
};

export default Setting;
