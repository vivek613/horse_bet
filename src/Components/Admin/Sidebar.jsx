import React from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FaUserAlt } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { useNavigate } from "react-router";

export const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <SideNav
      style={{ background: "#cdc6eb" }}
      onSelect={(selected) => {
        // Add your code here
      }}
    >
      <SideNav.Toggle />
      <SideNav.Nav>
        <NavItem
          eventKey="home"
          onClick={() => {
            navigate("/user/admin/usertable");
          }}
        >
          <NavIcon style={{ opacity: "1" }}>
            <FaUserAlt style={{ fill: "black" }} />
          </NavIcon>
          <NavText style={{ color: "black" }}>User</NavText>
        </NavItem>
        <NavItem
          selected
          eventKey="charts"
          onClick={() => {
            navigate("/user/admin");
          }}
        >
          <NavIcon style={{ opacity: "1" }}>
            <MdAccessTimeFilled style={{ fill: "black" }} />
          </NavIcon>
          <NavText style={{ color: "black" }}>Time Data</NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
};
