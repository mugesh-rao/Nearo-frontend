import { useNavigate } from "react-router";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
const Loader = lazy(() => import("../utils/Loader"));
import { getSessionId } from "../utils/get_session_id";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const RevenueBar = ({timeFrame, setTimeFrame}) => {
  const navigate = useNavigate();
  const sessionId = getSessionId();
  // const [timeFrame, setTimeFrame] = useState("this_week");

  const handleTotal = () => {
    navigate("/dashboard/revenue");
  };
  const handlePayble = () => {
    navigate("/dashboard/revenue/payout_amount");
  };
  const handlePending = () => {
    navigate("/dashboard/revenue/pending");
  };
  const handlePayments = () =>{
    navigate("/dashboard/revenue/payout_details")
  }

  //this is our sub api for requesting main api
  const send_status_id = (data) =>
    apiRequest({
      url: "/revenue/revenue_stats",
      method: "post",
      data: data,
    });

  const queryClient = useQueryClient();
  //this is our react query for posting the session id and get the data
  const { mutate, isLoading } = useMutation(send_status_id, {
    onSuccess: (data) => {
      setBarData(data?.data?.data);
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
  //using use memohook we are storing the response data of api
  const [BarData, setBarData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
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
      formData.append("timeframe", timeFrame);
      mutate(formData);
    }
  }, [timeFrame]);
  const [see,setSee]=useState({
    a:false,b:false,c:false,d:false
  })

  if (isLoading) {
    return (
      <div className="h-screen grid place-items-center absolute bg-white z-20 top-0 right-0 bottom-0 left-0">
        <Suspense fallback={<div>Loading...</div>}>
          <Loader />
        </Suspense>
      </div>
    );
  }


  return (
    <>
      <div className="my-0 mx-2 p-2 pt-10  ">
        <div className="flex justify-between items-center  ">
          <h2 className="text-xl sm:text-2xl text-black font-semibold">
            Shop{`'`}s Revenue
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
                  className=" outline-none h-9 w-[141px] bg-cyan-50 rounded-xl "
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    color: "#1687a7",
                  }}
                >
                  <MenuItem
                    value="this_week"
                    sx={{
                      color: "#1687a7",
                    }}
                  >
                  This Week
                  </MenuItem>

                  <MenuItem
                    value="this_month"
                    sx={{
                      color: "#1687a7",
                    }}
                  >
                   This Month
                  </MenuItem>
                  <MenuItem
                  value="this_year"
                    sx={{
                      color: "#1687a7",
                    }}
                  >
                  This Year
                  </MenuItem>
                  <MenuItem
                   value="last_year"
                    sx={{
                      color: "#1687a7",
                    }}
                  >
                   Last Year
                  </MenuItem>
                  <MenuItem
                  value="older"
                    sx={{
                      color: "#1687a7",
                    }}
                  >
                   Older
                  </MenuItem>
                </Select>
              </FormControl>

        </div>

        <div className=" mx-auto md:w-[90%] grid-cols-2 c500:grid-cols-3 grid sm:grid-cols-4 my-5 gap-6 md:gap-10 ">
          <div
            className=" bg-red-100 rounded-lg p-2 cursor-pointer relative duration-500"
            onClick={handleTotal}
            onMouseEnter={()=>setSee({...see,a:true,b:false,c:false,d:false})}
            onMouseLeave={()=>setSee({...see,a:false})}
          >
          
            <p className="text-[#1687a7]">Total Revenue</p>{" "}
            <h2 className="text-3xl font-semibold">
              &#x20B9;{BarData?.total_revenue}
            </h2>{" "}
            <div className={`absolute -left-1 bg-white shadow-xl ${see.a?"visible ":"invisible"} rounded-lg p-1 text-[14px] border border-gray-200 text-center `}>Total amount of delivered products</div>
          </div>
          
          <div
            className=" bg-green-100 rounded-lg p-2  cursor-pointer relative"
            onClick={handlePayble}
            onMouseEnter={()=>setSee({...see,b:true,a:false,c:false,d:false})}
            onMouseLeave={()=>setSee({...see,b:false})}
          >
            
            <p className="text-[#1687a7]">Payble Amount</p>{" "}
            <h2 className="text-3xl font-semibold">
              &#x20B9;{BarData?.payble_amount}
            </h2>
            <div className={`absolute -left-1 bg-white shadow-xl ${see.b?"visible ":"invisible"} rounded-lg p-1 text-[14px] border border-gray-200 text-center `}>Total amount to receive after end of return period</div>
          </div>
          <div className="bg-cyan-100 rounded-lg p-2 cursor-pointer relative"
          onClick={handlePending}
          onMouseEnter={()=>setSee({...see,c:true,a:false,b:false,d:false})}
          onMouseLeave={()=>setSee({...see,c:false})}
          >
            {" "}
            <p className="text-[#1687a7]">Pending</p>{" "}
            <h2 className="text-3xl font-semibold">
              &#x20B9;{BarData?.pending_amount}
            </h2>
            <div className={`absolute -left-1 bg-white shadow-xl ${see.c?"visible ":"invisible"} rounded-lg p-1 text-[14px] border border-gray-200 text-center`}>
            Total amount of products in return period</div>
            
          </div>
          <div className=" bg-yellow-100 rounded-lg p-2 cursor-pointer relative "
          onClick={handlePayments}
          onMouseEnter={()=>setSee({...see,d:true,a:false,b:false,c:false})}
          onMouseLeave={()=>setSee({...see,d:false})}
          >
           
            <p className="text-[#1687a7]">Payments</p>{" "}
            <h2 className="text-3xl font-semibold">
              {BarData?.payments_slips}
            </h2>
            <div className={`absolute -left-1 bg-white shadow-xl ${see.d?"visible ":"invisible"} rounded-lg p-1 text-[14px] border border-gray-200 text-center `}>
            Total payment receipts to receive in your bank account on every weekend</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RevenueBar;
