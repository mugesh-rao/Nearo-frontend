import { lazy, useState, useEffect, useMemo, Suspense } from "react";
import { Line } from "react-chartjs-2";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { BsEmojiSmile, BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";
import MenuItem from "@mui/material/MenuItem";
const Product = lazy(() => import("./Product"));
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";

import Loader from "../utils/Loader";
import { useNavigate } from "react-router-dom";
const DashContent = lazy(() => import("./DashContent"));
import { getSessionId } from "../utils/get_session_id";
import Ratings from "./Ratings";

ChartJS.register(
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

function GraphReal() {
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState("daily");
  const sessionId = getSessionId();
  const options = {
    plugins: {
      legend: {
        position: "none",
      },
    },
  };
  //this is our sub api of revenue chart for requesting main api
  const send_status_id = (data) =>
    apiRequest({
      url: "dashboard/get_shop_revenue_chart",
      method: "post",
      data,
    });
  //this is our sub api for requesting main api *shop _popularity

  const send_session_id = (data) =>
    apiRequest({
      url: "/dashboard/get_shop_popularity_stats",
      method: "post",
      data,
    });

  //this is our reactquery for posting the session id and get the revenue chart data
  const queryClient = useQueryClient();
  const get_chart_data = useMutation(send_status_id, {
    onSuccess: (data) => {
      setChartData(data.data.data);
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
  //this is our reactquery for posting the session id and get the shop popularity data
  const get_shop_popularity_data = useMutation(send_session_id, {
    onSuccess: (data) => {
      setPopularityData(data?.data?.data);
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

  const [popularityData, setPopularityData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return null;
    }, [queryClient])
  );
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      const formData1 = new FormData();
      formData1.append("session_id", sessionId);
      formData1.append("timeframe", timeFrame);
      get_chart_data.mutate(formData1);

      const formData2 = new FormData();
      formData2.append("session_id", sessionId);
      get_shop_popularity_data.mutate(formData2);

      setIsLoading(false);
    }
  }, [timeFrame]);

  const data = {
    labels: chartData["x-axis"],
    datasets: [
      {
        label: "",
        data: chartData["y-axis"],
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0,
        fill: true,
        pointStyle: "round",
        pointBorderColor: "blue",
        pointBackgroundColor: "#fff",
        showLine: false,
      },
    ],
  };

  const formatNumber = (number) => {
    if (number < 1000) {
      return number.toString();
  } else if (number < 1000000) {
      if (number % 1000 === 0) {
          return (number / 1000) + "K";
      } else {
          return (number / 1000).toFixed(1) + "K";
      }
  } else {
      if (number % 1000000 === 0) {
          return (number / 1000000) + "M";
      } else {
          return (number / 1000000).toFixed(1) + "M";
      }
  }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <DashContent />

      <div className="">
        <div className=" md:flex md:justify-between shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] py-8 sm:m-2 my-1 bg-white sm:rounded-lg ">
          <div className="chart md:w-[60%] ">
            <div className="flex justify-between mx-2 items-center">
              <h2 className="text-lg font-semibold sm:text-2xl">
                Revenue Chart
              </h2>

              <FormControl
                sx={{
                  m: "5px 0 5px 0",
                  // minWidth: "150px",
                  border: "none",
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    { border: "1px solid green" },
                  outline: "none",
                }}
                className=" rounded-xl"
                size="small"
              >
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  name="chart_filter"
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(e.target.value)}
                  className=" outline-none h-9 w-[111px] bg-cyan-50 rounded-xl "
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    color: "#1687a7",
                  }}
                >
                  <MenuItem
                    value="daily"
                    sx={{
                      color: "#1687a7",
                    }}
                  >
                    Daily
                  </MenuItem>

                  <MenuItem
                    value={"monthly"}
                    sx={{
                      color: "#1687a7",
                    }}
                  >
                    Monthly
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {/* graph show  */}
            <div>
              <Line
                style={{ minHeight: "190px" }}
                data={data}
                options={options}
                className="w-full"
              ></Line>
            </div>
          </div>

          {/* 2nd div-------------- */}

          <div className="popularity my-8 px-2 sm:flex sm:justify-around md:flex-col md:w-[40%] md:my-0">
            <div>
              <h2 className="text-lg font-semibold my-4 sm:text-2xl md:my-0  ">
                Shop&apos;s Popularity
              </h2>
              <div className=" flex justify-center ">
                <div className="flex w-fit my-4 md:my-6">
                  <div className="p-[10px] bg-[#E2F3E3] rounded-lg ">
                    {" "}
                    <BsEmojiSmile className="text-5xl text-[#3CA83D] " />
                  </div>

                  <div className=" w-full mx-4">
                    <div className="flex space-x-4 items-center">
                      {" "}
                      <p>Followers</p>{" "}
                      <h2 className="text-2xl font-semibold">
                        {formatNumber(
                          popularityData?.shop_followers
                        )}
                      </h2>
                      <BsGraphUpArrow className="text-green-600 text-lg" />
                      <p className="text-[#5a5aa0] text-sm">
                        {popularityData?.shop_followers_change}%
                      </p>{" "}
                    </div>
                    <div className="flex space-x-4 items-center">
                      {" "}
                      <p>Visitors&nbsp; &nbsp;</p>{" "}
                      <h2 className="text-2xl font-semibold">
                        {formatNumber(12000)}
                      </h2>{" "}
                      <BsGraphDownArrow className="text-red-600 text-lg" />{" "}
                      <p className="text-[#5a5aa0] text-sm">
                        {popularityData?.shop_visitors_change}%
                      </p>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="my:8 sm:my-2 ">
              <h2 className="text-lg font-semibold my-4 sm:text-2xl md:my-0">
                Shop Ratings
              </h2>
              <div className="shop-ratings">
                <div className=" my-6 flex flex-col justify-center  items-center">
                  <h2 className="text-lg font-semibold">
                    {popularityData?.avg_review_stars}{" "}
                  </h2>
                  
    <Ratings popularityData={popularityData}/>
                  <p>({formatNumber(1000)})</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Suspense fallback={<Loader />}>
          <Product />
        </Suspense>
      </div>
    </>
  );
}

export default GraphReal;
