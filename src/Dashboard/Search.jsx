import { BiArrowBack } from "react-icons/bi";
import { CiSearch, CiCamera } from "react-icons/ci";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";

const Search = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex justify-between items-center mx-2 my-8">
      <BiArrowBack
        className="text-xl text-[#1687a7]"
        onClick={() => navigate(-1)}
      />
      <div className="flex items-center  bg-[#5a5a5a0a] rounded-md mx-2 w-[80%] ">
        <CiSearch className="text-2xl text-[#1687a7] mx-2 " />
        <input
          type="search"
          name="search"
          placeholder="Search Your Products"
          autoComplete="off"
          className=" w-full rounded-lg py-2 pr-2 bg-transparent outline-none  "
        />
      </div>

      <Button
        variant="outlined"
        component="label"
        size="small"
        sx={{
          height: "38px",
          color: "#1687a7",
          marginTop: "4px",
          minWidth: "40px",
        }}
      >
        <CiCamera className="text-xl" />
        <input hidden accept="image/*" multiple type="file" name="file" />
      </Button>
    </div>
  );
};

export default Search;
