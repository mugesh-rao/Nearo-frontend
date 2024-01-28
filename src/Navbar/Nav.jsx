import { NavLink, useNavigate } from "react-router-dom";
import Nearo_logo from "../img/Nearo_blue_logo2.png";
import { useDispatch, useSelector } from "react-redux";

// import Menunav from "./Menunav.jsx";
import { lazy } from "react";
const Menunav=lazy(()=>import ("./Menunav"))

const Nav = () => {
  const { a } = useSelector((state) => state.showHide);
  const { b } = useSelector((state) => state.showHide);
  const { c } = useSelector((state) => state.showHide);
  const Dispatch = useDispatch();

  const loginHide = () => {
    Dispatch({
      type: "falser",
    });
    Dispatch({
      type: "truelog",
    });
  };
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

  const gotoLog = () => {
    navigate("/login");
    Dispatch({
      type: "truelog",
    });
  };
  return (
    <>
      {c ? (
        <nav className="flex justify-between  p-4 md:px-14 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]  bg-white w-full h-[4.5rem] sticky top-0 z-20 ">
         <div className="flex justify-between w-full items-center 2xl:max-w-[80%] mx-auto ">
         <NavLink to="/">
         <h1 className="heading text-4xl sm:text-5xl mx-3 text-[#1687a7]">nearo</h1>
          </NavLink>

          {a ? (
            <div className="hidden sm:flex space-x-10 items-center">
              <ul
                className=" sm:flex
               w-fit space-x-10 text-lg"
              >
                <li>
                  <NavLink spellCheck="active" to="/">
                    Home
                  </NavLink>{" "}
                </li>
                <li>
                  <a href="#feature">Features</a>
                </li>
                <li>
                  <NavLink spellCheck="active" to="login" onClick={loginHide}>
                    Login
                  </NavLink>{" "}
                </li>
              </ul>
              <button className="btn1" onClick={gotoReg}>
              
                Start Selling
              </button>
            </div>
          ) : (
            ""
          )}

          {b ? (
            <div className="hide">
              <button
                onClick={gotoLog}
                className=" border border-gray-800 px-4 py-2 rounded-xl text-[.9rem] sm:text-lg "
              >
                Login
              </button>
            </div>
          ) : (
            ""
          )}

         </div>
          {a ? (
            <div className=" block sm:hidden ">
              <Menunav />
            </div>
          ) : (
            ""
          )}
        </nav>
      ) : (
        ""
      )}
    </>
  );
};

export default Nav;
