import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../utils/BaseApi";

const addSellerDetails = (newSellerDetails) => {
  apiRequest({
    url: "/login/register",
    method: "post",
    data: newSellerDetails,
  });
};

export const addNewSeller = () => {
  const queryClient = useQueryClient();
  return useMutation(addSellerDetails, {
    onSuccess: (data) => {
      console.log(data);

      queryClient.invalidateQueries("seller_details");
    },
    onError: (err) => {
      alert(err);
    },
  });
};

const checkShopStatusApi = (data) => {
  apiRequest({
    url: "shop/check_if_shop_profile_completed",
    method: "post",
    data: data,
  });
};

export const checkIfShopProfileCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation(checkShopStatusApi, {
    onSuccess: (data) => {
      console.log(data);

      queryClient.invalidateQueries("seller_details");
    },
    onError: (err) => {
      alert(err);
    },
  });
};








