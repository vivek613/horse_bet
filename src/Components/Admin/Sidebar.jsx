import React, { useEffect, useState } from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { signOut } from "firebase/auth";

import { FaUserAlt, FaUsers } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { useNavigate } from "react-router";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiLogOut } from "react-icons/bi";
import { deleteAllCookies } from "../../Hook/Cookies";

export const Sidebar = () => {
  const auth = getAuth();
  const [user1, setUser1] = useState(null);
  console.log("auth", auth);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, and you can access the user's properties.
        setUser1(user);
      } else {
        // User is signed out or token has expired
        setUser1(null);
      }
    });

    return () => {
      // Unsubscribe from the auth state observer when the component unmounts.
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (user) {
    } else {
      deleteAllCookies();
      navigate("/login");
    }
  }, [user1]);
  auth.currentUser
    .getIdToken(true)
    .then((refreshedIdToken) => {
      // The ID token has been refreshed
      // console.log("Refreshed ID token:", refreshedIdToken);
    })
    .catch((error) => {
      // Handle errors if the token refresh fails
      console.error("Token refresh error:", error);
    });

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
            navigate(`/user/admin/usertable/:gP7ssoPxhkcaFPuPNIS9AXdv1BE3`);
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
            navigate(`/user/admin/:gP7ssoPxhkcaFPuPNIS9AXdv1BE3`);
          }}
        >
          <NavIcon style={{ opacity: "1" }}>
            <MdAccessTimeFilled style={{ fill: "black" }} />
          </NavIcon>
          <NavText style={{ color: "black" }}>Indian Race Data</NavText>
        </NavItem>
        <NavItem
          selected
          eventKey="charts"
          onClick={() => {
            navigate(`/user/admin/bettable/:gP7ssoPxhkcaFPuPNIS9AXdv1BE3`);
          }}
        >
          <NavIcon style={{ opacity: "1" }}>
            <FaUsers style={{ fill: "black" }} />
          </NavIcon>
          <NavText style={{ color: "black" }}>User Bet Data</NavText>
        </NavItem>
        <NavItem
          selected
          eventKey="charts"
          onClick={() => {
            signOut(auth).then((data) => {
              navigate("/login");
              deleteAllCookies();
              window.location.reload(true);
            });
          }}
        >
          <NavIcon style={{ opacity: "1" }}>
            <BiLogOut style={{ fill: "black" }} />
          </NavIcon>
          <NavText style={{ color: "black" }}>Log Out</NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
};
