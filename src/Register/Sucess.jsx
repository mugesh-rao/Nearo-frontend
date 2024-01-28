import { useEffect } from "react";

import sucess from "../img/sucess.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
const Sucess = () => {
  const Dispatch = useDispatch();
  const navigate = useNavigate();

  // const dash = () => {
  //   navigate("/dashboard");
  //   Dispatch({
  //     type: "falseDash",
  //   });
  // };
  useEffect(() => {
    Dispatch({
      type: "trueDash",
    });
    Dispatch({
      type: "falselog",
    });
    Dispatch({
      type: "falser",
    });
  }, []);

  return (
    <>
      <div className="grid place-items-center h-screen ">
        <div>
          <h1 className=" text-3xl sm:text-4xl md:text-5xl font-bold text-center ">
            You have  <span className="text-[#1687a7]" >Sucessfully <br /> Registered !</span>{" "}
          </h1>
          <img src={sucess} alt="" className=" w-[240px] sm:w-[270px]  md:w-[300px]  mx-auto my-4" />
          <button className="py-2 px-16 sm:px-20 bg-white text-[#1687a7] border border-[#1687a7] rounded-xl block mx-auto capitalize
          " >Please wait! it may takes 24 hours to approve you as a seller</button>
        </div>
      </div>
    </>
  );
};

export default Sucess;
