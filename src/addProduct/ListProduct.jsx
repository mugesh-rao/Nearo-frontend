import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
  startTransition,
} from "react";
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
const CountryOrigin = lazy(() => import("./component.jsx/CountryOrgin"));
const Attributes = lazy(() => import("./component.jsx/Attribute"));
const Tables = lazy(() => import("./component.jsx/Tables"));
const MainCategory = lazy(() => import("./component.jsx/MainCategory"));
import { RxCrossCircled } from "react-icons/rx";
import { useNavigate } from "react-router";
import { getSessionId } from "../utils/get_session_id";
import toast from "react-hot-toast";
import Loader from "../utils/Loader";

const TabContainer = () => {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  const send_product = (data) =>
    apiRequest({ url: "/products/add_product", method: "post", data });

  const { mutate: add_product, isLoading: product_loading } = useMutation(
    send_product,
    {
      onSuccess: (data) => {
        if (data?.data?.success === 1) {
          toast.success(data?.data?.message);
          setProduct_Data(data?.data);
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

  const [category_last_id, setCategory_last_id] = useState([]);
  const [initialValues, setIntialValues] = useState({
    product_title: "",
    hsn_code: "",
    product_market_price: "",
    product_discount: "",
    gst_category_id: "",
    low_stock: "",
    return_period_time: "",
    product_weight: "",
    country_origin: "",
    manufactured_by: "",
    product_desc: "",
    // variation_attribute_value_id:[],
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

  useEffect(() => {
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const openNewTab = useCallback(() => {
    const newTabId = tabs.length + 1;
    const newTabs = [...tabs, { id: newTabId, title: `Tab ${newTabId}` }];
    setTabs(newTabs);
    setActiveTab(newTabId);
  }, [tabs]);

  const switchTab = useCallback(
    (tabId) => {
      setActiveTab(tabId);
    },
    [activeTab]
  );

  const closeTab = useCallback(
    (tabId) => {
      const newTabs = tabs.filter((tab) => tab.id !== tabId);
      setTabs(newTabs);

      if (activeTab === tabId && newTabs.length > 0) {
        setActiveTab(newTabs[newTabs.length - 1].id);
      }
    },
    [activeTab, tabs]
  );

  const [isSizeOpen, setSizeOpen] = useState(false);
  const [selectedSizeOptions, setSelectedSizeOptions] = useState([]);
  const [inputSizeValue, setInputSizeValue] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);

  //attribute state for only attribut component
  const [attributesID, setAttributeID] = useState([]);
  const navigate = useNavigate();
  let { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: list_product_schema,
      onSubmit: (values) => {
        const formData = new FormData();

        formData.append("session_id", sessionId);
        formData.append("product_title", values?.product_title);
        formData.append(
          "product_category1_id",
          category_last_id[0]?.category_id
        );
        formData.append(
          "product_category2_id",
          category_last_id[1]?.category_id
        );
        formData.append(
          "product_category3_id",
          category_last_id[2]?.category_id
        );
        formData.append(
          "product_category4_id",
          category_last_id[3]?.category_id
        );
        formData.append("hsn_code", values?.hsn_code);
        formData.append("gst_category_id", values?.gst_category_id);
        formData.append("product_low_quantity_stock", values?.low_stock);
        formData.append("return_period_time", values?.return_period_time);
        formData.append("product_weight", values?.product_weight);
        formData.append("country_origin", values?.country_origin);
        formData.append("manufactured_by", values?.manufactured_by);
        formData.append("product_desc", values?.product_desc);
        // formData.append("product_sizes", selectedValues);

        selectedValues?.forEach((productItem, index) => {
          formData.append(
            `product_sizes[${index}][main_attribute_value_id]`,
            productItem?.main_attribute_value_id
          );

          formData.append(`product_sizes[${index}][mrp]`, productItem.mrp);
          formData.append(`product_sizes[${index}][price]`, productItem.price);
          formData.append(
            `product_sizes[${index}][quantity]`,
            productItem.quantity
          );
        });

        for (var i = 0; i < attributesID.length; i++) {
          for (var j = 0; j < attributesID[i].length; j++) {
            formData.append(
              "product_attributes[" + i + "][" + j + "]",
              attributesID[i][j]
            );
          }
        }

        formData.append("is_variation", 0);
        formData.append("product_id", 0);
        formData.append("variation_attribute_value_id", attributesID[0][1]);
        add_product(formData);
      },
    });
  // console.log(selectedValues,attributesID)

  const handleSizeboxChange = useCallback(
    (event, id) => {
      const { value, checked } = event.target;

      if (checked && values.product_discount) {
        setSelectedSizeOptions([...selectedSizeOptions, value]);
        setSelectedValues([
          ...selectedValues,
          {
            name: value,
            isEditing: false,
            main_attribute_value_id: id,
            mrp: values.product_market_price,
            discount: values.product_discount,
            quantity: 0,
            price:
              values.product_market_price -
              (values.product_market_price * values.product_discount) / 100,
          },
        ]);

        setInputSizeValue(inputSizeValue + value + ", ");
      } else {
        setSelectedValues(
          selectedValues.filter((option) => option.name !== value)
        );
        setSelectedSizeOptions(
          selectedSizeOptions.filter((val) => val !== value)
        );
        setInputSizeValue(inputSizeValue.replace(value + ", ", ""));
      }
    },
    [
      inputSizeValue,
      selectedSizeOptions,
      selectedValues,
      values?.product_discount,
      values?.product_market_price,
    ]
  );

  const toggleSelectModule = useCallback(
    (event) => {
      event.preventDefault();
      setSizeOpen(!isSizeOpen);
      selectedSizeOptions.length == 0 ? handleSizeboxChange(event, 49) : "";
    },
    [isSizeOpen, handleSizeboxChange, selectedSizeOptions]
  );

  const clearAllSize = useCallback((event) => {
    event.preventDefault();
    setSelectedSizeOptions([]);
    setInputSizeValue("");
    setSelectedValues([]);
    setSizeOpen(false);
  }, []);

  const applySelection = () => {
    // Handle any necessary actions with selectedOptions
    setSizeOpen(false);
  };

  const handleSelect = (option) => {
    console.log("Selected option:", option);

    values.country_origin = option;
  };

  // =====================countries api =====================
  const [countries, setCountries] = useState([]);

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
  //we are psoting our session id for api requesting

  const get_category_id = useCallback(() => {
    const formData = new FormData();
    gate_category1(formData);
  }, [gate_category1]);

  // gst data fetching
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

  const [isSizeLoading, setIsSizeLoading] = useState(true);
  useEffect(() => {
    const formData = new FormData();
    formData.append(
      "category_4_id",
      category_last_id && category_last_id[3]?.category_id
    );
    post_productSize_data.mutate(formData);

    setIsSizeLoading(false);
  }, [category_last_id]);

  // console.log(category_last_id);

  //images states
  const [productImages, setProductImages] = useState([]);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validImages = files.filter((file) => file.type.startsWith("image/"));

    setProductImages([...productImages, ...validImages]);

    // Log the selected images to the console
    console.log(validImages);
  };

  const handleUpdateImage = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const updatedImages = [...productImages];
      updatedImages[index] = file;
      setProductImages(updatedImages);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);
  };

  const send_mainproudct_image = (data) =>
    apiRequest({
      url: "/products/update_product_main_image",
      method: "post",
      data,
    });

  const {
    mutate: add_product_mainimage,
    isLoading: product_loading_mainimage,
  } = useMutation(send_mainproudct_image, {
    onSuccess: (data) => {
      console.log(data?.data);
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
  });
  const send_product_image = (data) =>
    apiRequest({ url: "/products/add_product_images", method: "post", data });

  const { mutate: add_product_image, isLoading: product_loading_image } =
    useMutation(send_product_image, {
      onSuccess: (data) => {
        console.log(data?.data);
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
    });

  useEffect(() => {
    const formData = new FormData();
    const formData2 = new FormData();
    formData.append("product_id", product_Data?.product_id);
    formData.append("session_id", sessionId);
    formData.append("main_image", productImages[0]);

    formData2.append("product_id", product_Data?.product_id);
    formData2.append("session_id", sessionId);
    if (productImages?.length > 0) {
      for (var i = 1; i < productImages.length; i++) {
        formData2.append(`images[]`, productImages[i]);
      }
    }
    add_product_mainimage(formData);
    add_product_image(formData2);
    startTransition(() => {
      product_Data?.product_id &&
        navigate(`/dashboard/add_product/edit/${product_Data?.product_id}`);
    });
  }, [product_Data]);

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
    product_loading ||
    product_loading_mainimage
  ) {
    return (
      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <h2 className="text-center my-20 text-3xl">{error.message} </h2>;
  }

  return (
    <div className="bg-white mx-2 mt-2 p-1 py-4 sm:p-4">
      {/* <div className="flex overflow-x-auto whitespace-nowrap w-full space-x-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-2 px-4 text-sm font-medium  ${tab.id === activeTab
                ? "bg-cyan-50 text-cyan-700 border-x border-gray-400 border-t "
                : ""
              }`}
            onClick={() => switchTab(tab.id)}
          >
            {tab.id === 1 ? "Main Product" : `Varient ${tab.id} `}
            <span
              className="inline-flex items-center justify-center h-4 w-4 rounded-full text-xs font-semibold bg-red-500 text-white ml-1"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              &times;
            </span>
          </button>
        ))}
        <button
          className="btn2 mx-4 flex items-center font-semibold text-sm "
          onClick={openNewTab}
        >
          <BsPlusLg className="text-xl" />
          &nbsp; Add Varient
        </button>
      </div> */}
      <div className="py-4 sm:p-4">
        {/* {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${tab.id === activeTab ? "block" : "hidden"
              } bg-white rounded-b-lg`}
          > */}
        <h2 className="text-lg sm:text-2xl font-medium my-4 flex items-center">
          Upload Product Images
          <sup>
            <FaStarOfLife className="text-[10px]" />
          </sup>{" "}
        </h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-5 border-spacing-80    ">
          <p className="text-[12px] p-1 bg-gray-100 text-gray-600 px-4 w-fit">
            <sup>*</sup>Minimum 1 and Maximum 5 Images{" "}
          </p>

          <div className="flex space-x-6 items-center my-6">
            {productImages?.length > 0 && (
              <div className="flex space-x-5">
                {productImages?.map((image, index) => (
                  <div
                    key={index}
                    className="h-20 w-20 sm:h-32 sm:w-32 relative"
                  >
                    {index !== 0 ? (
                      <RxCrossCircled
                        className="text-2xl bg-cyan-500 rounded-full text-white float-right text-right absolute -right-2 -top-2 cursor-pointer"
                        onClick={() => handleDeleteImage(index)}
                      />
                    ) : (
                      ""
                    )}

                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Selected ${index}`}
                      className="object-fill w-full h-full rounded-md border-2 border-dashed border-cyan-300"
                    />
                    <label
                      htmlFor={`file-upload-${index}`}
                      className="capitalize text-cyan-600 underline text-sm text-center hover:text-black hover:font-semibold cursor-pointer"
                    >
                      {index === 0 ? "Change Main Image" : "Change Image"}
                    </label>
                    <input
                      id={`file-upload-${index}`}
                      type="file"
                      multiple
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
                value={values.product_title}
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
                <MainCategory
                  datas={category1Data}
                  get_category_id={get_category_id}
                  setCategory_last_id={setCategory_last_id}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  errors={errors}
                  touched={touched}
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
                  name="product_market_price"
                  value={values.product_market_price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="MRP"
                  className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
                />
                {errors.product_market_price &&
                  touched.product_market_price && (
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
                  value={values.product_discount}
                  className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
                />
                {errors.product_discount && touched.product_discount && (
                  <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                    {errors.product_discount}
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
                  name="product_price"
                  value={Math.round(
                    values.product_market_price -
                      (values.product_discount / 100) *
                        values.product_market_price
                  )}
                  readOnly
                  className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none "
                />
                {errors.product_price && touched.product_price && (
                  <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                    {errors.product_price}
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
                    value={values.gst_category_id}
                    onChange={handleChange}
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
                  value={values.hsn_code}
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
              <label htmlFor="SIZE" className="w-[48%]">
                <p>
                  Product Size<sup>*</sup>
                </p>
                <div className="c500:relative">
                  <div
                    className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none cursor-pointer"
                    onClick={toggleSelectModule}
                  >
                    {inputSizeValue ? inputSizeValue : "Select"}
                  </div>

                  {isSizeOpen && productSizeData && values.product_discount && (
                    <div className="absolute mt-1 left-[10%] c500:left-0 c500:w-full bg-white border z-10 border-gray-300 rounded-md shadow-sm p-2 h-[280px] c500:h-[200px]  ">
                      <div className="flex flex-wrap space-x-2 md:space-x-5 h-[220px] c500:h-[140px] space-y-4 overflow-y-auto whitespace-nowrap ">
                        <label htmlFor=""></label>
                        {productSizeData &&
                          productSizeData.map((val) => (
                            <label
                              key={val.id}
                              className=" py-1 px-4 hover:bg-cyan-50 "
                            >
                              <input
                                key={val.id}
                                type="checkbox"
                                name="option"
                                value={val.title}
                                checked={selectedSizeOptions.includes(
                                  val.title
                                )}
                                onChange={(e) => handleSizeboxChange(e, val.id)}
                                className=" transform scale-150 mr-1 accent-cyan-700  bg-grey-700  rounded cursor-pointer"
                              />
                              &nbsp;&nbsp;{val.title}
                            </label>
                          ))}
                      </div>

                      <div className="flex justify-between">
                        <button
                          onClick={clearAllSize}
                          className=" btn1 text-sm py-[8px]"
                        >
                          Clear All
                        </button>
                        <button
                          onClick={applySelection}
                          className="btn2 text-sm py-1"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
            {/* =================product table==================== */}
            <div className="border border-blue-gray-50 my-4 overflow-x-auto whitespace-nowrap ">
              {/* <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          {TABLE_HEAD.map((val, ind) => {
                            return (
                              <React.Fragment key={val}>
                                <StyledTableCell
                                  align={ind == 0 ? "left" : "right"}
                                >
                                  {val}
                                </StyledTableCell>
                              </React.Fragment>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedSizeOptions?.map((row) => (
                          <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                              {row}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                             0
                            </StyledTableCell>
                            <StyledTableCell align="right">
                            {values.product_market_price}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                            {values.product_discount}%
                            </StyledTableCell>
                            <StyledTableCell align="right">
                            
                            {values.product_market_price-(values.product_discount/100*values.product_market_price) }
                            </StyledTableCell>
                            <StyledTableCell align="right" className="space-x-2">
          
          
                             
                             <Button>edit</Button>
                             <Button>delete</Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer> */}

              <Tables
                selectedValues={selectedValues}
                values={values}
                setSelectedValues={setSelectedValues}
                inputSizeValue={inputSizeValue}
                setInputSizeValue={setInputSizeValue}
                setSelectedSizeOptions={setSelectedSizeOptions}
              />
            </div>

            {/* ====================product attributes============== */}
            <Suspense fallback={"loading"}>
              <Attributes
                category_last_id={category_last_id}
                attributesID={attributesID}
                setAttributeID={setAttributeID}
              />
            </Suspense>

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
                  className="w-full my-2 p-2 sm:w-full"
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
                    {/* 1 Day, 2 Days, 3 Days */}
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
                      value={values.return_period_time}
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
                  placeholder="Low stock alert"
                  name="low_stock"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.low_stock}
                  className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus: placeholder:text-gray-400 outline-none"
                />
                {errors.low_stock && touched.low_stock && (
                  <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                    {errors.low_stock}
                  </p>
                )}
              </label>
            </div>

            {/*======================================*/}

            <div className="flex justify-between mt-4 items-center">
              <label htmlFor="MRP" className="w-[48%]">
                <p>
                  Product Net weight (gm)<sup>*</sup>
                </p>
                <input
                  type="number"
                  name="product_weight"
                  value={values.product_weight}
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

              <label htmlFor="discount" className="w-[48%]">
                <p>
                  Country Of Origin<sup>*</sup>
                </p>
                <Suspense fallback={"loading"}>
                  <CountryOrigin
                    options={countries}
                    onSelect={handleSelect}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    values={values}
                  />
                </Suspense>
              </label>
            </div>

            {/* ================manufactured by which contry========================= */}

            <label htmlFor="MANUFACTURE">
              <p>
                Manufactured By<sup>*</sup>
              </p>
              <input
                type="text"
                onChange={handleChange}
                name="manufactured_by"
                onBlur={handleBlur}
                value={values.manufactured_by}
                placeholder="Manufactured By"
                className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm placeholder:text-gray-400 outline-none "
              />
              {errors.manufactured_by && touched.manufactured_by && (
                <p className="text-red-500 text-sm text-left sm:text-center capitalize">
                  {errors.manufactured_by}
                </p>
              )}
            </label>

            {/* ===================pRODUCTION description field=========================== */}
            <div className="w-full my-4">
              <p className="my-2">
                Product Description
                <span className=" text-[12px] sm:text-sm text-gray-400 ml-2">
                  (optional)
                </span>
              </p>

              <div className="w-full h-[100px] bg-[#ECEFF1]">
                <TextField
                  id="outlined-textarea"
                  // label="Multiline Placeholder"
                  placeholder="Enter Product Description"
                  name="product_desc"
                  value={values.product_desc}
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

            <br />
            <br />
            <br />
            <hr />
            <br />

            <div className="my-2 flex justify-between c500:flex-row text-sm font-semibold">
              <button
                type="button"
                className="btn2"
                onClick={() => location.reload()}
              >
                Clear Details
              </button>

              <button
                type="submit"
                className="btn1"
                onClick={handleSubmit}
                // disabled={initialValues}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        {/* </div>
        ))} */}
      </div>
    </div>
  );
};

export default TabContainer;
