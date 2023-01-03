import React from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { useNavigate } from "react-router";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export const Sidebar = () => {
  const auth = getAuth();

  const [user, loading, error] = useAuthState(auth);

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
            navigate(`/user/admin/usertable/${user?.uid}`);
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
            navigate(`/user/admin/${user?.uid}`);
          }}
        >
          <NavIcon style={{ opacity: "1" }}>
            <MdAccessTimeFilled style={{ fill: "black" }} />
          </NavIcon>
          <NavText style={{ color: "black" }}>Time Data</NavText>
        </NavItem>
        <NavItem
          selected
          eventKey="charts"
          onClick={() => {
            navigate(`/user/admin/bettable/${user?.uid}`);
          }}
        >
          <NavIcon style={{ opacity: "1" }}>
            <FaUsers style={{ fill: "black" }} />
          </NavIcon>
          <NavText style={{ color: "black" }}>Bet Data</NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
};
