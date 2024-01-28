import { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Link, useNavigate } from "react-router-dom";
import personalLogo from "../img/Humaaans - 2 Characters.png";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { shopSchema } from "../schemas";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
let initialValues = {
  shopName: "",
  category: "",
  GstNumber: "",
  pickup: "",
  shopAdd: "",
  pincode: "",
  city: "",
  state: "",
};

const ShopDetails = () => {
  const { shopData, personalData2 } = useSelector((state) => state.showHide);
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: shopSchema,
      onSubmit: (values2) => {
        Dispatch({ type: "storeShopDetails", payload: { ...values2 } });

        console.log("shop", values);
        Dispatch({ type: "signUp" });
        navigate("/signup/bank_details");
      },
    });

  useEffect(() => {
    Dispatch({
      type: "falselog",
    });
    Dispatch({
      type: "falser",
    });
  });
  const back = () => {
    navigate(-1);
    Dispatch({
      type: "truer",
    });
    Dispatch({
      type: "truelog",
    });
  };

  const category_api = (data) =>
    apiRequest({
      url: `datas/get_product_categories1`,
      method: "post",
      data,
    });
  const queryClient = useQueryClient();

  const { mutate: gate_category1, isLoading } = useMutation(category_api, {
    onSuccess: (data) => {
      console.log(data, "Category data");
      setCategoryData(data?.data?.data);
      queryClient.invalidateQueries("parent_category");
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
  const [categoryData, setCategoryData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("parent_category");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );
  useEffect(() => {
    const formData = new FormData();
    gate_category1(formData);
  }, []);

  return (
    <>
      <div className="shop  mt-20">
        <Button variant="text" sx={{ margin: "-60px 0 0 2%" }} onClick={back}>
          {" "}
          <KeyboardArrowLeftIcon /> Back
        </Button>

        <div className=" flex mx-auto w-[94%] justify-between items-center md:w-1/2 md:mx-12">
          <h1 className="text-2xl font-bold sm:text-3xl ">Shop Details</h1>
          <div>
            <div className="w-[100px] h-2 bg-[#6666] rounded-md">
              <div className="w-[70px] h-2 bg-[#1687a7] rounded-md "></div>
            </div>
            <p className="text-center my-2 text-[#1687a7]"> Step 2/3</p>
          </div>
        </div>

        <div className=" w-[94%] md:w-[74%] lg:w-[94%] rounded-xl mx-auto my-10 GAGAN  py-8 px-3 lg:px-8 lg:flex justify-between ">
          <div className="lg:w-[55%]">
            <form
              action="#"
              onSubmit={handleSubmit}
              className="w-full  text-[#5a5a5a] "
            >
              <div className=" flex flex-col sm:flex-row justify-between ">
                <div className="sm:w-[70%]">
                  <p className="text-[1rem]">
                    Shop Name<sup>*</sup>{" "}
                  </p>
                  <input
                    type="text"
                    name="shopName"
                    autoComplete="off"
                    placeholder="Full Name"
                    value={values.shopName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] capitalize "
                  />
                  {errors.shopName && touched.shopName ? (
                    <p className="text-red-500 text-sm">{errors.shopName}</p>
                  ) : (
                    ""
                  )}
                </div>

                <div className="sm:w-[28%]">
                  <p className="text-[1rem]">
                    Shop Category<sup>*</sup>{" "}
                  </p>

                  <FormControl
                    sx={{
                      m: "5px 0 5px 0",
                      minWidth: "100%",

                      border: "none",
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        { border: "1px solid green" },
                      outline: "none",
                    }}
                    size="small"
                  >
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      name="category"
                      value={values.gst_category_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className=" border-2 border-[#73B7CA] outline-none"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>

                      {categoryData &&
                        categoryData?.map((val) => {
                          return (
                            <MenuItem
                              value={val.product_category_id}
                              key={val.product_category_id}
                            >
                              {val.product_category_title}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                  {errors.category && touched.category ? (
                    <p className="text-red-500 text-sm">{errors.category}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <p className="text-[1rem]">
                Gst Number<sup>*</sup>{" "}
              </p>
              <input
                type="text"
                name="GstNumber"
                placeholder=" Enter Your GST Number"
                value={values.GstNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] "
              />
              {errors.GstNumber && touched.GstNumber ? (
                <p className="text-red-500 text-sm">{errors.GstNumber}</p>
              ) : (
                ""
              )}

              {/* ============ */}
              <p className="text-[1rem]">
                Pickup Address<sup>*</sup>{" "}
              </p>
              <input
                type="text"
                name="pickup"
                placeholder="Enter Pickup Address"
                value={values.pickup}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] "
                autoComplete="new-password"
                onFocus={(e) =>
                  e.target.setAttribute("autocomplete", "new-password")
                }
              />
              {errors.pickup && touched.pickup ? (
                <p className="text-red-500 text-sm">{errors.pickup}</p>
              ) : (
                ""
              )}
              <div>
                <p className="text-[1rem]">
                  Shop Address<sup>*</sup>{" "}
                </p>
                <input
                  type="text"
                  name="shopAdd"
                  placeholder="Enter Shop Address"
                  className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] "
                  value={values.shopAdd}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  onFocus={(e) =>
                    e.target.setAttribute("autocomplete", "new-password")
                  }
                />
                {errors.shopAdd && touched.shopAdd ? (
                  <p className="text-red-500 text-sm">{errors.shopAdd}</p>
                ) : (
                  ""
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-[1rem]">
                    Pincode<sup>*</sup>
                  </p>
                  <input
                    type="number"
                    name="pincode"
                    pattern="[0-9]*"
                    placeholder="Pin Code"
                    value={values.pincode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                    onFocus={(e) =>
                      e.target.setAttribute("autocomplete", "new-password")
                    }
                    className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] "
                  />

                  {errors.pincode && touched.pincode ? (
                    <p className="text-red-500 text-sm">{errors.pincode}</p>
                  ) : (
                    ""
                  )}
                </div>

                <div>
                  <p className="text-[1rem]">
                    City <sup>*</sup>
                  </p>
                  <input
                    type="text"
                    name="city"
                    placeholder="City Name"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                    onFocus={(e) =>
                      e.target.setAttribute("autocomplete", "new-password")
                    }
                    className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7] "
                  />
                  {errors.city && touched.city ? (
                    <p className="text-red-500 text-sm">{errors.city}</p>
                  ) : (
                    ""
                  )}
                </div>

                <div>
                  <p className="text-[1rem]">
                    State<sup>*</sup>
                  </p>
                  <select
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full my-2 p-2 text-[.9rem] input-border  outline-none text-[#1687a7] "
                  >
                    <option value="select">Select</option>
                    <option value="	Andhra Pradesh"> Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="	Assam"> Assam</option>
                    <option value="	Bihar"> Bihar</option>
                    <option value="	Chhattisgarh"> Chhattisgarh</option>
                    <option value="	Goa"> Goa</option>
                    <option value="	Gujarat"> Gujarat</option>
                    <option value="	Haryana"> Haryana</option>
                    <option value="	Himachal Pradesh"> Himachal Pradesh</option>
                    <option value="Jammu and Kashmi">Jammu and Kashmi</option>
                    <option value="	Jharkhand"> Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="	Kerala"> Kerala</option>
                    <option value="	Madhya Pradesh"> Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="	Meghalaya"> Meghalaya</option>
                    <option value="	Mizoram"> Mizoram</option>
                    <option value="	Nagaland"> Nagaland</option>
                    <option value="	Odisha"> Odisha</option>
                    <option value="	Punjab"> Punjab</option>
                    <option value="	Rajasthan"> Rajasthan</option>
                    <option value="	Sikkim"> Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="	Telangana"> Telangana</option>
                    <option value="	Tripura"> Tripura</option>
                    <option value="	Uttar Pradesh"> Uttar Pradesh</option>
                    <option value="	Uttarakhand"> Uttarakhand</option>
                  </select>

                  {errors.state && touched.state ? (
                    <p className="text-red-500 text-sm">{errors.state}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <br />

              <input
                type="submit"
                name="submit"
                value="Submit and Next"
                className="w-full my-2 p-[10px] text-[.9rem] text-white bg-[#1687a7] rounded-lg font-semibold cursor-pointer"
              />
            </form>
            <p className="text-sm text-center sm:text-left">
              By continuing, i agree Nearo s{" "}
              <Link href="#" className="text-[#1687a7]">
                {" "}
                Terms & Conditions{" "}
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[#1687a7]">
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="hidden lg:block my-10">
            <img src={personalLogo} alt="ds" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopDetails;
