import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { RxCross1 } from "react-icons/rx";
import { RiErrorWarningLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";

const Pops = () => {
  const [show, setShow] = useState(false);
  const open = () => {
    setShow(!show);
  };

  const Click = () => {
    return (
      <>
        <div className="bg-white p-2 shadow-xl rounded-lg z-10">
          <p className="float-right text-red-500">
            {" "}
            <RxCross1 onClick={open} />
          </p>
          <br />
          <ul className="text-[12px] custom400:text-sm">
            <li className="flex items-center ">
              {" "}
              <RiErrorWarningLine />
              &nbsp; Edit{" "}
              <span className="hidden custom400:block">Product</span>
            </li>
            <hr />
            <li className="flex items-center">
              {" "}
              <AiOutlineDelete />
              &nbsp; Delete{" "}
              <span className="hidden custom400:block">Product</span>
            </li>
          </ul>
        </div>
      </>
    );
  };

  return (
    <>
      {show === false ? (
        <p className="bg-white p-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg">
          <MoreVertIcon onClick={open} />
        </p>
      ) : (
        ""
      )}

      {show ? <Click /> : ""}
    </>
  );
};

export default Pops;
