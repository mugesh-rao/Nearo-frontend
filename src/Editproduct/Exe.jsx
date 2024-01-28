import { useState, useEffect, useMemo } from "react";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { list_product_schema } from "../schemas";
import { useFormik } from "formik";
import { useParams } from "react-router";

const EditProduct = () => {
  const { product_id } = useParams();
  const queryClient = useQueryClient();
  const get_product = (data) =>
    apiRequest({ url: "products/get_product", method: "post", data });

  const { mutate: get_product_data } = useMutation(
    get_product,
    {
      onSuccess: (data) => {
        console.log(data);
        setProduct_Data(data?.data);
        queryClient.invalidateQueries("add_products");
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
  const [product_Data, setProduct_Data] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("add product");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  useEffect(() => {
    const formData = new FormData();
    formData.append("session_id", "sess_s0n8LZtpnl");
    formData.append("product_id", product_id);
    get_product_data(formData);
  
    
  }, [product_id]);

  console.log(product_Data?.product_data?.product_title);
  const [initialValues, setInitialValues] = useState(
    useMemo(() => {
      if (!product_Data) {
        return null
      }
      return product_Data.product_data;
    }, [product_Data])
  );
//   const values=useMemo(()=>{
//     if(!initialValues){
//         return null
//     }
//     return initialValues
//   },[initialValues])

  let { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: list_product_schema,
      onSubmit: (values) => {
        console.log(values);
      },
    });
  console.log(values, initialValues);


  
  return (
    <div className="my-5">
      <form action="" className="text-sm sm:text-lg">
        {/* ================name================ */}
        <label
          htmlFor="PRODUCT_name"
          className="block sm:flex justify-between items-center "
        >
          <p>
            Name<sup>*</sup>
          </p>
          <input
            type="text"
            name="product_title"
            value={values?.product_title}
            placeholder="Enter Youre Product Name?"
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none sm:w-[85%] "
          />
        </label>

        {errors.product_title && touched.product_title && (
          <p className="text-red-500 text-sm text-left sm:text-center capitalize">
            {errors.product_title}
          </p>
        )}

        <div className="flex justify-between mt-4 items-center">
          <label htmlFor="MRP" className="w-[48%]">
            <p>
              MRP<sup>*</sup>
            </p>
            <input
              type="number"
              name="product_market_price"
              value={values?.product_market_price}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="MRP...."
              className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
            />
            {errors.product_market_price && touched.product_market_price && (
              <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                {errors.product_market_price}
              </p>
            )}
          </label>

          <label htmlFor="discount" className="w-[48%]">
            <p>
              Discount<sup>*</sup>
            </p>
            <input
              type="number"
              placeholder="Discount"
              name="product_discount"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.product_discount}
              className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
            />
            {errors.product_discount && touched.product_discount && (
              <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                {errors.product_discount}
              </p>
            )}
          </label>
        </div>

        <div className="flex justify-between mt-4 items-center">
          <label htmlFor="HSN" className="w-[48%]">
            <p>
              HSN Code<sup>*</sup>
            </p>
            <input
              type="text"
              placeholder="HSN Code..."
              name="hsn_code"
              value={values?.hsn_code}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
            />
            {errors.hsn_code && touched.hsn_code && (
              <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                {errors.hsn_code}
              </p>
            )}
          </label>
        </div>

        <div className="my-2 flex justify-between c500:flex-row text-sm font-semibold">
          <button type="button" className="btn2">
            Clear Details{" "}
          </button>

          <button type="submit" className="btn1" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
