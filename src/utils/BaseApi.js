import axios from "axios";

const client = axios.create({ baseURL: "https://nearo.in/seller_app/index.php/seller" });

export const apiRequest = ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer Token`;
  const onSuccess = (response) =>response;
  const onError = (error) => error;
  return client(options).then(onSuccess).catch(onError);
};





