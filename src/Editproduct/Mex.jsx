import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router";

export default function Form() {
  const { product_id } = useParams();
  const queryClient = useQueryClient();
  const get_product = (data) =>
    apiRequest({ url: "products/get_product", method: "post", data });

  const { mutate: get_product_data } = useMutation(get_product, {
    onSuccess: (data) => {
      console.log(data);
      setProductData(data?.data);
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

  const [productData, setProductData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("add product");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );

  const [formData, setFormData] = useState({
    name: productData?.product_data.product_title || "",
    email: "",
    number: "",
    password: "",
  });

  useEffect(() => {
    const formData = new FormData();
    formData.append("session_id", "sess_s0n8LZtpnl");
    formData.append("product_id", product_id);
    get_product_data(formData);
  }, [product_id]);

  const {
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    // Access user input from formData
    const userFormData = {
      name: formData.name,
      email: data.email,
      number: data.number,
      password: data.password,
    };
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h1>Registration</h1>
        </div>
        <div>
          <label>Name</label>
          <input
            className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus:placeholder:text-gray-400 outline-none sm:w-[85%]"
            placeholder="Enter person name"
            contentEditable
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
          <error>
            {errors.name?.type === "required" && "Name is required"}
          </error>
        </div>
        <div>
          <label>Email</label>
          <input
            className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus:placeholder:text-gray-400 outline-none sm:w-[85%]"
            placeholder="Enter primary email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
          />
          <error>
            {errors.email?.type === "required" && "Email is required"}
            {errors.email?.type === "pattern" &&
              "Entered email is in the wrong format"}
          </error>
        </div>
        <div>
          <label>Phone Number</label>
          <input
            className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus:placeholder:text-gray-400 outline-none sm:w-[85%]"
            type="number"
            value={formData.number}
            onChange={(e) => {
              setFormData({ ...formData, number: e.target.value });
            }}
          />
          <error>
            {errors.number?.type === "minLength" &&
              "Entered number is less than 6 digits"}
            {errors.number?.type === "maxLength" &&
              "Entered number is more than 12 digits"}
          </error>
        </div>
        <div>
          <label>Password</label>
          <input
            className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus:placeholder:text-gray-400 outline-none sm:w-[85%]"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          <error>
            {errors.password?.type === "minLength" &&
              "Entered password is less than 5 characters"}
            {errors.password?.type === "maxLength" &&
              "Entered password is more than 20 characters"}
          </error>
        </div>
        <div>
          <input
            className="w-full my-2 p-2 py-[10px] text-sm border border-gray-300 hover:border-black rounded-sm focus:placeholder:text-gray-400 outline-none sm:w-[85%]"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
