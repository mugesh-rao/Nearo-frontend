import { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import home from "../img/Nearo-home.mp4";
import Loader from "../utils/Loader.jsx";
const Features = lazy(() => import("./Features"));
const Work = lazy(() => import("./Work.jsx"));
const Footer = lazy(() => import("../Footer.jsx"));

const Home = () => {
  const Dispatch = useDispatch();
  const navigate = useNavigate();
  const gotoReg = () => {
    navigate("/signup/personaldetails");
    Dispatch({
      type: "falser",
    });
    Dispatch({
      type: "falselog",
    });
  };
  useEffect(() => {
    Dispatch({
      type: "truer",
    });
    Dispatch({
      type: "truelog",
    });
    Dispatch({
      type: "trueDash",
    });
    document.body.style.overflowY = "scroll";
  });

  return (
    <>
      <div className=" 2xl:w-[80%] mx-auto ">
        <div className="home mt-4 text-center lg:text-left flex flex-col lg:flex-row p-2 sm:px-12 justify-between  ">
          <div className=" flex flex-col justify-center lg:w-[50%]" id="home">
            <h1 className="text-5xl font-bold sm:text-[5rem] lg:font-bold ">
              Become a <br />
              <span className="text-[#1687a7]">Seller!</span>{" "}
            </h1>
            <p className="my-5 text-[#757575] lg:text-lg font-extralight ">
              Looking to expand your bussiness beyond your local cummunity and
              tap into a wider customer base ? Join Our e-commerce platform as a
              seller So why wait? Sign up today
            </p>
            <div className="w-full flex items-center justify-center  lg:justify-normal flex-col custom300:flex-row  ">
              <button
                onClick={gotoReg}
                className="btn1 w-full custom300:w-fit "
              >
                Start Selling
              </button>
              <button className="btn2 my-4 w-full custom300:w-fit custom300:ml-2  custom400:mx-5">
                Take a tour
              </button>
            </div>
          </div>
          <div className="home-box sm:ml-4 ">
            {/* <img src={home} alt="" className="mx-auto " />
             */}
            <video width="640" height="360" autoPlay loop controls={false}>
              <source src={home} type="video/mp4" />
            </video>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white">
              <Loader />
            </div>
          }
        >
          <Features />
          <Work />
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
