import logo from "../img/Nearo_blue_logo2.png";
import { useState, useEffect } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";
import Logout from "../Help&Support/Logout.jsx";
import { GiChart } from "react-icons/gi";
import { CiSettings, CiLaptop, CiBoxList } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";
import {
  PiPhoneCallThin,
  PiPlusSquareThin,
} from "react-icons/pi";


const DashMenu = () => {
  const { activeLinkParam } = useParams();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(activeLinkParam);

  useEffect(() => {
    setActiveLink(activeLinkParam);
  }, [activeLinkParam]);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  // Define the style object
  const styles = {
    container: {
      backgroundColor: "#E0F7FA",
      color: "#1687a7",
    },
  };

  return (
    <div className=" lg:shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] sm:min-h-screen  pb-20 bg-white h-full">
     
      {/* <LazyLoadImage src={logo} alt="Nearo" className="w-28 mx-auto my-8" /> */}
      <h1 className="heading w-fit mx-auto py-3 text-5xl  text-[#1687a7]">nearo</h1>

      <div className="flex flex-col items-center my-6">
        <ul className="text-[1.1rem]">
          <NavLink to="/dashboard/" isActive={() => activeLink === "/dashboard/"}>
            
            <li
              className="flex items-center rounded-lg my-3 p-2"
              style={activeLink === "/dashboard/" ? styles.container : {}}
            >
              
              < RxDashboard className="text-2xl font-extralight" />
              &nbsp; &nbsp; Dashboard
            </li>
          </NavLink>
          <NavLink
            to={"inventory"}
            isActive={() => activeLink === "/dashboard/inventory"}
          >
            <li
              className="flex items-center rounded-lg my-3 p-2"
              style={
                activeLink === "/dashboard/inventory" ? styles.container : {}
              }
            >
              <CiLaptop className="text-2xl rotate-180" />
              &nbsp; &nbsp; Inventory
            </li>
          </NavLink>

          <NavLink
            to={"add_product"}
            isActive={() => activeLink === "/dashboard/add_product"}
          >
            {" "}
            <li
              className="flex items-center rounded-lg my-3 p-2"
              style={
                activeLink === "/dashboard/add_product" ? styles.container : {}
              }
            >
              <PiPlusSquareThin className="text-2xl" />
              &nbsp; &nbsp; Add product
            </li>
          </NavLink>

          <NavLink
            to={"orders"}
            isActive={() => activeLink === "/dashboard/orders"}
          >
            {" "}
            <li
              className="flex items-center rounded-lg my-3 p-2"
              style={activeLink === "/dashboard/orders" ? styles.container : {}}
            >
              <CiBoxList className="text-2xl" />
              &nbsp; &nbsp; Order
            </li>
          </NavLink>

          <NavLink
            to={"revenue"}
            isActive={() => activeLink === "/dashboard/revenue"}
          >
            {" "}
            <li
              className="flex items-center rounded-lg my-3 p-2"
              style={
                activeLink === "/dashboard/revenue" ? styles.container : {}
              }
            >
              <GiChart className="text-xl" />
              &nbsp; &nbsp; Revenue
            </li>
          </NavLink>

          <NavLink
            to={"help"}
            isActive={() => activeLink === "/dashboard/help"}
          >
            <li
              className="flex items-center rounded-lg my-3 p-2"
              style={activeLink === "/dashboard/help" ? styles.container : {}}
            >
              <PiPhoneCallThin className="text-2xl" />
              &nbsp; &nbsp; Help & Support
            </li>
          </NavLink>
          <NavLink
            to={"settings"}
            isActive={() => activeLink === "/dashboard/settings"}
          >
            <li
              className="flex items-center rounded-lg my-3 p-2"
              style={
                activeLink === "/dashboard/settings" ? styles.container : {}
              }
            >
              <CiSettings className="text-2xl" />
              &nbsp; &nbsp; Setting
            </li>
          </NavLink>
          <li>
            <Logout />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashMenu;
