import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { apiRequest } from "../../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import { getSessionId } from "../../utils/get_session_id";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.gray,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Tables = ({ data }) => {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  const navigate = useNavigate();

  const [tableData, setTableData] = React.useState([...data]);
  React.useEffect(() => {
    setTableData([...data]);
  }, [data]);

  const goToProductPage = (productId) => {
    navigate(`/dashboard/add_product/edit/${productId}`);
  };

  const update_product_sizes = (data) =>
    apiRequest({
      url: "products/update_product_quantity_price",
      method: "post",
      data,
    });

  const { mutate: addProductSizes, isLoading: loading_product_images } =
    useMutation(update_product_sizes, {
      onSuccess: (data) => {
        if (data?.data?.success) {
          toast.success(data?.data?.message);
        } else {
          toast.error(data?.data?.message);
        }
        queryClient.invalidateQueries("add_products");
      },
      onError: (err) => {
        toast.error(err);
      },
      retry: {
        maxAttempts: 3,
        delay: (attempt) => {
          return attempt * 1000;
        },
      },
    });

  const updateProductSize = (sizeData) => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("product_id", sizeData.product_id);
    formData.append("quantity", sizeData.quantity_available);
    formData.append("mrp", sizeData.mrp);
    formData.append("price", sizeData.price);
    addProductSizes(formData);
  };

  const handleApply = (index) => {
    const updatedData = [...tableData];
    updateProductSize(updatedData[index]);
    setTableData(updatedData);
  };

  const TABLE_HEAD = ["Size", "Quantity", "MRP", "Sell Price", "Action"];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {TABLE_HEAD.map((val, ind) => (
              <React.Fragment key={val}>
                <StyledTableCell align={ind === 0 ? "left" : "right"}>
                  {val}
                </StyledTableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <StyledTableRow key={row.main_attribute_value_id}>
              <StyledTableCell component="th" scope="row">
                {row.product_main_attribute_value_title}
              </StyledTableCell>
              <StyledTableCell align="right">
                <input
                  type="number"
                  value={row.quantity_available}
                  onChange={(e) => {
                    const updatedData = [...tableData];
                    updatedData[index].quantity_available = parseInt(
                      e.target.value
                    );
                    setTableData(updatedData);
                  }}
                  className="w-14 outline-none "
                />
              </StyledTableCell>
              <StyledTableCell align="right">
                <input
                  type="number"
                  value={row.mrp}
                  onChange={(e) => {
                    const updatedData = [...tableData];
                    updatedData[index].mrp = parseInt(e.target.value);
                    setTableData(updatedData);
                  }}
                  className="w-14 outline-none "
                />
              </StyledTableCell>
              <StyledTableCell align="right">
                <input
                  type="number"
                  value={row.price}
                  onChange={(e) => {
                    const updatedData = [...tableData];
                    updatedData[index].price = parseInt(e.target.value);
                    setTableData(updatedData);
                  }}
                  className="w-14 outline-none"
                />
              </StyledTableCell>
              <StyledTableCell align="right">
                <Button onClick={() => handleApply(index)}>Save</Button>
                <Button onClick={() => goToProductPage(row?.product_id)}>EDIT Size</Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tables;
