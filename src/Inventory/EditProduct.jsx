// import { useState, useEffect, useMemo } from "react";
// import Rating from "@mui/material/Rating";
// import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
// import { AiOutlineDelete } from "react-icons/ai";
// import { apiRequest } from "../utils/BaseApi";
// import { useMutation, useQueryClient } from "react-query";
// import { getSessionId } from "../utils/get_session_id";
// import { useNavigate } from "react-router-dom";
// import classNames from "../utils/classNames";
// import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog";
// import SizeQuantity from "./SizeQuantity";
// import Loader from "../utils/Loader";

// const EditProduct = (props) => {
//   const queryClient = useQueryClient();
//   const sessionId = getSessionId();
//   const navigate = useNavigate();
//   const [imgShow, setImgShow] = useState(null);
//   const [productImages, setProductImages] = useState([]);
//   const [productVariants, setProductVariants] = useState([]);
//   const [productSizeData, setProductSizeData] = useState([]);
//   const [productAttributes, setProductAttributes] = useState([]);
//   const [quantityOpen, setQuantityOpen] = useState(false);

//   const get_product = (data) =>
//     apiRequest({ url: "products/get_product", method: "post", data });

//   const { mutate: get_product_data, isLoading: isloading } = useMutation(
//     get_product,
//     {
//       onSuccess: (data) => {
//         setProductData(data?.data);
//         setProductSizeData(data?.data?.prod_size_data);
//         setProductAttributes(data?.data?.p_attr_desc_data);
//         setProductImages(data?.data?.product_data?.images.split(","));
//         setProductVariants(data?.data?.p_variation_data);
//         queryClient.invalidateQueries("add_products");
//       },

//       onError: (err) => {
//         console.log(err);
//       },
//       retry: {
//         maxAttempts: 3,
//         delay: (attempt) => {
//           return attempt * 1000;
//         },
//       },
//     }
//   );

//   const [productData, setProductData] = useState(
//     useMemo(() => {
//       const data = queryClient.getQueryData("add_products");
//       if (data) {
//         return data.data;
//       }
//       return null;
//     }, [queryClient])
//   );

//   const [productId, setProductId] = useState(props.product.product_id);

//   useEffect(() => {
//     if (!sessionId) {
//       navigate("/login");
//     } else {
//       const formData = new FormData();
//       formData.append("session_id", sessionId);
//       formData.append("product_id", productId);
//       get_product_data(formData);
//     }
//   }, [props, sessionId, productId]);

//   const goToProductPage = (productId) => {
//     navigate(`/dashboard/add_product/edit/${productId}`);
//   };

//   const handleQuantityOpen = (productData) => {
//     setQuantityOpen(true);
//     setProductId(productData);
//   };
//   const [selectedColour, startSelectColour] = useState(null);

//   const [visibleImages, setVisibleImages] = useState(4);

//   const showMoreImages = () => {
//     // Set visibleImages to the total number of productVariants when "more..." is clicked
//     setVisibleImages(productVariants.length);
//   };

//   if (isloading) {
//     return (
//       <h2 className="w-full h-full grid place-items-center bg-white ">
//         <Loader />
//       </h2>
//     );
//   }

//   return (
//     <div className="w-full h-auto flex flex-col  md:flex-row  md:space-x-3  ">
//       <div className="product-image w-full md:w-[34%] flex flex-col c500:flex-row-reverse md:flex-col c500:items-center md:items-start justify-center gap-x-2 md:block">
//         <img
//           src={
//             imgShow
//               ? imgShow
//               : productImages && productImages
//               ? productImages[0]
//               : ""
//           }
//           alt="main img"
//           className="aspect-[3/2] object-contain  w-[300px] sm:w-[340px] md:w-full min-h-[350px] rounded-lg input-border cursor-pointer duration-500"
//         />
//         <div className="flex flex-row c500:flex-col  md:flex-row c500:w-fit overflow-x-scroll  c500:overflow-y-scroll md:overflow-x-scroll whitespace-nowrap gap-1 my-2">
//           {productImages?.map((val, ind) => {
//             return (
//               <img
//                 key={ind + 1}
//                 src={val}
//                 alt="imagex"
//                 onClick={() => {
//                   setImgShow(val);
//                 }}
//                 className={`h-[5rem] w-[64px] object-contain ${
//                   imgShow === val ? "border-2" : "border"
//                 } border-[#1687a7] duration-500`}
//               />
//             );
//           })}
//         </div>
//       </div>
//       <div className="product-about w-full md:w-[64%] mt-0 ">
//         <div className="flex justify-between">
//           <span className=" bg-red-100 text-[12px] custom400:text-sm px-4 py-2 rounded-xl text-gray-600">
//             {productData?.product_data?.quantity_available} Left in Stock
//           </span>{" "}
//         </div>

//         <h4 className="my-2 text-[1rem] sm:text-xl text-black">
//           {productData?.product_data?.product_title}
//         </h4>

//         <div className="flex items-center ">
//           <Rating
//             name="half-rating"
//             value={productData?.product_data?.avg_review_stars}
//             precision={0.5}
//             size="large"
//             readOnly
//             sx={{ fontSize: "25px" }}
//           />
//           &nbsp; &#x2772;
//           <p>
//             {`${
//               productData?.product_data?.num_total_reviews
//                 ? productData?.product_data?.num_total_reviews
//                 : "0"
//             }`}
//             &#x2773;
//           </p>
//         </div>

//         <div className="flex items-center my-2 space-x-3">
//           <h2 className="text-2xl custom400:text-3xl sm:text-4xl font-semibold text-[#1687a7] ">
//             &#x20B9; {productData?.product_data?.price}
//           </h2>

//           <p className="text-sm sm:text-[1.1rem] text-[#5a5a0a] line-through  ">
//             &#x20B9; {productData?.product_data?.mrp}
//           </p>

//           <p className=" text-lg sm:text-xl text-green-600">
//             &nbsp;{productData?.product_data?.discount_percent}% off
//           </p>
//         </div>

//         <div className="flex items-center">
//           <p className="text-[#5a5a0a]"> Color : </p> &nbsp; &nbsp;
//           <h5 className="text-lg font-semibold">
//             {selectedColour && selectedColour
//               ? selectedColour
//               : productData?.product_data
//                   ?.product_variation_attribute_value_title &&
//                 productData?.product_data
//                   ?.product_variation_attribute_value_title
//               ? productData?.product_data
//                   ?.product_variation_attribute_value_title
//               : ""}
//           </h5>
//         </div>

//         <div className={`flex items-end gap-1 c500:gap-2 w-[95%] custom450:w-[80%] ${ productVariants?.length > 4 &&visibleImages < productVariants?.length?"flex-wrap":productVariants?.length > 4?"overflow-x-scroll whitespace-nowrap":""} `}>

//       {productVariants?.slice(0, visibleImages).map((val, ind) => {
//         return (
//           <img
//             key={ind + 1}
//             src={val.main_image}
//             alt="d"
//             className={`${classNames(
//               productId === val.product_id
//                 ? "border-2 border-[#1687a7] "
//                 : ""
//             )} rounded-lg h-16 w-[60px] c500:w-[70px] cursor-pointer`}
//             onClick={() => [
//               setProductId(val.product_id),
//               startSelectColour(val.colour),
//             ]}
//           />
//         );
//       })}
//       {productVariants?.length > 4 && visibleImages < productVariants?.length && (
//         <button onClick={showMoreImages} className=" text-sm font-semibold">More...</button>
//       )}
//     </div>

//         <div className="flex items-start my-2">
//           <p className="text-[#5a5a0a]">Size:&nbsp; </p>
//           <div className="text-sm sm:text-lg tracking-widest text-black flex flex-wrap cursor-pointer gap-4 w-[90%] capitalize">
//             {productSizeData?.map((sizeData, index) => {
//               return (
//                 <h1
//                   key={index}
//                   className={classNames(
//                     sizeData?.product_id === productId ? "underline font-semibold" : ""
//                   )}
//                   onClick={() => setProductId(sizeData.product_id)}
//                 >
//                   {sizeData.product_main_attribute_value_title}
//                 </h1>
//               );
//             })}
//           </div>{" "}
//         </div>

//         <ul className="text-sm capitalize">
//           {productAttributes?.slice(0, 4).map((attribute, index) => {
//             return (
//               <li key={index}>
//                 {attribute?.name} {":"} {attribute?.value}
//               </li>
//             );
//           })}
//         </ul>
//         <div className="flex justify-between mt-3 relative bottom-0 ">
//           <button
//             className="w-[72%] custom400:w-[80%] bg-[#1687a7] text-white rounded-lg py-1 custom400:py-2"
//             onClick={(event) => [
//               handleQuantityOpen(productData?.product_data),
//               event.stopPropagation(),
//             ]}
//           >
//             Edit Quantity
//           </button>
//           <button
//             className="w-[24%] custom400:w-[18%] input-border py-1 custom400:py-2 text-center"
//             onClick={() =>
//               goToProductPage(productData?.product_data?.product_id)
//             }
//           >
//             <DriveFileRenameOutlineIcon sx={{ color: "#1687a7" }} />
//           </button>
//         </div>
//       </div>
//       {quantityOpen && (
//         <CustomDialog
//           open={quantityOpen}
//           onNo={() => setQuantityOpen(false)}
//           size="small"
//           title="Edit Quantities"
//         >
//           <SizeQuantity product={productId} setQuantityOpen={setQuantityOpen} />
//         </CustomDialog>
//       )}
//     </div>
//   );
// };

// export default EditProduct;

import { useState, useEffect, useMemo } from "react";
import Rating from "@mui/material/Rating";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { AiOutlineDelete } from "react-icons/ai";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { getSessionId } from "../utils/get_session_id";
import { useNavigate } from "react-router-dom";
import classNames from "../utils/classNames";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog";
import SizeQuantity from "./SizeQuantity";
import Loader from "../utils/Loader";

const EditProduct = (props) => {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  const navigate = useNavigate();
  const [imgShow, setImgShow] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [productSizeData, setProductSizeData] = useState([]);
  const [productAttributes, setProductAttributes] = useState([]);
  const [quantityOpen, setQuantityOpen] = useState(false);

  const get_product = (data) =>
    apiRequest({ url: "products/get_product", method: "post", data });

  const { mutate: get_product_data, isLoading: isloading } = useMutation(
    get_product,
    {
      onSuccess: (data) => {
        setProductData(data?.data);
        setProductSizeData(data?.data?.prod_size_data);
        setProductAttributes(data?.data?.p_attr_desc_data);
        setProductImages(data?.data?.product_data?.images.split(","));
        setProductVariants(data?.data?.p_variation_data);
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

  const [productData, setProductData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("add_products");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  const [productId, setProductId] = useState(props.product.product_id);

  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("product_id", productId);
      get_product_data(formData);
    }
  }, [props, sessionId, productId]);

  const goToProductPage = (productId) => {
    navigate(`/dashboard/add_product/edit/${productId}`);
  };

  const handleQuantityOpen = (productData) => {
    setQuantityOpen(true);
    setProductId(productData);
  };
  const [selectedColour, startSelectColour] = useState(null);

  const [visibleImages, setVisibleImages] = useState(4);

  const showMoreImages = () => {
    // Set visibleImages to the total number of productVariants when "more..." is clicked
    setVisibleImages(productVariants.length);
  };

  if (isloading) {
    return (
      <h2 className="w-full h-full grid place-items-center bg-white ">
        <Loader />
      </h2>
    );
  }

  return (
    <div className="w-full h-auto flex flex-col md:flex-row md:space-x-3 ">
      <div className="product-image w-full md:w-[34%] flex flex-col custom400:flex-row-reverse md:flex-col  md:items-start justify-center gap-x-0 md:block ">
        <img
          src={
            imgShow
              ? imgShow
              : productImages && productImages
              ? productImages[0]
              : ""
          }
          alt="main img"
          className="aspect-[3/2] object-contain w-full  custom400:w-[240px] sm:w-[340px] md:w-full min-h-[350px] rounded-lg input-border cursor-pointer duration-500"
        />
        <div className="flex flex-row custom400:flex-col md:flex-row custom400:w-fit overflow-x-scroll custom400:overflow-y-scroll md:overflow-x-scroll whitespace-nowrap gap-1 my-2 ">
          {productImages?.map((val, ind) => {
            return (
              <img
                key={ind + 1}
                src={val}
                alt="imagex"
                onClick={() => {
                  setImgShow(val);
                }}
                className={`h-[5rem] w-[64px] object-contain ${
                  imgShow === val ? "border-2" : "border"
                } border-[#1687a7] duration-500`}
              />
            );
          })}
        </div>
      </div>
      <div className="product-about w-full md:w-[64%]  ">
        <div className="flex justify-between">
          <span className=" bg-red-100 text-[12px] custom400:text-sm px-4 py-2 rounded-xl text-gray-600">
            {productData?.product_data?.quantity_available} Left in Stock
          </span>{" "}
        </div>

        <h4 className="my-2 text-[1rem] sm:text-xl text-black">
          {productData?.product_data?.product_title}
        </h4>

        <div className="flex items-center ">
          <Rating
            name="half-rating"
            value={productData?.product_data?.avg_review_stars}
            precision={0.5}
            size="large"
            readOnly
            sx={{ fontSize: "25px" }}
          />
          &nbsp; &#x2772;
          <p>
            {`${
              productData?.product_data?.num_total_reviews
                ? productData?.product_data?.num_total_reviews
                : "0"
            }`}
            &#x2773;
          </p>
        </div>

        <div className="flex items-center my-2 space-x-3">
          <h2 className="text-2xl custom400:text-3xl sm:text-4xl font-semibold text-[#1687a7] ">
            &#x20B9; {productData?.product_data?.price}
          </h2>

          <p className="text-sm sm:text-[1.1rem] text-[#5a5a0a] line-through  ">
            &#x20B9; {productData?.product_data?.mrp}
          </p>

          <p className=" text-lg sm:text-xl text-green-600">
            &nbsp;{productData?.product_data?.discount_percent}% off
          </p>
        </div>

        <div className="flex items-center">
          <p className="text-[#5a5a0a]"> Color : </p> &nbsp; &nbsp;
          <h5 className="text-lg font-semibold">
            {selectedColour && selectedColour
              ? selectedColour
              : productData?.product_data
                  ?.product_variation_attribute_value_title &&
                productData?.product_data
                  ?.product_variation_attribute_value_title
              ? productData?.product_data
                  ?.product_variation_attribute_value_title
              : ""}
          </h5>
        </div>

        <div
          className={`flex items-end gap-1 c500:gap-2 w-[95%] custom450:w-[80%] ${
            productVariants?.length > 4 &&
            visibleImages < productVariants?.length
              ? "flex-wrap"
              : productVariants?.length > 4
              ? "overflow-x-scroll whitespace-nowrap"
              : ""
          } `}
        >
          {productVariants?.slice(0, visibleImages).map((val, ind) => {
            return (
              <img
                key={ind + 1}
                src={val.main_image}
                alt="d"
                className={`${classNames(
                  productId === val.product_id
                    ? "border-2 border-[#1687a7] "
                    : ""
                )} rounded-lg h-16 w-[60px] c500:w-[70px] cursor-pointer`}
                onClick={() => [
                  setProductId(val.product_id),
                  startSelectColour(val.colour),
                ]}
              />
            );
          })}
          {productVariants?.length > 4 &&
            visibleImages < productVariants?.length && (
              <button
                onClick={showMoreImages}
                className=" text-sm font-semibold"
              >
                More...
              </button>
            )}
        </div>

        <div className="flex items-start my-2">
          <p className="text-[#5a5a0a]">Size:&nbsp; </p>
          <div className="text-sm sm:text-lg tracking-widest text-black flex flex-wrap cursor-pointer gap-4 w-[90%] capitalize">
            {productSizeData?.map((sizeData, index) => {
              return (
                <h1
                  key={index}
                  className={classNames(
                    sizeData?.product_id === productId
                      ? "underline font-semibold"
                      : ""
                  )}
                  onClick={() => setProductId(sizeData.product_id)}
                >
                  {sizeData.product_main_attribute_value_title}
                </h1>
              );
            })}
          </div>{" "}
        </div>

        <ul className="text-sm capitalize">
          {productAttributes?.slice(0, 4).map((attribute, index) => {
            return (
              <li key={index}>
                {attribute?.name} {":"} {attribute?.value}
              </li>
            );
          })}
        </ul>
        <div className="flex justify-between mt-3 relative bottom-0 ">
          <button
            className="w-[72%] custom400:w-[80%] bg-[#1687a7] text-white rounded-lg py-1 custom400:py-2"
            onClick={(event) => [
              handleQuantityOpen(productData?.product_data),
              event.stopPropagation(),
            ]}
          >
            Edit Quantity
          </button>
          <button
            className="w-[24%] custom400:w-[18%] input-border py-1 custom400:py-2 text-center"
            onClick={() =>
              goToProductPage(productData?.product_data?.product_id)
            }
          >
            <DriveFileRenameOutlineIcon sx={{ color: "#1687a7" }} />
          </button>
        </div>
      </div>
      {quantityOpen && (
        <CustomDialog
          open={quantityOpen}
          onNo={() => setQuantityOpen(false)}
          size="small"
          title="Edit Quantities"
        >
          <SizeQuantity product={productId} setQuantityOpen={setQuantityOpen} />
        </CustomDialog>
      )}
    </div>
  );
};

export default EditProduct;
