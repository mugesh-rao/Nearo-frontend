import Nearo_white_logo from "../src/img/Nearo_white_logo2.png";
import { Link, NavLink } from "react-router-dom";
import {
  FaSquareXTwitter,
  FaInstagram,
  FaSquareFacebook,
  FaLinkedin,
} from "react-icons/fa6";
const Footer = () => {
  return (
    <>
      <div className=" bg-[#459FB9] mt-20  ">
        <div className=" footer-box flex flex-col md:flex-row text-white px-4 py-10 sm:p-14 justify-between 2xl:w-[80%] 2xl:mx-auto ">
          <div className="flex-footer flex justify-between  md:w-1/2 flex-col sm:flex-row mb-8 ">
            <div className=" custom400:flex justify-between sm:block ">
             <a href="#home">
             <h1 className="heading text-4xl sm:text-5xl  text-white">nearo</h1>
             </a>
             

              <p className=" w-[85%] text-[#B0BEC5]">
                
             
                Launch your shop online on Nearo.
              </p>
            </div>
            <div className="flex flex-col space-y-3 capitalize  ">
              <Link></Link>

              <a href="#home" className="hover:font-bold">
                Home
              </a>
              <a href="#feature" className="hover:font-bold">
                why Nearo
              </a>

              <a href="#works" className="hover:font-bold">
                how&nbsp;Nearo&nbsp;works
              </a>
              <NavLink to="/signup/personaldetails" className="hover:font-bold">
                start selling
              </NavLink>
            </div>
          </div>

          <div className="flex-footer flex md:w-[40%]  justify-between flex-col sm:flex-row  ">
            <div className="flex flex-col space-y-3 capitalize ">
              <Link></Link>
              <Link href="#" to={"/about-us"} className="hover:font-bold">
                About us
              </Link>
              <Link
                href="#"
                to={"/terms-and-conditions"}
                className="hover:font-bold"
              >
                terms & conditions
              </Link>
              <Link href="#" to={"/privacy-policy"} className="hover:font-bold">
                privacy policy
              </Link>
            </div>
            <div className="sm:text-right">
              
              <h4
                className="cursor-pointer"
                onClick={() => (window.location.href = "mailto:info@nearo.in")}
              >
                Email : info@nearo.in
              </h4>
             

              <div className="my-2 space-x-4 flex text-2xl float-right">
                <NavLink
                  to="https://instagram.com/nearodotin?igshid=YWYwM2I1ZDdmOQ=="
                  target="_blank"
                >
                  <div className="icon-wrapper bg-white inline-block overflow-hidden relative rounded-lg">
                    <FaInstagram className="cursor-pointer hover:text-pink-500 text-pink-400 " />
                  </div>
                </NavLink>
                <NavLink
                  to="https://www.facebook.com/profile.php?id=100094586266720&mibextid=ZbWKwL"
                  target="_blank"
                >
                  <div className="icon-wrapper bg-white inline-block rounded-sm overflow-hidden">
                    <FaSquareFacebook className="cursor-pointer hover:text-blue-500 text-blue-800 overflow-hidden" />
                  </div>
                </NavLink>
                <NavLink
                  to="https://www.linkedin.com/company/nearo.in"
                  target="_blank"
                >
                  <div className="icon-wrapper bg-white inline-block rounded-sm">
                    <FaLinkedin className="cursor-pointer hover:text-[#386e8b] text-[#0077B5]" />
                  </div>
                </NavLink>
                <NavLink
                  to="https://twitter.com/nearodotin?t=4KQGhjlDLOjGToNlfDAe1g&s=09"
                  target="_blank"
                >
                  <div className="icon-wrapper bg-white inline-block rounded-sm">
                    <FaSquareXTwitter className="cursor-pointer hover:text-gray-800 text-black" />
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-center capitalize text-white text-xl pb-5">
          &copy; all rights are reserved!{" "}
        </h3>
      </div>
    </>
  );
};

export default Footer;
