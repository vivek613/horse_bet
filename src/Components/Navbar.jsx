import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
// import { signOut } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../App";
import { toast } from "react-hot-toast";
import styles from "./Navbar.module.css";

export const NavbarCommon = () => {
  const auth = getAuth();
  const { toastData, setToastData } = useContext(Context);

  const [user, loading, error] = useAuthState(auth);

  const navigate = useNavigate();

  const openNav = () => {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("mySidenav").style.background = "white";
    document.getElementById("mySidenav").style.boxShadow =
      "box-shadow: 0 4px 8px 0 rgb(0 0 0 / 5%), 0 6px 20px 0 rgb(0 0 0 / 8%);";
  };

  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };

  return (
    <>
      <div id="mySidenav" className={styles["sidenav"]}>
        <a
          href="javascript:void(0)"
          className={styles["closebtn"]}
          onClick={() => {
            closeNav();
          }}
        >
          &times;
        </a>
        <p className={styles["user-email"]}>{user?.email}</p>
        <div className={styles["user-wallet"]}>
          <p className={styles["user-balance-show"]}>Total balance : </p>
          <p className={styles["user-balance-show"]}>100₹</p>
        </div>
      </div>
      <div className={styles["navbar-div"]}>
        <span
          style={{ "font-size": "25px", cursor: "pointer", color: "black" }}
          onClick={() => {
            openNav();
          }}
        >
          &#9776;
        </span>
      </div>
    </>
  );
};
