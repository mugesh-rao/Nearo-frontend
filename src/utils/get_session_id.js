import Cookies from "js-cookie";

export const getSessionId = () => {
  return Cookies.get("session_id");
};
