import { cardData } from "./Data";
import Rating from "@mui/material/Rating";
import EditProduct from "./EditProduct.jsx";
import SizeQuantity from "./SizeQuantity.jsx";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AiOutlineDelete } from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";
import { BiChevronRight } from "react-icons/bi";


const Archive = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const handlePreviewOpen = (productData) => {
    setPreviewOpen(true);
    setProductId(productData);
  };

  const handleQuantityOpen = (productData) => {
    setQuantityOpen(true);
    setProductId(productData);
  };
  return (
    <>
      <div className=" bg-white sm:mx-2 py-8">
        {/* filters------------ */}
        <div className="flex justify-between mx-2 items-center">
          <div className="hidden  sm:flex text-2xl font-semibold lg:text-3xl ">
            <h1 className="capitalize">Archive</h1>
            <h1>
              <span className="p-2 px-4 bg-orange-200 text-orange-500 mx-2 rounded-lg">
                {cardData.length}
              </span>
            </h1>
          </div>

         
        </div>

        {/* add procucts======== */}
        <div className="grid grid-cols-1 custom300:grid-cols-2 lg:grid-cols-4 custom400:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[7px] custom400:gap-2 md:gap-5 my-10 ">
          {cardData.map((val, ind) => {
            return (
              <>
                {val.productamount <= 10 && val.productamount >= 1 ? (
                  <div
                    key={ind + 1}
                    className="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg "
                  >
                    <div
                      className=" flex justify-between items-center  z-[3] relative  "
                      style={{ height: "70px" }}
                    >
                      <p className="bg-[#1687a7] text-white text-[12px] h-4 px-2 c500:h-6 pb-6 py-[5px] rounded-e-lg  overflow-hidden">
                        {val.discount}
                      </p>
                      <div className=" mr-2 z-20">
                        <Popover placement="bottom-end">
                          <PopoverHandler>
                            <Button className="bg-white p-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg text-black">
                              {" "}
                              <MoreVertIcon />{" "}
                            </Button>
                          </PopoverHandler>
                          <PopoverContent className=" flex flex-col">
                            <span className="capitalize flex items-center py-2 ">
                              <RiErrorWarningLine className="text-lg" />
                              &nbsp; Edit Product
                            </span>
                            <hr />
                            <span className="capitalize flex items-center py-2">
                              <AiOutlineDelete className="text-lg" /> &nbsp;
                              Move to Inv.
                            </span>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <img
                      src={val.img}
                      alt="images"
                      className="c500:block hidden aspect-[4/4]  -z-10 object-contain -mt-[70px] "
                    />
                    <div className="block c500:hidden">
                      <EditProduct product={val} />
                    </div>

                    <div className="m-2">
                      <div className="c500:block hidden">
                        <h4 className="whitespace-nowrap text-ellipsis overflow-hidden text-sm">
                          {val.title}{" "}
                        </h4>

                        <div className="flex items-end my-[2px]">
                          <p className="text-[#5a5a0a] text-[14px] line-through">
                            &#x20B9;{val.dprice}{" "}
                          </p>
                          &nbsp; &nbsp;
                          <b className="text-green-500">&#x20B9;{val.price}</b>
                        </div>

                        <p className="flex items-end">
                          <Rating
                            name="half-rating"
                            defaultValue={val.star}
                            precision={0.5}
                            size="small"
                            sx={{ fontSize: "21px" }}
                          />
                          &nbsp;
                          <span
                            style={{
                              color: "rgba(19, 19, 19, 0.458)",
                              paddingTop: "3px",
                              fontSize: "14px",
                            }}
                          >
                            ({val.star}){" "}
                          </span>
                        </p>
                      </div>

                      <div className="my-[3px] text-[13px] text-[#5a5a0a] ">
                        Free Delivery &nbsp; &nbsp;{" "}
                        <span className="text-orange-500 font-semibold">
                          5 Left
                        </span>
                      </div>

                      <div className="flex justify-between">
                      <p
                              onClick={() => handleQuantityOpen(val)}
                              className="bg-[#1687a7] text-white w-full  c500:w-[75%] flex justify-center pt-[3px]  h-[32px] rounded-lg cursor-pointer  "
                            >
                              Edit Quantity
                            </p>
                            <div className="">
                              <button
                                onClick={() => handlePreviewOpen(val)}
                                className=" border border-[#1687a7] rounded-lg w-[43px] hidden c500:flex justify-center items-center h-[32px] "
                              >
                                <BiChevronRight className=" text-[#1687a7] text-xl " />
                              </button>
                            </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </>
            );
          })}
        </div>


      
      
      </div>
    </>
  )
}

export default Archive
