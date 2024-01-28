import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaStarOfLife } from "react-icons/fa";
import { PiUploadSimpleThin } from "react-icons/pi";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { list_product_schema } from "../schemas";
import { useFormik } from "formik";
const EditAttributes = lazy(() =>
  import("../Editproduct/Components/Attribute")
);
const Tables = lazy(() => import("../Editproduct/Components/Tables"));
const MainCategoryForAddVariant = lazy(() =>
  import("../addProduct/component.jsx/MainCategoryForAddVariant")
);
import { RxCrossCircled } from "react-icons/rx";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog";
import AddVarianProduct from "../addProduct/AddVariant";
import { getSessionId } from "../utils/get_session_id";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  const [openAddVariantDialog, setOpenAddVariantDialog] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isSizeLoading, setIsSizeLoading] = useState(true);
  const [productMainImage, setProductMainImage] = useState();
  const [productImages, setProductImages] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [attributesID, setAttributeID] = useState([]);

  const get_product = (data) =>
    apiRequest({ url: "products/get_product", method: "post", data });

  const { mutate: get_product_data, isLoading: product_loadings } = useMutation(
    get_product,
    {
      onSuccess: (data) => {
        setValues(data?.data?.product_data);
        setProduct_Data(data?.data);
        setProductDetails(data?.data?.product_data);
        handleProductImage(data?.data?.product_data);
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
      const data = queryClient.getQueryData("add_products");
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
      formData.append("product_id", product_id);
      get_product_data(formData);
    }
  }, [product_id, sessionId]);

  const update_product = (data) =>
    apiRequest({ url: "/products/edit_product", method: "post", data });

  const { mutate: edit_product, isLoading: product_loading } = useMutation(
    update_product,
    {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success(data?.data?.message);
        } else {
          toast.error(data?.data?.message);
        }
        queryClient.invalidateQueries("edit_product");
      },

      onError: (err) => {
        toast.error(err);
      },
      retry: {
        maxAttempts: 3,
        delay: (attempt) => {
          return attempt * 1000;
        },
      },
    }
  );

  const [category_last_id, setCategory_last_id] = useState([]);

  const [initialValues, setInitialValues] = useState({
    country_origin: "",
    discount_percent: "",
    hsn_code: "",
    images: "",
    is_variation_available: "",
    main_image: "",
    manufactured_by: "",
    mrp: "",
    price: "",
    product_category1_id: "",
    product_category2_id: "",
    product_category3_id: "",
    product_category4_id: "",
    product_desc: "",
    product_id: "",
    product_main_attribute_value_id: "",
    product_main_attribute_value_title: "",
    product_title: "",
    product_variation_attribute_value_id: "",
    product_variation_attribute_value_title: "",
    product_weight: "",
    quantity_available: "",
    return_period_time: "",
    seller_id: "",
  });

  // tabs storage================
  const [tabs, setTabs] = useState(() => {
    const storedTabs = localStorage.getItem("tabs");
    return storedTabs ? JSON.parse(storedTabs) : [{ id: 1, title: "Tab 1" }];
  });

  const [activeTab, setActiveTab] = useState(() => {
    const storedActiveTab = localStorage.getItem("activeTab");
    return storedActiveTab ? parseInt(storedActiveTab) : 1;
  });

  const handleProductImage = (pro_data) => {
    const arrayResult = pro_data?.images?.split(",");
    setProductMainImage(pro_data?.main_image);
    setProductImages([...productImages, ...arrayResult]);
  };

  let {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: initialValues,
    // validationSchema: list_product_schema,
    onSubmit: (values) => {
      setInitialValues(values);
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("product_title", values?.product_title);
      formData.append("product_id", values?.product_id);
      formData.append("hsn_code", values?.hsn_code);
      formData.append(
        "product_low_quantity_stock",
        values?.product_low_quantity_stock
      );
      formData.append("return_period_time", values?.return_period_time);
      formData.append("product_weight", values?.product_weight);
      formData.append("product_desc", values?.product_desc);
      formData.append("quantity", values?.quantity_available);
      formData.append("mrp", values?.mrp);
      formData.append("price", values?.price);
      formData.append("gst_category_id", values?.gst_category_id);
      formData.append("country_origin", values?.country_origin);
      formData.append("manufactured_by", values?.manufactured_by);
      edit_product(formData);
    },
  });

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => setCountries(data.map((country) => country.name.common)));
  }, []);

  const category_api = (data) =>
    apiRequest({
      url: `datas/get_product_categories1`,
      method: "post",
      data,
    });

  const { mutate: gate_category1, isLoading } = useMutation(category_api, {
    onSuccess: (data) => {
      setCategory1Data(data?.data?.data);
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

  const [category1Data, setCategory1Data] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("parent_category");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  const get_category_id = useCallback(() => {
    const formData = new FormData();
    gate_category1(formData);
  }, [gate_category1]);

  const gstDataFetch = () => {
    return axios.get(
      `https://nearo.in/seller_app/index.php/seller/datas/get_gst_categories`
    );
  };
  const {
    isLoading: gstLoading,
    data: GstData,
    isError,
    error,
    isFetching,
  } = useQuery("gstData", gstDataFetch);

  const product_size_api = (data) =>
    apiRequest({
      url: `/datas/get_product_sizes`,
      method: "post",
      data,
    });

  const post_productSize_data = useMutation(product_size_api, {
    onSuccess: (data) => {
      setproductSizeData(data?.data?.data);
      queryClient.invalidateQueries("product_Size");
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

  const [productSizeData, setproductSizeData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("product_Size");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  useEffect(() => {
    const formData = new FormData();
    formData.append(
      "category_4_id",
      category_last_id && category_last_id[3]?.category_id
    );
    // post_productSize_data.mutate(formData);

    setIsSizeLoading(false);
  }, [category_last_id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    setProductImages([...productImages, ...validImages]);
    AddProductImages(validImages);
  };

  const handleUpdateImage = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const updatedImages = [...productImages];
      updatedImages[index] = file;
      setProductImages(updatedImages);
    }
    AddProductImages(file);
  };

  const handleUpdateMainImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProductMainImage(file);
    }
    AddProductMainImage(file);
  };

  const remove_image = (data) =>
    apiRequest({
      url: "products/remove_product_image/",
      method: "post",
      data,
    });

  const { mutate: remove_product_image, isLoading: isProductImageRemoving } =
    useMutation(remove_image, {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success(data?.data?.message);
        } else {
          toast.error(data?.data?.message);
        }
        queryClient.invalidateQueries("add_products");
      },
      onError: (err) => {
        toast.error(err);
      },
      retry: {
        maxAttempts: 3,
        delay: (attempt) => {
          return attempt * 1000;
        },
      },
    });

  const handleDeleteImage = (index) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("product_id", product_id);
    formData.append("image_index", index);
    remove_product_image(formData);
    setProductImages(updatedImages);
  };

  const send_product_image = (data) =>
    apiRequest({
      url: "products/update_product_main_image/",
      method: "post",
      data,
    });

  const { mutate: add_product_main_image, isLoading: product_loading_image } =
    useMutation(send_product_image, {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success(data?.data?.message);
        } else {
          toast.error(data?.data?.message);
        }
        queryClient.invalidateQueries("add_products");
      },
      onError: (err) => {
        toast.error(err);
      },
      retry: {
        maxAttempts: 3,
        delay: (attempt) => {
          return attempt * 1000;
        },
      },
    });

  const send_product_images = (data) =>
    apiRequest({ url: "products/add_product_images/", method: "post", data });

  const { mutate: add_product_images, isLoading: loading_product_images } =
    useMutation(send_product_images, {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success(data?.data?.message);
        } else {
          toast.error(data?.data?.message);
        }
        queryClient.invalidateQueries("add_products");
      },
      onError: (err) => {
        toast.error(err);
      },
      retry: {
        maxAttempts: 3,
        delay: (attempt) => {
          return attempt * 1000;
        },
      },
    });

  const [image_Data, setImage_Data] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("add product");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  const AddProductMainImage = (image) => {
    const formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("session_id", sessionId);
    formData.append("main_image", image);
    add_product_main_image(formData);
  };

  const AddProductImages = (images) => {
    const formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("session_id", sessionId);
    for (var i = 0; i < images.length; i++) {
      formData.append(`images[]`, images[i]);
    }
    add_product_images(formData);
  };

  const goToProductPage = (productId) => {
    navigate(`/dashboard/add_product/edit/${productId}`);
  };

  const handleSelect = (option) => {
    console.log("Selected option:", option);

    // values.country_origin = option
  };

  const returnTime = [
    { label: "1 Day", value: 1 },
    { label: "2 Days", value: 2 },
    { label: "3 Days", value: 3 },
    { label: "4 Days", value: 4 },
    { label: "5 Days", value: 5 },
    { label: "6 Days", value: 6 },
    { label: "7 Days", value: 7 },
    { label: "8 Days", value: 8 },
    { label: "9 Days", value: 9 },
    { label: "10 Days", value: 10 },
    { label: "11 Days", value: 11},
    { label: "12 Days", value: 12},
    { label: "13 Days", value: 13},
    { label: "14 Days", value: 14},
    { label: "15 Days", value: 15},
  ];

  if (
    gstLoading ||
    isSizeLoading ||
    product_loading_image ||
    loading_product_images ||
    isProductImageRemoving ||
    product_loadings
  ) {
    return (
      <h2 className="text-5xl text-red-500 h-screen flex justify-center  items-center">
        Loading....
      </h2>
    );
  }

  if (isError) {
    return <h2 className="text-center my-20 text-3xl">{error.message} </h2>;
  }

  return (
    <div className="bg-white mx-2 mt-2 p-1 py-4 sm:p-4">
      <div className="flex overflow-x-auto whitespace-nowrap w-full space-x-5">
        {product_Data?.p_variation_data?.map((tab, index) => (
          <button
            key={tab.id}
            className={`py-2 px-4 text-sm font-medium  ${
              tab.product_id === product_id
                ? "bg-cyan-50 text-cyan-700 border-x border-gray-400 border-t "
                : ""
            }`}
            onClick={() => goToProductPage(tab?.product_id)}
          >
            {index === 0 ? "Main Product" : `Variant ${index} `}
            {/* <span
              className="inline-flex items-center justify-center h-4 w-4 rounded-full text-xs font-semibold bg-red-500 text-white ml-1"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              &times;
            </span> */}
          </button>
        ))}
        <button
          className="btn2 mx-4 flex items-center font-semibold text-sm "
          onClick={() => setOpenAddVariantDialog(true)}
        >
          <BsPlusLg className="text-xl" />
          &nbsp; Add Variant
        </button>
      </div>
      <div className="py-4 sm:p-4">
        <div className={"bg-white rounded-b-lg"}>
          <h2 className="text-lg sm:text-2xl font-medium my-4 flex items-center">
            Edit Product
            <sup>
              <FaStarOfLife className="text-[10px]" />
            </sup>{" "}
          </h2>
          {openAddVariantDialog && (
            <CustomDialog
              open={openAddVariantDialog}
              onNo={() => setOpenAddVariantDialog(false)}
              size="md"
              title="Add Variant"
            >
              <AddVarianProduct data={product_Data} />
            </CustomDialog>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-5 border-spacing-80    ">
            <p className="text-[12px] p-1 bg-gray-100 text-gray-600 px-4 w-fit">
              <sup>*</sup>Minimum 1 and Maximum 5 Images{" "}
            </p>

            <div className=" flex space-x-6 items-center my-6">
              <div className="flex space-x-5">
                {productMainImage && (
                  <div className="h-20 w-20 sm:h-32 sm:w-32 relative">
                    <img
                      src={
                        /^(ftp|http|https):\/\/[^ "]+$/.test(productMainImage)
                          ? productMainImage
                          : URL.createObjectURL(productMainImage)
                      }
                      alt={`Selected 0`}
                      className="object-cover w-full h-full rounded-md border-2 border-dashed border-cyan-300"
                    />
                    <label
                      htmlFor={`file-upload-0`}
                      className="capitalize text-cyan-600 underline text-sm text-center hover:text-black hover:font-semibold cursor-pointer"
                    >
                      Change Main Image
                    </label>
                    <input
                      id={`file-upload-0`}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleUpdateMainImage(e)}
                    />
                  </div>
                )}
              </div>

              {productImages?.length > 0 && (
                <div className="flex space-x-5">
                  {productImages?.map((image, index) => (
                    <div
                      key={index}
                      className="h-20 w-20 sm:h-32 sm:w-32 relative"
                    >
                      <RxCrossCircled
                        className="text-2xl bg-cyan-500 rounded-full text-white float-right text-right absolute -right-2 -top-2 cursor-pointer"
                        onClick={() => handleDeleteImage(index)}
                      />

                      <img
                        src={
                          /^(ftp|http|https):\/\/[^ "]+$/.test(image)
                            ? image
                            : image
                        }
                        alt={`Selected ${index}`}
                        className="object-cover w-full h-full rounded-md border-2 border-dashed border-cyan-300"
                      />
                      <label
                        htmlFor={`file-upload-${index}`}
                        className="capitalize text-cyan-600 underline text-sm text-center hover:text-black hover:font-semibold cursor-pointer"
                      >
                        Change Image
                      </label>
                      <input
                        id={`file-upload-${index}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpdateImage(e, index)}
                      />
                    </div>
                  ))}
                </div>
              )}

              <label
                htmlFor="file-upload"
                className="h-20 w-20 sm:h-32 sm:w-32 rounded-md border-2 border-dashed border-cyan-300 bg-cyan-50 text-cyan-700 flex flex-col items-center justify-center cursor-pointer"
              >
                <PiUploadSimpleThin className="text-2xl sm:text-4xl" />
                <p className="text-[10px] sm:text-[12px] "> Upload File</p>
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          {/* ==================add product form start ================= */}
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
                  placeholder="Enter product name"
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

              {/* ================category */}
              <label
                htmlFor="product_catogory"
                className="block sm:flex justify-between items-center mt-4"
              >
                <p>
                  Category<sup>*</sup>
                </p>
                <Suspense fallback={"loading"}>
                  <MainCategoryForAddVariant
                    category1Id={productDetails?.product_category1_id}
                    category2Id={productDetails?.product_category2_id}
                    category3Id={productDetails?.product_category3_id}
                    category4Id={productDetails?.product_category4_id}
                  />
                </Suspense>
              </label>

              {/* =======================MRP AND DISCOUNT------===== */}
              <div className="flex justify-between mt-4 items-center">
                <label htmlFor="MRP" className="w-[48%]">
                  <p>
                    MRP<sup>*</sup>
                  </p>
                  <input
                    type="number"
                    name="mrp"
                    value={values?.mrp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="MRP...."
                    className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
                  />
                  {errors.mrp && touched.mrp && (
                    <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                      {errors.mrp}
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
                    name="discount_percent"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.discount_percent}
                    className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
                  />
                  {errors.discount_percent && touched.discount_percent && (
                    <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                      {errors.discount_percent}
                    </p>
                  )}
                </label>
              </div>
              {/* =======================sell price gst category------===== */}
              <div className="flex justify-between mt-4 items-center">
                <label htmlFor="SellPrice" className="w-[48%]">
                  <p>
                    Sell Price<sup>*</sup>
                  </p>
                  <input
                    type="text"
                    placeholder="Sell Price"
                    name="price"
                    value={Math.round(
                      values?.mrp -
                        (values?.discount_percent / 100) * values?.mrp
                    )}
                    readOnly
                    className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
                  />
                  {errors.price && touched.price && (
                    <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                      {errors.price}
                    </p>
                  )}
                </label>
                <label htmlFor="Gst" className="w-[48%]">
                  <p>
                    Gst Category<sup>*</sup>
                  </p>
                  <FormControl
                    sx={{
                      m: "5px 0 5px 0",
                      minWidth: "100%",

                      border: "none",
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        { border: "1px solid black" },
                    }}
                    size="small"
                  >
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      name="gst_category_id"
                      value={values?.gst_category_id}
                      onChange={(e) =>
                        setFieldValue("gst_category_id", e.target.value)
                      }
                      onBlur={handleBlur}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>

                      {GstData?.data.data &&
                        GstData?.data?.data.map((val) => {
                          return (
                            <MenuItem
                              value={val.category_id}
                              key={val.category_id}
                            >
                              {val.gst_percent} %
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                  {errors.gst_category_id && touched.gst_category_id && (
                    <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                      {errors.gst_category_id}
                    </p>
                  )}
                </label>
              </div>
              {/* =====================SIZE HSN======== */}
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

                <label htmlFor="HSN" className="w-[48%]">
                  <p>
                    Quantity<sup>*</sup>
                  </p>
                  <input
                    type="text"
                    placeholder="Quantity Available"
                    name="quantity_available"
                    value={values?.quantity_available}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
                  />
                  {errors.quantity_available && touched.quantity_available && (
                    <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                      {errors.quantity_available}
                    </p>
                  )}
                </label>
              </div>

              {/* =================product table==================== */}
              <div className="border border-blue-gray-50 my-4 overflow-x-auto whitespace-nowrap ">
                {product_Data?.prod_size_data && (
                  <Tables data={product_Data?.prod_size_data} />
                )}
              </div>

              <div className="flex justify-between mt-4 items-center">
                <Suspense fallback={"loading"}>
                  <EditAttributes
                    category_last_id={productDetails?.product_category4_id}
                    data={product_Data?.p_attr_desc_data}
                    onSelect={handleSelect}
                    attributesID={attributesID}
                    setAttributeID={setAttributeID}
                    productId={product_Data?.product_data?.product_id}
                  />
                </Suspense>
              </div>

              {/* =====================return time======lowstock margin========  */}
              <div className="flex justify-between mt-4 items-center">
                <label htmlFor="MRP" className="w-[48%]">
                  <p>
                    Return Time (Day)<sup>*</sup>
                  </p>
                  <FormControl
                  sx={{
                    border: "none",
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      { border: "1px solid black" },
                  }}
                  size="small"
                  className="w-full my-2 p-2"
                >
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    name="return_period_time"
                    className="w-full my-2"
                    value={values?.return_period_time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="0">
                      <em>No Return</em>
                    </MenuItem>
                    {returnTime?.length > 0 &&
                      returnTime.map((val, ind) => {
                        return (
                          <MenuItem value={val.value} key={ind}>
                            &nbsp;{val.label}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                  {/* <input
                    type="number"
                    name="return_period_time"
                    value={values?.return_period_time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Return Time"
                    className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
                  /> */}
                  {errors.return_period_time && touched.return_period_time && (
                    <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                      {errors.return_period_time}
                    </p>
                  )}
                </label>

                <label htmlFor="discount" className="w-[48%]">
                  <p>
                    Low Stock Alert (Quantity)<sup>*</sup>
                  </p>
                  <input
                    type="number"
                    placeholder="Low stock margin"
                    name="product_low_quantity_stock"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.product_low_quantity_stock}
                    className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none"
                  />
                  {errors.product_low_quantity_stock &&
                    touched.product_low_quantity_stock && (
                      <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                        {errors.product_low_quantity_stock}
                      </p>
                    )}
                </label>
              </div>

              {/*======================================*/}

              <div className="flex justify-between mt-4 items-center">
                <label htmlFor="weight" className="w-[48%]">
                  <p>
                    Product Net weight (gm)<sup>*</sup>
                  </p>
                  <input
                    type="number"
                    name="product_weight"
                    value={values?.product_weight}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Product Net weight"
                    className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
                  />
                  {errors.product_weight && touched.product_weight && (
                    <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                      {errors.product_weight}
                    </p>
                  )}
                </label>

                {/* ================manufactured by which contry========================= */}

                <label htmlFor="country" className="w-[48%]">
                  <p> Country of origin </p>
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
                      name="country_origin"
                      className="w-full my-2"
                      value={values?.country_origin}
                      onChange={(e) =>
                        setFieldValue("country_origin", e.target.value)
                      }
                      onBlur={handleBlur}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {countries?.length > 0 &&
                        countries?.map((val, ind) => {
                          return (
                            <MenuItem value={val} key={ind}>
                              &nbsp;{val}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </label>
                {errors.country_origin && touched.country_origin ? (
                  <h5
                    style={{ color: "red" }}
                    className="error-para text-left sm:text-center "
                  >
                    {errors.country_origin}
                  </h5>
                ) : (
                  ""
                )}
              </div>
              <div className="w-full mt-4">
                <label htmlFor="MANUFACTURE">
                  <p>
                    Manufactured By<sup>*</sup>
                  </p>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="manufactured_by"
                    onBlur={handleBlur}
                    value={values?.manufactured_by}
                    placeholder="Manufactured By"
                    className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm placeholder:text-gray-400 outline-none "
                  />
                  {errors.manufactured_by && touched.manufactured_by && (
                    <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                      {errors.manufactured_by}
                    </p>
                  )}
                </label>
              </div>

              {/* ===================pRODUCTION description field=========================== */}
              <div className="w-full my-4">
                <p className="my-2">
                  Production Description
                  <span className="text-[12px] sm:text-sm text-gray-400 ml-2">
                    (optional)
                  </span>
                </p>

                <div className="w-full bg-[#ECEFF1]">
                  <TextField
                    id="outlined-textarea"
                    placeholder="Enter Product Description"
                    name="product_desc"
                    value={values?.product_desc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    rows={5}
                    sx={{
                      width: "100%",
                      height: "100%",

                      "& .MuiInputBase-root": {
                        backgroundColor: "#ECEFF1",
                      },
                    }}
                  />
                </div>
              </div>

              <div className="my-2 flex justify-between c500:flex-row text-sm font-semibold">
                <button type="button" className="btn2">
                  Clear Details
                </button>

                <button type="submit" className="btn1" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

// import React from 'react'
// import Mex from "./Mex"
// const EditProduct = () => {
//   return (
//     <div>
//       <Mex/>
//     </div>
//   )
// }

// export default EditProduct
