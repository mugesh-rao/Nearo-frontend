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


export default function Tables({ selectedValues, values,setSelectedValues,inputSizeValue,setInputSizeValue,setSelectedSizeOptions }) {
  const [tableData, setTableData] = React.useState([...selectedValues])
  React.useEffect(() => {
    setTableData([...selectedValues]);
  }, [selectedValues]);
  
  // console.log(tableData,selectedValues);

  const handleEdit = (index) => {
    const updatedData = [...tableData];
    updatedData[index].isEditing = true;
    setTableData(updatedData);
  };

  const handleApply = (index) => {
    const updatedData = [...tableData];
    updatedData[index].isEditing = false;
    setTableData(updatedData);
    setSelectedValues(updatedData)
  };

  const handleDelete = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
    setSelectedValues(updatedData)
    const updatedOptions = updatedData.map(item => item.name);
    setSelectedSizeOptions(updatedOptions);
        // Split the input string by commas to create an array
        const valuesArray = inputSizeValue.split(',');
  
        // Check if the indexToDelete is within valid bounds
        if (index >= 0 && index < valuesArray.length) {
          // Remove the value at the specified index
          valuesArray.splice(index, 1);
      
          // Join the remaining values with commas to form a new string
          const updatedString = valuesArray.join(',');
      
          setInputSizeValue(updatedString) 
        } else {
          // Index is out of bounds, return the original string
          setInputSizeValue(inputSizeValue) 
        }
    
    
  };

  const TABLE_HEAD = [
    "Size",
    "Quantity",
    "MRP",
    "Discount",
    "Sell Price",
    "Action",
  ];

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
                {row.name}
              </StyledTableCell>
              {row.isEditing ? (
                <>
                  <StyledTableCell align="right">
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => {
                        const updatedData = [...tableData];
                        updatedData[index].quantity = parseInt(e.target.value);
                        updatedData[index].price=Math.round(row.mrp-(row.mrp*row.discount)/100)
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
                        updatedData[index].price=Math.round(row.mrp-(row.mrp*row.discount)/100)
                        setTableData(updatedData);
                      }}
                      className="w-14 outline-none "
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <input
                      type="number"
                      value={row.discount}
                      onChange={(e) => {
                        const updatedData = [...tableData];
                        updatedData[index].discount = parseInt(e.target.value);
                        updatedData[index].price=Math.round(row.mrp-(row.mrp*row.discount)/100)
                        setTableData(updatedData);
                      }}
                      className="w-14 outline-none "
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">{Math.round(row.mrp-(row.mrp*row.discount)/100)}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Button onClick={() => handleApply(index)}>Apply</Button>
                  </StyledTableCell>
                </>
              ) : (
                <>
                  <StyledTableCell align="right">{row.quantity}</StyledTableCell>
                  <StyledTableCell align="right">{row.mrp}</StyledTableCell>
                  <StyledTableCell align="right">{row.discount}</StyledTableCell>
                  <StyledTableCell align="right">{Math.round(row.mrp-(row.mrp*row.discount)/100)}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Button onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(index)}>
                      Delete
                    </Button>
                  </StyledTableCell>
                </>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
