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
          <NavIcon>
            <FaUserAlt />
          </NavIcon>
          <NavText>User</NavText>
        </NavItem>
        <NavItem
          selected
          eventKey="charts"
          onClick={() => {
            navigate("/user/admin");
          }}
        >
          <NavIcon>
            <MdAccessTimeFilled />
          </NavIcon>
          <NavText></NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
};
