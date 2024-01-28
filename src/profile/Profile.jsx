import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  lazy,
  startTransition,
} from "react";
import Button from "@mui/material/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import a from "../profile/images/Group 1000003812 (1).jpg";
import photo from "../profile/images/shop profile.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { getSessionId } from "../utils/get_session_id.js";
const Loader = lazy(() => import("../utils/Loader.jsx"));
import LazyLoadImage from "../Orders/LazyLoadImage";
import Caoursels from "./Caoursel.jsx";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog.jsx";
import Maps from "./Maps.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const [schedule, setSchedule] = useState([]);


  const back = () => {
    startTransition(() => navigate("/dashboard/"));
  };
  const Dispatch = useDispatch();
  useEffect(() => {
    Dispatch({
      type: "falseDash",
    });
  }, []);

  const post_session_id = (data) =>
    apiRequest({ url: "/shop/get_shop_details", method: "post", data });
  const queryClient = useQueryClient();
  const get_shop_details = useMutation(post_session_id, {
    onSuccess: (data) => {
      setShopdata(data?.data?.data);
      setSchedule(data?.data?.data?.shop_timings || []);
      queryClient.invalidateQueries("shop_details");
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

  const [shop_data, setShopdata] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );
  const [isLoading, setIsLoading] = useState(true);
  const category_api = (data) =>
    apiRequest({ url: "/datas/get_product_categories1", method: "post", data });

  const get_category = useMutation(category_api, {
    onSuccess: (data) => {
      setCategoryData(data?.data?.data);
      queryClient.invalidateQueries("session_id");
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
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      get_shop_details.mutate(formData);
      get_category.mutate();
      setIsLoading(false);
    }
  }, [sessionId]);

  const BannerArr = () => {
    return shop_data?.banner_images && shop_data?.banner_images.split(",");
  };

  const category = categoryData?.filter((a) => {
    return a.product_category_id === shop_data?.shop_category;
  });

  if (isLoading) {
    return (
      <div className="h-screen grid place-items-center absolute bg-white z-20 top-0 right-0 bottom-0 left-0">
        <Suspense fallback={<div>Loading...</div>}>
          <Loader />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      <Button variant="text" sx={{ margin: "12px 4%" }} onClick={back}>
        <KeyboardArrowLeftIcon /> Back
      </Button>
      <div>
        <div className="slider border border-2">
          <div>
            <Caoursels newBanner={BannerArr()} />
            <div className="relative -top-24 md:-top-28 md:left-28 left-8 c500:left-14  z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full ">
              <LazyLoadImage
                src={shop_data?.main_image ? shop_data?.main_image : photo}
                alt="profile"
                className="w-full h-full border-[5px] sm:border-[7px] border-white rounded-full bg-white"
              />
            </div>
            <br />
          </div>

          <div className="flex justify-end">
            <NavLink to={"/shop/editprofile"}>
              <button
                className="mr-4 c500:mr-16 -mt-24 custom400:-mt-28 md:-mt-36 text-sm px-8 c500:px-10 py-2 input-border text-[#1687a7] hover:bg-[#1687a7] hover:text-white  duration-700 float-right font-semibold "
                type="submit"
              >
                Edit Profile
              </button>
            </NavLink>
          </div>
          <div className="w-[96%] GAGAN mx-auto px-4 py-8 rounded-lg sm:w-[90%] md:w-[800px] -mt-4 c400:-mt-12 sm:-mt-[87px] md:-mt-24">
            <label
              htmlFor="shop"
              className="block sm:flex items-center justify-between w-full "
            >
              <p>Shop Name </p>
              <input
                value={shop_data?.shop_name}
                type="text"
                name="shopName"
                className="w-full my-2 p-2 text-[.9rem] black_border sm:w-[78%] capitalize"
                readOnly
              />
            </label>
            <label
              htmlFor="shop contact"
              className="block sm:flex items-center justify-between w-full "
            >
              <p>Shop Contact </p>
              <input
                value={shop_data?.shop_contact}
                type="text"
                name="shopName"
                className="w-full my-2 p-2 text-[.9rem] black_border sm:w-[78%]"
                readOnly
              />
            </label>

            <label
              htmlFor="category"
              className="block sm:flex items-center justify-between w-full "
            >
              <p> Shop Category </p>
              <input
                value={category ? category[0]?.product_category_title : ""}
                type="text"
                readOnly
                name="shopCategory"
                className="w-full my-2 p-2 text-[.9rem] black_border sm:w-[78%] capitalize"
              />
            </label>

            <label
              htmlFor="shop address"
              className="block sm:flex items-center justify-between w-full "
            >
              <p> Shop Address </p>
              <input
                value={shop_data?.shop_address}
                type="text"
                name="shopAddress"
                readOnly
                className="w-full my-2 p-2 text-[.9rem] black_border sm:w-[78%] capitalize"
              />
            </label>

            <label
              htmlFor=""
              className="block sm:flex items-center justify-between w-full "
            >
              <p> Pickup Address </p>
              <input
                value={shop_data?.shop_pickup_address}
                type="text"
                name="pickupAddress"
                readOnly
                className="w-full my-2 p-2 text-[.9rem] black_border sm:w-[78%] capitalize"
              />
            </label>

            {/* <label
              htmlFor=""
              className="block sm:flex justify-between items-center"
            >
              <p>Delivery Charges</p>
              <input
                value={
                  shop_data?.delivery_charges_pay == 1
                    ? "Customer will pay"
                    : "I will pay"
                }
                type="text"
                name="deliveryCharges"
                readOnly
                className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7]  sm:w-[78%]"
              />
            </label> */}

            <label
              htmlFor="timings"
              className="block sm:flex justify-between w-full my-4"
            >
              <p> Shop Timings </p>
              <div className="flex items-center sm:w-[78%] md:justify-between flex-col">
                {schedule.length > 0
                  ? schedule.map((data, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-around w-full"
                        >
                          <div className="md:w-[40%]">
                            <input
                              placeholder="Days"
                              type="text"
                              name="days"
                              value={data.d}
                              className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7]"
                              readOnly
                            />
                          </div>
                          <p className="mx-1"> /</p>
                          {data.s === "off" ? (
                            <div className="w-full flex items-center justify-around border p-1 rounded border-2 border-[#A2CFDC]">
                              Off
                            </div>
                          ) : (
                            <div className="w-full flex items-center justify-around">
                              <input
                                placeholder="Opening Time"
                                type="text"
                                readOnly
                                value={data.o}
                                name="openTime"
                                className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7]  "
                              />
                              <p className="mx-1"> : </p>
                              <input
                                placeholder="Closing time"
                                type="text"
                                name="closeTime"
                                value={data.c}
                                readOnly
                                className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7]  "
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  : "Please set the timings first"}
              </div>
            </label>
            <br />
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
