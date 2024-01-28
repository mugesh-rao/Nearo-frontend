import { startTransition, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import personalLogo from "../img/bank.png";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { bankSchema } from "../schemas";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { RxCrossCircled } from "react-icons/rx";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import Loader from "../utils/Loader";

let initialValues = {
  account: "",
  holder: "",
  ifsc: "",
  pan: "",
  file: null,
};

const Bank = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [img, setImg] = useState(null);

  useEffect(() => {
    dispatch({
      type: "falselog",
    });
    dispatch({
      type: "falser",
    });
  }, []);

  const back = () => {
    navigate(-1);
    dispatch({
      type: "truer",
    });
    dispatch({
      type: "truelog",
    });
  };
  const { shopData, personalData2 } = useSelector((state) => state.showHide);

  const addSellerDetails = (data) =>
    apiRequest({
      url: "/login/register",
      method: "post",
      data,
    });
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError } = useMutation(addSellerDetails, {
    onSuccess: (response) => {
      console.log(response.data.message);

      if (response?.data.success == 0) {
        toast.error(response?.data.message);
        navigate("/signup/personaldetails");
      } else if (response?.data.success == 1) {
        toast.success(response?.data.message);
        startTransition(() => {
          dispatch({ type: "signUp" });
          navigate("/signup/sucess");
        });
      }
      queryClient.invalidateQueries("seller_details");
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

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: bankSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      //personal details
      formData.append("session_id", personalData2?.session_id);
      formData.append("name", personalData2?.name);
      formData.append("email", personalData2?.email);
      formData.append("phone_no", personalData2?.phoneNumber);
      formData.append("password", personalData2?.password);
      //shopDetails
      formData.append("shop_name", shopData?.shopName);
      formData.append("shop_category", shopData?.category);
      formData.append("gst_number", shopData?.GstNumber);
      formData.append("seller_shop_pickup_add_line1", shopData?.pickup);
      formData.append("seller_shop_add_line1", shopData?.shopAdd);
      formData.append("pincode", shopData?.pincode);
      formData.append("city", shopData?.city);
      formData.append("state", shopData?.state);
      //bankdetails
      formData.append("bank_details_account_no", values?.account);
      formData.append("bank_details_account_holder_name", values?.holder);
      formData.append("bank_details_ifsc_code", values?.ifsc);
      formData.append("bank_details_pan_number", values?.pan);
      formData.append("signature", values?.file);
      mutate(formData);
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
      <Loader />
    </div>
    );
  }
  if (isError) {
    console.log(isError);
  }

  return (
    <>
      {!isLoading && (
        <div className="bank mt-20">
          <Button variant="text" sx={{ margin: "-60px 0 0 2%" }} onClick={back}>
            <KeyboardArrowLeftIcon /> Back
          </Button>

          <div className=" flex mx-auto w-[94%] justify-between items-center md:w-1/2 md:mx-12">
            <h1 className="text-2xl font-bold sm:text-3xl ">Bank Details</h1>
            <div>
              <div className="w-[100px] h-2 bg-[#6666] rounded-md">
                <div className="w-[100px] h-2 bg-[#1687a7] rounded-md "></div>
              </div>
              <p className="text-center my-2 text-[#1687a7]"> Step 3/3</p>
            </div>
          </div>

          <div className=" w-[94%] md:w-[74%] lg:w-[94%] rounded-xl mx-auto my-10 GAGAN  py-8 px-3 lg:px-8 lg:flex justify-between ">
            <div className="lg:w-[55%]">
              <form
                action="#"
                onSubmit={handleSubmit}
                className="w-full  text-[#5a5a5a] "
              >
                <p className="text-[1rem]">
                  Account Number<sup>*</sup>{" "}
                </p>
                <input
                  type="number"
                  name="account"
                  autoComplete="off"
                  placeholder="Account Number"
                  value={values.account}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] "
                />
                {errors.account && touched.account && (
                  <p className="text-red-500 text-sm">{errors.account}</p>
                )}

                <div className=" account">
                  <div>
                    <p className="text-[1rem]">
                      Account Holder Name<sup>*</sup>{" "}
                    </p>
                    <input
                      type="text"
                      name="holder"
                      placeholder="Account Holder Name"
                      value={values.holder}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] "
                    />

                    {errors.holder && touched.holder && (
                      <p className="text-red-500 text-sm">{errors.holder}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-[1rem]">
                      IFSC Code<sup>*</sup>{" "}
                    </p>

                    <input
                      type="text"
                      name="ifsc"
                      placeholder="IFSC Code"
                      value={values.ifsc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7]"
                    />

                    {errors.ifsc && touched.ifsc && (
                      <p className="text-red-500 text-sm">{errors.ifsc}</p>
                    )}
                  </div>
                </div>

                <p className="text-[1rem]">
                  PAN Number<sup>*</sup>{" "}
                </p>

                <input
                  type="text"
                  name="pan"
                  placeholder="PAN Number"
                  value={values.pan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] uppercase "
                />
                {errors.pan && touched.pan && (
                  <p className="text-red-500 text-sm">{errors.pan}</p>
                )}
                <p className="text-[1rem]">Upload Signature</p>

                {!img ? (
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    sx={{ height: "38px", color: "#1687a7", marginTop: "4px" }}
                    className="w-full   custom400:w-1/2  text-[#1687a7] "
                  >
                    <UploadFileIcon /> &nbsp; Upload Here
                    <input
                      hidden
                      accept="image/*"
                    
                      type="file"
                      name="file"
                      onChange={(event) => {
                        handleChange(event);
                        const selectedFile = event.currentTarget.files[0];
                        setImg(selectedFile);
                        setFieldValue("file", selectedFile);
                      }}
                      onBlur={handleBlur}
                    />
                  </Button>
                ) : (
                  <div className="h-24 w-24 relative my-4 ">
                    <RxCrossCircled
                      className="text-2xl bg-cyan-500 rounded-full text-white float-right text-right absolute -right-2 -top-2 cursor-pointer"
                      onClick={() => setImg(null)}
                    />
                    <img
                      src={img && URL.createObjectURL(img)}
                      alt={"signature"}
                      className="h-full w-full border-dashed input-border"
                    />
                  </div>
                )}

                {errors.file && touched.file && (
                  <p className="text-red-500 text-sm">{errors.file}</p>
                )}

                <input
                  type="submit"
                  name="submit"
                  value="Submit"
                  className="w-full my-8 p-[10px] text-[.9rem] text-white bg-[#1687a7] rounded-lg font-semibold cursor-pointer"
                />
              </form>
            </div>

            <div className="hidden lg:block my-10">
              <img src={personalLogo} alt="ds" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bank;
