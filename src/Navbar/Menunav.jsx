import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../img/logo.png"
// import "./Nav.css"
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
export default function Menunav() {
  const [state, setState] = React.useState({
    left: false,
  });
  const Dispatch = useDispatch();

  const loginHide = () => {
    Dispatch({
      type: "falser",
    });
    Dispatch({
      type: "truelog",
    });
    navigate("/login")
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

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
       <div className="flex items-center px-2 justify-between ">
        <NavLink to="/">
        <h1 className="heading text-4xl mx-3 text-[#1687a7]">nearo</h1>
        </NavLink>
        <DangerousOutlinedIcon sx={{fontSize:'30px',color:'#1687a7',cursor:"pointer"}} />
       </div>

      </List>
      <Divider />
      <List>
        <div className=" p-5">
          <ul className="space-y-4 text-[#1687a7]">
            <li>
              <NavLink spellCheck="active" to="/">
                Home
              </NavLink>{" "}
            </li>
            <li>
              <a href="#feature">Features</a>{" "}
            </li>
            <li>
              <NavLink spellCheck="active" to="login" onClick={loginHide}>
                Login
              </NavLink>{" "}
            </li>
            <li onClick={gotoReg} className="cursor-pointer">
              Start Selling
            </li>
          </ul>
         
        </div>
      </List>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <MenuIcon
            sx={{ fontSize: "27px",cursor:"pointer" }}
            
            className="text-[#1687A7] "
            onClick={toggleDrawer(anchor, true)}
          />

          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
