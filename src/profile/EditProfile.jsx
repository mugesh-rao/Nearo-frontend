import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import "../profile/profile.css";
import banner_img from "../profile/images/Group 1000003812 (1).jpg";
import { redirect, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { profileSchema } from "../schemas";
import { useDispatch } from "react-redux";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import Menu from "@mui/material/Menu";
import toast from "react-hot-toast";
import { getSessionId } from "../utils/get_session_id";
import LazyLoadImage from "../Orders/LazyLoadImage";
import Loader from "../utils/Loader";
import photo from "../profile/images/shop profile.png";
import Caoursels from "./Caoursel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog";
import Maps from "./Maps";

const EditProfile = () => {
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const queryClient = useQueryClient();
  const [schedule, setSchedule] = useState([]);
  const [openLocation, setOpenLocation] = useState(false);

  const [blankSchedule, setBlankSchedule] = useState([
    { d: "Mon", o: "12:00 AM", c: "10:00 PM", s: "on" },
    { d: "Tue", o: "12:00 AM", c: "10:00 PM", s: "off" },
    { d: "Wed", o: "12:00 AM", c: "10:00 PM", s: "on" },
    { d: "Thu", o: "12:00 AM", c: "10:00 PM", s: "on" },
    { d: "Fri", o: "12:00 AM", c: "10:00 PM", s: "on" },
    { d: "Sat", o: "12:00 AM", c: "10:00 PM", s: "on" },
    { d: "Sun", o: "12:00 AM", c: "10:00 PM", s: "on" },
  ]);

  const back = () => {
    navigate(-1);
  };

  const Dispatch = useDispatch();
  useEffect(() => {
    Dispatch({
      type: "falseDash",
    });
  }, []);

  const post_session_id = (data) =>
    apiRequest({ url: "/shop/get_shop_details", method: "post", data });
  const get_shop_details = useMutation(post_session_id, {
    onSuccess: (data) => {
      setShopdata(data?.data?.data);
      setValues(data?.data?.data);
      setSchedule(data?.data?.data?.shop_timings);
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

  //profile all data api we have to sent all the data with this api
  const profile_api = (data) =>
    apiRequest({ url: "/shop/update_shop", method: "post", data });

  const { mutate: post_profile_data, isLoading: profile_loading } = useMutation(
    profile_api,
    {
      onSuccess: (data) => {
        if (data?.data.status) {
          toast.success(data?.data?.message);
          return Dispatch({ type: "profileCompleted" });
        } else {
          toast.error(data?.data?.message);
        }
        queryClient.invalidateQueries("profile_data");
      },
      onError: (err) => {
        toast.err(err);
      },
    }
  );

  //using use memohook we are storing the response data of api
  const [categoryData, setCategoryData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );
  //we are psoting our session id for api requesting
  const [isLoading, setIsLoading] = useState(true);

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
  const [banners, setBanners] = useState([]);
  const [updateBanner, setUpdateBanner] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [profile_pic, setProfile_pic] = useState("");
  const [initialValues, setIntialValue] = useState({
    shop_name: "",
    shop_category: 0,
    shop_pincode: 0,
    shop_city: "",
    shop_state: "",
    shop_pickup_address: "",
    shop_address: "",
    shop_contact: "",
    delivery_charges_pay: 0,
    shop_timings: "[]",
  });

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: profileSchema,
    onSubmit: (values) => {
      setIntialValue(values);
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("shop_name", values.shop_name);
      formData.append("shop_address", values.shop_address);
      formData.append("shop_pickup_address", values.shop_pickup_address);
      formData.append("shop_pincode", values.shop_pincode);
      formData.append("shop_state", values.shop_state);
      formData.append("shop_contact", values.shop_contact);
      formData.append("shop_city", values.shop_city);
      formData.append("shop_category", values.shop_category);
      formData.append("delivery_charges_pay", values.delivery_charges_pay);
      formData.append(
        "shop_timings",
        JSON.stringify(
          handleTimeFormat(schedule.length > 0 ? schedule : blankSchedule)
        )
      );
      post_profile_data(formData);
      //add banner
      const formData2 = new FormData();
      formData2.append("session_id", sessionId);
      if (banners?.length > 0) {
        for (let i = 0; i < banners?.length; i++) {
          formData2.append(`banner_images[]`, banners[i]);
        }
        add_banner(formData2);
      }
      //banner update
      if (updateBanner) {
        const formData3 = new FormData();
        formData3.append("session_id", sessionId);
        formData3.append("image_indexs", selectedImageIndex);
        formData3.append("banner_images[]", updateBanner);
        update_banner(formData3);
      }

      //add profile pic
      if (profile_pic) {
        const formData = new FormData();
        formData.append("session_id", sessionId),
          formData.append("main_image", profile_pic),
          post_main_image(formData);
      }

      navigate("/shop/profile");
    },
  });

  const [newBanner, setNewBanner] = useState([]);

  useEffect(() => {
    // Update newBanner with the split values
    setNewBanner(values?.banner_images ? values?.banner_images.split(",") : []);
    values?.main_image
      ? setProfile_pic(values?.main_image ? values.main_image : "")
      : setProfile_pic(photo);
  }, [values?.banner_images, values?.main_image]);

  useEffect(() => {
    // Check if newBanner is an array before filtering
    if (Array.isArray(newBanner)) {
      // Check if the new files are valid images and have different names than the existing ones
      const uniqueAndValidNewBanner = newBanner.filter((newFile) => {
        const isUnique = !banners.some(
          (existingFile) => existingFile.name === newFile.name
        );

        return isUnique;
      });
      setNewBanner([...uniqueAndValidNewBanner, ...banners]);
    }
  }, [banners]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const post_banner_api = (data) =>
    apiRequest({ url: "/shop/add_banner_image", method: "post", data });

  const { mutate: add_banner, isLoading: banner_loading } = useMutation(
    post_banner_api,
    {
      onSuccess: (data) => {
        if (data?.data.status == 1) {
          setBanners([]);
        }

        queryClient.invalidateQueries("banner_data");
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

  //profile add banner image
  const upload_banner = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Check if the new files are valid images and have different names than the existing ones
    const uniqueAndValidFiles = selectedFiles.filter((newFile) => {
      const isImage = newFile.type.startsWith("image/");
      const isUnique = !banners.some(
        (existingFile) => existingFile.name === newFile.name
      );

      return isImage && isUnique;
    });

    if (uniqueAndValidFiles.length > 0) {
      setBanners([...banners, ...uniqueAndValidFiles]);

      handleClose();
    } else {
      toast.error("Invalid or duplicate image files", {
        position: "top-right",
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // update banner image indexwise

  const update_banner_api = (data) =>
    apiRequest({ url: "/shop/update_banner_image", method: "post", data });

  const { mutate: update_banner, isLoading: update_loading } = useMutation(
    update_banner_api,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("banner_data");
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

  //delete banner image index wise

  const delet_banner_api = (data) =>
    apiRequest({ url: "/shop/remove_banner_image", method: "post", data });

  const { mutate: delete_banners, isLoading: delete_loading } = useMutation(
    delet_banner_api,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("banner_data");
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
  const delete_banner = () => {
    // console.log("Deleting image at index:", selectedImageIndex);

    // Remove the selected image from newBanner
    const delete_file = newBanner.filter((_, i) => i !== selectedImageIndex);

    // Calculate the new selectedImageIndex after deletion
    let newSelectedImageIndex = selectedImageIndex;
    if (selectedImageIndex === newBanner.length - 1) {
      // If the last image was deleted, update the index to the previous one
      newSelectedImageIndex = Math.max(0, newBanner.length - 2);
    }

    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("image_index", selectedImageIndex);
    delete_banners(formData);

    // console.log("delete files", delete_file);
    setBanners(delete_file);
    setNewBanner(delete_file);
    setSelectedImageIndex(newSelectedImageIndex); // Update the selected image index
  };

  //profile main image
  const post_mainImage_api = (data) =>
    apiRequest({ url: "/shop/update_main_image", method: "post", data });
  const { mutate: post_main_image, isLoading: main_image_loading } =
    useMutation(post_mainImage_api, {
      onSuccess: (data) => {
        // console.log(data);
        queryClient.invalidateQueries("main_image");
      },
    });

  const handleChangeProfile = (event) => {
    const file = event.target.files[0];
    setProfile_pic(file);
  };

  const handleTimeChange = (e, id) => {
    const { name, value } = e.target;
    const list = [...schedule];
    list[id][name] = value;
    setSchedule(list);
  };

  const handleTimeChangeBlank = (e, id) => {
    const { name, value } = e.target;
    const list = [...schedule];
    list[id][name] = value;
    setBlankSchedule(list);
  };

  const handleOnOf = (e, id) => {
    const { name, value } = e.target;
    const list = [...schedule];
    if (e.target.checked) {
      list[id][name] = "on";
      setSchedule(list);
    } else {
      list[id][name] = "off";
      setSchedule(list);
    }
  };

  const handleOnOfBlank = (e, id) => {
    const { name, value } = e.target;
    const list = [...blankSchedule];
    if (e.target.checked) {
      list[id][name] = "on";
      setBlankSchedule(list);
    } else {
      list[id][name] = "off";
      setBlankSchedule(list);
    }
  };

  function convertTo24HourFormat(timeString) {
    // Split the input time string into components
    const [time, period] = timeString.split(" ");

    // Split the time into hours and minutes
    const [hours, minutes] = time.split(":");

    // Convert hours to 24-hour format
    let convertedHours = parseInt(hours, 10);

    // Adjust hours for PM if needed
    if (period === "PM" && convertedHours !== 12) {
      convertedHours += 12;
    }

    // Pad single-digit hours and minutes with leading zeros
    const formattedHours = convertedHours.toString().padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");

    // Concatenate hours and minutes
    const formattedTime = `${formattedHours}:${formattedMinutes}`;

    return formattedTime;
  }

  const handleTimeFormat = (inputArray) => {
    const outputArray = [];
    for (const dayObj of inputArray) {
      if (dayObj.s === "on") {
        outputArray.push([
          convertTo24HourFormat(dayObj.o),
          convertTo24HourFormat(dayObj.c),
        ]);
      } else {
        outputArray.push("off");
      }
    }

    return outputArray;
  };

  if (
    isLoading ||
    profile_loading ||
    banner_loading ||
    main_image_loading ||
    delete_loading ||
    update_loading
  ) {
    return (
      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Button variant="text" sx={{ margin: "12px 4%" }} onClick={back}>
        <KeyboardArrowLeftIcon /> Back
      </Button>

      <div>
        <div>
          <div className="realative ">
            <div className="up-btn-0 absolute z-10 left-[80%] sm:left-[90%] ">
              <Button
                component="label"
                size="small"
                sx={{
                  height: "100%",
                  width: "100%",
                  color: "white",
                  borderRadius: "50%",
                }}
                onClick={handleClick}
              >
                <HiOutlinePencilSquare className="text-xl" />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem>
                  {" "}
                  <Button
                    component="label"
                    size="small"
                    sx={{
                      height: "100%",
                      width: "100%",
                      color: "black",
                      textTransform: "capitalize",
                    }}
                  >
                    Upload Banner
                    <input
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                      name="banner"
                      onChange={upload_banner}
                    />
                  </Button>
                </MenuItem>
                <MenuItem>
                  {" "}
                  <Button
                    component="label"
                    size="small"
                    sx={{
                      height: "100%",
                      width: "100%",
                      color: "black",
                      textTransform: "capitalize",
                    }}
                    disabled={newBanner.length === 0}
                  >
                    Update Banner
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      name="banner"
                      onChange={(event) => {
                        const file = event.target.files[0];
                        if (
                          file &&
                          file.type &&
                          file.type.startsWith("image/")
                        ) {
                          const updatedImages = [...newBanner];
                          updatedImages[selectedImageIndex] = file;
                          setUpdateBanner(updatedImages[selectedImageIndex]);
                          setNewBanner(updatedImages);
                        }
                        handleClose();
                      }}
                    />
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose} className="text-center w-full">
                  <Button
                    component="label"
                    size="small"
                    sx={{
                      height: "100%",
                      width: "100%",
                      color: "black",
                      textTransform: "capitalize",
                    }}
                    onClick={delete_banner}
                    disabled={!values?.banner_images}
                  >
                    Delete Banner
                  </Button>
                </MenuItem>

                {/* <MenuItem className="flex space-x-8"><button>Cancel</button> <button>Save</button>  </MenuItem> */}
              </Menu>
            </div>

            <Caoursels newBanner={newBanner} />

            <div className="relative -top-24 md:-top-28 md:left-28 left-8 c500:left-14  z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full ">
              <LazyLoadImage
                src={
                  profile_pic &&
                  profile_pic.type &&
                  profile_pic.type.startsWith("image/")
                    ? URL.createObjectURL(profile_pic)
                    : profile_pic
                }
                alt="Profile"
                className="w-full h-full border-[5px] sm:border-[7px] border-white rounded-full bg-white object-cover"
              />
            </div>

            <div className="up-btn-1 relative lg:-top-44 md:-top-40 -top-36 left-24  c500:left-[8rem]  md:left-[12rem] lg:left-[13.6rem] z-20 bg-cyan-600">
              <Button
                component="label"
                size="small"
                sx={{
                  height: "100%",
                  width: "100%",
                  color: "white",
                  borderRadius: "50%",
                }}
              >
                <HiOutlinePencilSquare className="text-xl" />
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  name="profile"
                  onChange={handleChangeProfile}
                  onBlur={handleBlur}
                />
              </Button>
            </div>
          </div>

          <div className="">
            <button
              className=" mr-4 c500:mr-16 -mt-24 custom400:-mt-28 md:-mt-36 text-sm px-8 c500:px-10 py-2 input-border text-[#1687a7] hover:bg-[#1687a7] hover:text-white  duration-700 float-right font-semibold "
              onClick={handleSubmit}
              type="submit"
            >
              Save Changes
            </button>
          </div>

          <div className="w-[96%] GAGAN mx-auto px-4 py-8 rounded-lg sm:w-[90%] custom800:w-[785px] -mt-4 c400:-mt-12 sm:-mt-[87px] md:-mt-24">
            <label
              htmlFor="shop"
              className="block sm:flex items-center justify-between w-full "
            >
              <p>
                Shop Name<span className="text-xl">*</span>
              </p>{" "}
              <input
                placeholder="Shop Name"
                type="text"
                name="shop_name"
                value={values.shop_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full my-2 p-2 text-[.9rem] black_border sm:w-[78%] capitalize"
              />
            </label>
            {errors.shop_name && touched.shop_name && (
              <h5
                style={{ color: "red" }}
                className="error-para text-left sm:text-center"
              >
                {errors.shop_name}
              </h5>
            )}

            <label
              htmlFor="category"
              className="block sm:flex justify-between items-center mt-4"
            >
              <p>
                {" "}
                Shop Category<span className="text-xl">*</span>{" "}
              </p>
              <FormControl
                sx={{
                  border: "none",
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    { border: "1px solid black" },
                }}
                size="small"
                className="w-full my-2 p-2 sm:w-[78%]"
              >
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  name="shop_category"
                  className="w-full my-2"
                  value={values.shop_category}
                  onChange={(e) =>
                    setFieldValue("shop_category", e.target.value)
                  }
                  onBlur={handleBlur}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categoryData?.length > 0 &&
                    categoryData?.map((val, ind) => {
                      return (
                        <MenuItem
                          value={val.product_category_id}
                          key={val.product_category_id}
                        >
                          &nbsp;{val.product_category_title}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </label>
            {errors.shop_category && touched.shop_category && (
              <h5
                style={{ color: "red" }}
                className="error-para text-left sm:text-center "
              >
                {errors.shop_category}
              </h5>
            )}

            <label
              htmlFor="shop address"
              className="block sm:flex justify-between items-center mt-4"
            >
              <p>
                Shop Address<span className="text-xl">*</span>{" "}
              </p>
              <input
                placeholder="Shop Address"
                type="text"
                name="shop_address"
                value={values.shop_address}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full mt-2 p-2 text-[.9rem] black_border sm:w-[78%] capitalize"
              />
            </label>
            {errors.shop_address && touched.shop_address && (
              <h5
                style={{ color: "red" }}
                className="error-para text-left sm:text-center"
              >
                {errors.shop_address}
              </h5>
            )}
            
            <label
              htmlFor="shop contact"
              className="block sm:flex justify-between items-center mt-4"
            >
              <p>
                Shop contact <span className="text-xl">*</span>{" "}
              </p>
             <div className="w-full flex flex-row items-center justify-between  sm:w-[78%]" >
             <input
                placeholder="Shop Contact"
                type="number"
                name="shop_contact"
                value={values.shop_contact}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full my-2 p-2 text-[.9rem] black_border mr-2 "
              />
              <div
                className=" px-2 py-2 cursor-pointer text-center capitalize text-[.9rem] black_border hover:text-[#1687a7] duration-200 hover:border-[#1687a7]"
                onClick={() => setOpenLocation(true)}
              >
                shop&nbsp;current&nbsp;address
              </div>
             </div>
            </label>
            {errors.shop_contact && touched.shop_contact && (
              <h5
                style={{ color: "red" }}
                className="error-para text-left sm:text-center"
              >
                {errors.shop_contact}
              </h5>
            )}

            <label
              htmlFor="pincode"
              className="block sm:flex justify-between items-center mt-4"
            >
              <p>
                Shop Pincode<span className="text-xl">*</span>{" "}
              </p>
              <input
                placeholder="pincdoe"
                type="number"
                name="shop_pincode"
                value={values.shop_pincode}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full my-2 p-2 text-[.9rem] black_border sm:w-[78%]"
              />
            </label>

            {errors.shop_pincode && touched.shop_pincode && (
              <h5
                style={{ color: "red" }}
                className="error-para text-left sm:text-center"
              >
                {errors.shop_pincode}
              </h5>
            )}

            <label
              htmlFor="shop city"
              className="block sm:flex justify-between items-center mt-4"
            >
              <p>
                Shop City<span className="text-xl">*</span>
              </p>
              <input
                placeholder="Shop City"
                type="text"
                name="shop_city"
                value={values.shop_city}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full my-2 p-2 text-[.9rem] black_border sm:w-[78%] capitalize"
              />
            </label>
            {errors.shop_city && touched.shop_city && (
              <h5
                style={{ color: "red" }}
                className="error-para text-left sm:text-center"
              >
                {errors.shop_city}
              </h5>
            )}

            <label
              htmlFor="shop state"
              className="block sm:flex justify-between items-center mt-4"
            >
              <p>
                Shop State<span className="text-xl">*</span>
              </p>
              <input
                placeholder="Shop State"
                type="text"
                name="shop_city"
                value={values.shop_state}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full my-2 p-2 text-[.9rem] black_border sm:w-[78%] capitalize"
              />
            </label>
            {errors.shop_state && touched.shop_state && (
              <h5
                style={{ color: "red" }}
                className="error-para text-left sm:text-center"
              >
                {errors.shop_state}
              </h5>
            )}
            {/* shop pickup address hide hua he=== */}
            {/* <label
              htmlFor="shop pickup address"
              className="block sm:flex justify-between items-center mt-4"
            >
              <p>Shop Pickup Address</p>
              <input
                placeholder="Shop Address"
                type="text"
                name="shop_pickup_address"
                value={values.shop_pickup_address}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full my-2 p-2 text-[.9rem] black_border sm:w-[78%]"
              />
            </label>
            {errors.shop_pickup_address && touched.shop_pickup_address ? (
              <h5
                style={{ color: "red" }}
                className="error-para text-left sm:text-center"
              >
                {errors.shop_pickup_address}
              </h5>
            ) : (
              ""
            )} */}

            {/* <label
              htmlFor="category"
              className="block sm:flex justify-between items-center mt-4"
            >
              <p> Shop Category </p>

              <FormControl
                sx={{
                  border: "none",
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    { border: "1px solid black" },
                }}
                size="small"
                className="w-full my-2 p-2 sm:w-[78%]"
              >
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  name="shop_category"
                  className="w-full my-2"
                  value={values.delivery_charges_pay}
                  onChange={(e) =>
                    setFieldValue("delivery_charges_pay", e.target.value)
                  }
                  onBlur={handleBlur}
                >
                  <MenuItem value={values.delivery_charges_pay}>
                    <em>
                      {values.delivery_charges_pay
                        ? values.delivery_charges_pay == 1
                          ? "Customer will pay"
                          : "I will pay"
                        : "None"}
                    </em>
                  </MenuItem>
                  <MenuItem value={1} key={1}>
                    &nbsp; Customer will pay
                  </MenuItem>
                  <MenuItem value={2} key={2}>
                    &nbsp; I will pay
                  </MenuItem>
                </Select>
              </FormControl>
            </label>
            {errors.delivery_charges_pay && touched.delivery_charges_pay ? (
              <h5
                style={{ color: "red" }}
                className="error-para text-left sm:text-center"
              >
                {errors.delivery_charges_pay}
              </h5>
            ) : (
              ""
            )} */}

            {/* ===================================shop timings======================================================= */}

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
                          {data.s === "on" ? (
                            <div className="w-full flex items-center justify-around">
                              <input
                                placeholder="Opening Time"
                                // type="time"
                                name="o"
                                value={data.o}
                                onChange={(e) => {
                                  handleTimeChange(e, index);
                                }}
                                className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7]  "
                              />
                              <p className="mx-1"> : </p>
                              <input
                                placeholder="Closing time"
                                // type="time"
                                name="c"
                                value={data.c}
                                onChange={(e) => {
                                  handleTimeChange(e, index);
                                }}
                                className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7]  "
                              />
                            </div>
                          ) : (
                            <div className="w-full flex items-center justify-around border p-1 rounded border-2 border-[#A2CFDC]">
                              Off
                            </div>
                          )}

                          {/* <input
                            type="checkbox"
                            name="s"
                            id="status"
                            value={data.s}
                            checked={data.s === "on"}
                            onChange={(e) => {
                              handleOnOf(e, index);
                            }}
                          ></input> */}
                          <Switch
                            name="s"
                            checked={data.s === "on"}
                            value={data.s}
                            onChange={(e) => {
                              handleOnOf(e, index);
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </div>
                      );
                    })
                  : blankSchedule.map((data, index) => {
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
                          {data.s === "on" ? (
                            <div className="w-full flex items-center justify-around">
                              <input
                                placeholder="Opening Time"
                                // type="time"
                                name="o"
                                value={data.o}
                                onChange={(e) => {
                                  handleTimeChangeBlank(e, index);
                                }}
                                className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7]  "
                              />
                              <p className="mx-1"> : </p>
                              <input
                                placeholder="Closing time"
                                // type="time"
                                name="c"
                                value={data.c}
                                onChange={(e) => {
                                  handleTimeChangeBlank(e, index);
                                }}
                                className="w-full my-2 p-2 text-[.9rem] input-border placeholder:text-[#A2CFDC] outline-none text-[#1687a7]  "
                              />
                            </div>
                          ) : (
                            <div className="w-full flex items-center justify-around border p-1 rounded border-2 border-[#A2CFDC]">
                              Off
                            </div>
                          )}

                          {/* <input
                            type="checkbox"
                            name="s"
                            id="status"
                            value={data.s}
                            checked={data.s === "on"}
                            onChange={(e) => {
                              handleOnOfBlank(e, index);
                            }}
                          ></input> */}
                          <Switch
                            name="s"
                            checked={data.s === "on"}
                            value={data.s}
                            onChange={(e) => {
                              handleOnOfBlank(e, index);
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </div>
                      );
                    })}
              </div>
            </label>
          </div>
          {openLocation && (
            <CustomDialog
              open={openLocation}
              onNo={() => setOpenLocation(false)}
              size="xlarge"
              title="Edit Quantities"
            >
              <Maps />
            </CustomDialog>
          )}
        </div>
      </div>
    </>
  );
};

export default EditProfile;
