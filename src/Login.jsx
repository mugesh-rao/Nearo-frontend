import { useEffect, useState, startTransition, lazy, Suspense } from "react";
import Button from "@mui/material/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { loginSchema } from "./schemas";
import { apiRequest } from "./utils/BaseApi";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import Cookies from "js-cookie";
import CustomDialog from "./addProduct/component.jsx/modal/dialog/custom-dialog";
const Forget = lazy(() => import("./Help&Support/Forget"));
import Loader from "./utils/Loader";

let initialValues = {
  login: "",
  password: "",
};

const Login = () => {
  // =====================================
  const Dispatch = useDispatch();
  const [pass, showPass] = useState(false);
  const [forgetOpen, setForgetOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    Dispatch({
      type: "trueDash",
    });
    Dispatch({
      type: "falser",
    });
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const loginUser = (values) =>
    apiRequest({
      url: "/login/login",
      method: "post",
      data: values,
    });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: (values) => {
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);

        setLoading(true); // Set loading to true before making the API request

        startTransition(() => {
          loginUser(formData)
            .then((res) => {
              if (res?.data?.success === 1) {
                console.log(res?.data?.session_id);
                Cookies.set("session_id", res?.data?.session_id, {
                  expires: 7,
                });
                Dispatch({ type: "login" });
                Dispatch({ type: "storePersonalDetails", payload: res?.data });
                Dispatch({
                  type: "falseDash",
                });
                navigate(`/${res?.data?.redirect}`);
              } else {
                setLoginError(res?.data?.message);
              }
            })
            .finally(() => {
              setLoading(false); // Set loading to false after the API request is completed
            });
        });
      },
    });

  const back = () => {
    navigate("/");
    Dispatch({
      type: "truer",
    });
  };

  const gotoCreate = () => {
    navigate("/signup/personaldetails");
    Dispatch({
      type: "falselog",
    });
  };

  const showPassword = () => {
    if (pass === true) {
      showPass(false);
    } else {
      showPass(true);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="login mt-8 ">
        <Button variant="text" sx={{ marginLeft: "4%" }} onClick={back}>
          <KeyboardArrowLeftIcon /> Back
        </Button>

        <div className="login-box w-[94%] sm:w-[70%] md:w-[50%] lg:w-[40%] rounded-xl mx-auto -mt-8  mb-10 GAGAN2 py-8 px-3 lg:px-8 ">
          <h2 className="text-center text-2xl font-bold">Login</h2>
          <form
            action=""
            onSubmit={handleSubmit}
            className="w-full  pt-7 text-[#5a5a5a] "
          >
            <p className="text-sm sm:text-lg">Email or Phone Number</p>

            <input
              type="text"
              placeholder="Email ID or Phone Number"
              required
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              onFocus={(e) =>
                e.target.setAttribute("autocomplete", "new-password")
              }
              className="w-full my-1 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] "
            />
            {errors.email && touched.email ? (
              <p className="text-red-500 text-sm">{errors.email}</p>
            ) : (
              ""
            )}

            <p className="text-sm sm:text-lg mt-3">Password</p>

            <div className="input-border text-black w-full flex items-center my-1">
              <input
                type={pass ? "password" : "text"}
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                onFocus={(e) =>
                  e.target.setAttribute("autocomplete", "new-password")
                }
                className="w-full p-2 text-[.9rem] border-none rounded-s-lg placeholder:text-[#A2CFDC] outline-none  text-[#1687a7] "
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

            {errors.password && touched.password ? (
              <p className="text-red-500 text-sm ">{errors.password}</p>
            ) : (
              ""
            )}
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

            <button
              className="text-right text-[1rem] underline hover:no-underline my-4 float-right"
              type="button"
              onClick={() => setForgetOpen(true)}
            >
              Forget password?
            </button>
            <br />

            <input
              type="submit"
              name="submit"
              value="Login"
              className="w-full my-2 p-[10px] text-[.9rem] text-white bg-[#1687a7] rounded-lg font-semibold cursor-pointer"
            />
          </form>
          <div className="create">
            <p className="text-center ">or</p>

            <h4 className="flex items-center justify-center text-[#5a5a5a80]">
              <p className="bg-[#5a5a5a80] h-[1px] w-[25%]"></p> &nbsp;New To
              Nearo &nbsp; <p className="bg-[#5a5a5a80] h-[1px] w-[25%]"></p>
            </h4>
            <br />
            <button
              onClick={gotoCreate}
              className="w-full p-2 text-[.9rem] text-[#1687a7] duration-500 hover:text-white bg-transparent hover:bg-[#1687a7] rounded-lg border border-[#1687a7]"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>

      {forgetOpen && (
        <CustomDialog
          open={forgetOpen}
          onNo={() => setForgetOpen(false)}
          size="medium"
          title="Forget Password?"
          className="w-auto c500:w-[500px] mx-auto h-[550px] "
          fullScreen={false}
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

export default Login;
