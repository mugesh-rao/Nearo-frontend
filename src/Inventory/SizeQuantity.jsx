import { Suspense, useEffect, useMemo, useState, lazy } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { getSessionId } from "../utils/get_session_id";
import axios from "axios";
import toast from "react-hot-toast";
const Loader = lazy(() => import("../utils/Loader.jsx"));

const SizeQuantity = (props) => {
  const [quantityData, setQuantityData] = useState(null);
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const queryClient = useQueryClient();
  const product_sizes = (data) =>
    apiRequest({ url: "products/get_product_sizes", method: "post", data });

  const { mutate: get_product_sizes, isLoading } = useMutation(product_sizes, {
    onSuccess: (data) => {
      setQuantityData(data?.data?.prod_size_data || []);
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

  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("product_id", props?.product?.product_id);
      get_product_sizes(formData);
    }
  }, [sessionId]);

  const changeValue = (index, event) => {
    const value = event.target.value;
    const updatedQuantityData = [...quantityData];

    updatedQuantityData[index].quantity_available = parseInt(value, 10);

    setQuantityData(updatedQuantityData);
  };

  const increaseSize = (index) => {
    const updatedQuantityData = [...quantityData];
    updatedQuantityData[index].quantity_available =
      parseInt(updatedQuantityData[index].quantity_available, 10) + 1;
    setQuantityData(updatedQuantityData);
  };

  const decreaseSize = (index) => {
    const updatedQuantityData = [...quantityData];
    updatedQuantityData[index].quantity_available = updatedQuantityData[index].quantity_available>0? parseInt(+updatedQuantityData[index].quantity_available, 10) - 1:0
     
    setQuantityData(updatedQuantityData);
  };

  const postSizeQuantity = async (dataArray) => {
    const results = [];

    for (const data of dataArray) {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("product_id", data.product_id);
      formData.append("quantity", data.quantity_available);
      formData.append("mrp", data.mrp);
      formData.append("price", data.price);
      try {
        const response = await axios.post(
          "https://nearo.in/seller_app/index.php/seller/products/update_product_quantity_price",
          formData
        );
        results.push(response.data);
      } catch (error) {
        console.error(`Error posting data: ${error.message}`);
        results.push(null);
      }
    }

    return results;
  };

  function hasSuccessValueOne(responseArray) {
    return responseArray.some((response) => response.success === 1);
  }

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    postSizeQuantity(quantityData)
      .then((results) => {
        if (hasSuccessValueOne(results)) {
          toast.success("Product quantity updated successfully");
          props.setQuantityOpen(false);
        } else {
          toast.error("Product quantity could not updated successfully");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="text-black">
      <ul>
        {!quantityData || isLoading ? (
          <>
            <div className="grid place-items-center absolute bg-white z-20 top-0 right-0 bottom-0 left-0">
              <Suspense fallback={<div>Loading...</div>}>
                <Loader />
              </Suspense>
            </div>
          </>
        ) : (
          quantityData.map((product, index) => {
            return (
              <li
                className={`flex justify-between items-center ${index==0?"my-0":"my-4"}`}
                key={index}
              >
                <p className="text-sm custom400:text-lg c500:text-xl custom400:font-semibold">
                  <span className="text-[#1687a7]">
                    {product.product_main_attribute_value_title}
                  </span>
                </p>
                <div className="flex space-x-2 c500:space-x-4 items-center">
                  <Box>
                    <RemoveIcon onClick={() => decreaseSize(index)} />
                  </Box>
                  <input
                    type="number"
                    onChange={(event) => changeValue(index, event)}
                    name={`quantity-${index}`}
                    value={product.quantity_available}
                    className="w-14 h-8 focus:outline-none rounded-lg bg-[#d9d9d9] p-1 text-center"
                  />
                  <Box>
                    <AddIcon onClick={() => increaseSize(index)} />
                  </Box>
                </div>
              </li>
            );
          })
        )}
      </ul>
      <button
        className="w-full btn1 mt-4"
        onClick={(event) => handleSaveChanges(event)}
      >
        Save Changes
      </button>
    </div>
  );
};

export default SizeQuantity;
