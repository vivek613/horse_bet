import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { db } from "../config/firebase";
// import { signOut } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../App";
import { toast } from "react-hot-toast";
import styles from "./Navbar.module.css";
import { deleteAllCookies } from "../Hook/Cookies";
import { BiWallet } from "react-icons/bi";

export const NavbarCommon = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const { toastData, setToastData } = useContext(Context);

  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    db.collection("users")
      .doc(user?.uid)
      .onSnapshot((snapshot) => {
        setUserData(snapshot.data());
      });
  }, [user]);

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
        <p className={styles["user-email"]}>{userData?.email}</p>
        <div className={styles["user-wallet"]}>
          <p className={styles["user-balance-show"]}>Balance : </p>
          <p className={styles["user-balance-show"]}>{userData?.amount} ₹</p>
        </div>
        <p
          className={styles["user-logout"]}
          onClick={() => {
            signOut(auth).then((data) => {
              navigate("/login");
              deleteAllCookies();
            });
          }}
        >
          Log out
        </p>
      </div>
      <div className={styles["navbar-div"]}>
        <span
          style={{ fontSize: "25px", cursor: "pointer", color: "black" }}
          onClick={() => {
            openNav();
          }}
        >
          &#9776;
        </span>
        <button
          style={{
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => {
            navigate("/dashboard/mybet");
          }}
        >
          MyBet
        </button>
        <div
          style={{
            color: "#ffffff",
            marginRight: "11%",
            display: "flex",
            gap: "11px",
            alignItems: "center",
          }}
        >
          <BiWallet
            style={{
              width: "24px",
              height: "24px",
            }}
          />
          ₹{userData?.amount}
        </div>
      </div>
    </>
  );
};
