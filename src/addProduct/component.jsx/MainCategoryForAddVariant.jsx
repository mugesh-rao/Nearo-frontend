import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { apiRequest } from "../../utils/BaseApi";

const CategoryForAddVariant = ({
  category1Id,
  category2Id,
  category3Id,
  category4Id,
}) => {
  const queryClient = useQueryClient();
  const category_details_api = (data) =>
    apiRequest({
      url: "datas/get_product_category_details",
      method: "post",
      data,
    });

  const { mutate: getCategory1Details, isLoading: isCategory1Loading } =
    useMutation(category_details_api, {
      onSuccess: (data) => {
        setCategory1Data(data?.data?.data);
        queryClient.invalidateQueries("category_1details");
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
      const data = queryClient.getQueryData("category_1details");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  const { mutate: getCategory2Details, isLoading: isCategory2Loading } =
    useMutation(category_details_api, {
      onSuccess: (data) => {
        setCategory2Data(data?.data?.data);
        queryClient.invalidateQueries("category_2details");
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

  const [category2Data, setCategory2Data] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("category_2details");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  const { mutate: getCategory3Details, isLoading: isCategory3Loading } =
    useMutation(category_details_api, {
      onSuccess: (data) => {
        setCategory3Data(data?.data?.data);
        queryClient.invalidateQueries("category_3details");
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

  const [category3Data, setCategory3Data] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("category_3details");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  const { mutate: getCategory4Details, isLoading: isCategory4Loading } =
    useMutation(category_details_api, {
      onSuccess: (data) => {
        setCategory4Data(data?.data?.data);
        queryClient.invalidateQueries("category_4details");
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

  const [category4Data, setCategory4Data] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("category_4details");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  useEffect(() => {
    const formData1 = new FormData();
    formData1.append("category_id", category1Id);
    const formData2 = new FormData();
    formData2.append("category_id", category2Id);
    const formData3 = new FormData();
    formData3.append("category_id", category3Id);
    const formData4 = new FormData();
    formData4.append("category_id", category4Id);
    getCategory1Details(formData1);
    getCategory2Details(formData2);
    getCategory3Details(formData3);
    getCategory4Details(formData4);
  }, []);



  return (
    <div className="w-full sm:w-[85%] relative">
      <div className="w-full my-2 P-4 h-10 py-[12px] text-sm border border-gray-300 hover:border-black rounded-sm placeholder:text-gray-400 flex justify-between items-center  ">
        {isCategory1Loading || isCategory2Loading || isCategory1Loading || isCategory4Loading ? "Loading..." :<div>
          <button type="button" className={"mx-2 z-10 cursor-not-allowed"}>
            1. {category1Data?.product_category_title} 2.{" "}
            {category2Data?.product_category_title} 3.{" "}
            {category3Data?.product_category_title} 4.{" "}
            {category4Data?.product_category_title}
          </button>
        </div>}
        
      </div>
    </div>
  );
};

export default CategoryForAddVariant;
