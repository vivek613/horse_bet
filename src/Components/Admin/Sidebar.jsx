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
      <SideNav.Nav defaultSelected="home">
        <NavItem
          eventKey="home"
          onClick={() => {
            navigate("/user/admin/userdata");
          }}
        >
          <NavIcon>
            <FaUserAlt />
          </NavIcon>
          <NavText>Home</NavText>
        </NavItem>
        <NavItem eventKey="charts">
          <NavIcon>
            <i
              className="fa fa-fw fa-line-chart"
              style={{ fontSize: "1.75em" }}
            />
          </NavIcon>
          <NavText>Charts</NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
};
