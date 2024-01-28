import { useFormik } from "formik";
import { newBank } from "../schemas";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Loader from "../utils/Loader";

const initialValues = {
  newAccount: "",
  newIfsc: "",
  newHolder: "",
};
const Newbank = () => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: newBank,
      onSubmit: (values) => {
        const formData = new FormData();
        formData.append("session_id",  Cookies.get("session_id"));
        formData.append("bank_details_account_no", values.newAccount);
        formData.append("bank_details_account_holder_name", values.newHolder);
        formData.append("bank_details_ifsc_code", values.newIfsc);
        updateBankDetails(formData);
      },
    });

  const sendPasswordData = (data) =>
    apiRequest({
      url: "/settings/change_bank_account_details",
      method: "post",
      data,
    });
  const queryClient = useQueryClient();

  const {
    mutate: updateBankDetails,
    isError,
    error,
    isLoading
  } = useMutation(sendPasswordData, {
    onSuccess: (data) => {
      if(data?.data.success==1){
        toast.success(data?.data.message)
      }else if(data?.data.success==0){
        toast.error(data?.data.message)
      }
      
      queryClient.invalidateQueries("change bank details");
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
if(isLoading){
 return <div className="h-screen flex items-center justify-center w-full">
  <Loader/>
  
 </div>
}
  return (
    <>
      <div className="new-bank">
        <p className="text-[1rem] font-semibold">
          <span>
            New Account Number<sup>*</sup>{" "}
          </span>
        </p>
        <input
          type="number"
          name="newAccount"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.newAccount}
          className=" p-2 focus:outline-none w-full bg-transparent "
          style={{ borderBottom: "1px solid gray" }}
          autoComplete="new-password"
          onFocus={(e) =>
            e.target.setAttribute("autocomplete", "new-password")
          }
        />
        {errors.newAccount && touched.newAccount ? (
          <h5 style={{ color: "red" }} className="error-para">
            {errors.newAccount}
          </h5>
        ) : (
          ""
        )}
        <div className="flex flex-col sm:flex-row justify-between my-2 sm:my-5 ">
          <div className="w-full sm:w-[49%] my-2">
            <p className="text-[1rem] font-semibold">
              Account Holder Name<sup>*</sup>
            </p>
            <input
              type="text"
              name="newHolder"
              value={values.newHolder}
              onBlur={handleBlur}
              onChange={handleChange}
              className=" p-2 focus:outline-none w-full capitalize bg-transparent "
              autoComplete="new-password"
              onFocus={(e) =>
                e.target.setAttribute("autocomplete", "new-password")
              }
              style={{ borderBottom: "1px solid gray" }}
            />

            {errors.newHolder && touched.newHolder ? (
              <h5 style={{ color: "red" }} className="error-para">
                {errors.newHolder}
              </h5>
            ) : (
              ""
            )}
          </div>
          <div className="w-full sm:w-[49%] my-2">
            <p className="text-[1rem] font-semibold">
              IFSC Code<sup>*</sup>{" "}
            </p>
            <input
              type="text"
              name="newIfsc"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.newIfsc}
              className=" p-2 focus:outline-none w-full bg-transparent "
              style={{ borderBottom: "1px solid gray" }}
              autoComplete="new-password"
              onFocus={(e) =>
                e.target.setAttribute("autocomplete", "new-password")
              }
            />
            {errors.newIfsc && touched.newIfsc ? (
              <h5 style={{ color: "red" }} className="error-para">
                {errors.newIfsc}
              </h5>
            ) : (
              ""
            )}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="btn1 w-full sm:w-[240px] font-semibold"
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default Newbank;
