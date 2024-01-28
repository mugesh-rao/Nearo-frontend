import { lazy, Suspense } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getSessionId } from "../utils/get_session_id";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
const Loader = lazy(() => import("../utils/Loader"));
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatDateTime } from "../utils/dateTime";
import CustomDialog from "../addProduct/component.jsx/modal/dialog/custom-dialog";
import PayoutProduct from "./PayoutProduct";
import DashContent from "../Dashboard/DashContent";

const PayoutDetails = () => {
  const [timeFrame] = useOutletContext();
  const { activeLinkParam } = useParams();
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const [activeLink, setActiveLink] = useState(activeLinkParam);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    setActiveLink(activeLinkParam);
  }, [activeLinkParam]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);
  //ready for ship product api
  const revenue_details_api = (data) =>
    apiRequest({
      url: "/revenue/payout_details",
      method: "post",
      data: data,
    });

  const queryClient = useQueryClient();

  const { mutate: get_revenue_details, isLoading } = useMutation(
    revenue_details_api,
    {
      onSuccess: (data) => {
        console.log(data?.data.data);
        setLowData(data?.data.data);
        if (lowData?.length === 0) {
          setHasMore(false);
        }
        queryClient.invalidateQueries("low_stocks_data");
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

  const [lowData, setLowData] = useState(
    useMemo(() => {
      const data = queryClient.getQueryData("session_id");
      if (data) {
        return data.data;
      }
      return [];
    }, [queryClient])
  );

  useEffect(() => {
    if (!sessionId) {
      navigate("/login");
    } else {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("page", pageNumber);
      formData.append("timeframe", timeFrame);
      formData.append("filters", "All");

      get_revenue_details(formData);
    }
  }, [sessionId, timeFrame]);

  if (isLoading && pageNumber === 0) {
    return (
      <div className="h-screen grid place-items-center absolute bg-white z-20 top-0 right-0 bottom-0 left-0">
        <Suspense fallback={<div>Loading...</div>}>
          <Loader />
        </Suspense>
      </div>
    );
  }

  if (lowData?.length == 0 || !lowData) {
    return (
      <>
        {activeLink == "/dashboard/revenue/payble_amount" ? (
          <DashContent
           />
        ) : (
          ""
        )}
        <h2 className="h-[450px] text-xl text-center custom400:text-2xl sm:text-3xl text-gray-700 grid place-items-center w-full px-3">
        No payment 
      </h2>
      </>
    );
  }

  return (
    <>
      <div className="p-2 custom400:mx-2 ">
        <h1 className="text-2xl sm:text-3xl font-semibold text-black my-6">
          Payout Details
        </h1>
        <div className="h-[600px] overflow-y-auto py-1">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>S.No.</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">
                    Transaction Reference No.
                  </TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="right">Payment status</TableCell>
                  <TableCell align="right">Product</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowData?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="center">{row?.amount_sent}</TableCell>
                    <TableCell align="center">
                      {row?.payment_reference_1}
                    </TableCell>
                    <TableCell align="right">
                      {row?.payment_sent_time &&
                        formatDateTime(
                          row?.payment_sent_time
                        ).toLocaleDateString()}
                    </TableCell>

                    <TableCell align="right">
                      {row?.is_payment_sent === "0" ? (
                        <button className="text-red-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                          Pending
                        </button>
                      ) : (
                        <button className="text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light">
                          Paid
                        </button>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <button
                        className="text-green-700 p-1 px-3 rounded-lg bg-green-100 text-sm font-light"
                        onClick={() => [setPreview(row?.seller_payout_id)]}
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      {preview && (
        <CustomDialog
          open={preview}
          onNo={() => setPreview(null)}
          size="medium"
          title="All Products"
          className="w-full  mx-auto "
        >
          <PayoutProduct seller_id={preview}/>
        </CustomDialog>
      )}
    </>
  );
};

export default PayoutDetails;
