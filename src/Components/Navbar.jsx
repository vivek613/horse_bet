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
import { deleteAllCookies, getCookie } from "../Hook/Cookies";
import { BiWallet } from "react-icons/bi";

export const NavbarCommon = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user1, setUser1] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const uid = getCookie("Uid");
    db.collection("users")
      .doc(uid)
      .onSnapshot((snapshot) => {
        setUserData(snapshot.data());
      });
  }, [user]);

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
        <p
          style={{ width: "95%", margin: "auto" }}
          className={styles["user-email"]}
        >
          {userData?.email}
        </p>
        <div className={styles["user-wallet"]}>
          <p className={styles["user-balance-show"]}>Balance : </p>
          <p className={styles["user-balance-show"]}>₹ {userData?.amount}</p>
        </div>
        <p
          className={styles["user-email"]}
          style={{ fontSize: "14px" }}
          onClick={() => {
            navigate("/dashboard/mybet");
          }}
        >
          My Bet
        </p>
        {userData?.admin && (
          <p
            className={styles["user-email"]}
            style={{ fontSize: "14px" }}
            onClick={() => {
              navigate("/dashboard/adduserpage");
            }}
          >
            Add User
          </p>
        )}
        <p
          className={styles["user-logout"]}
          onClick={() => {
            signOut(auth).then((data) => {
              navigate("/login");
              deleteAllCookies();
              window.location.reload(true);
            });
          }}
        >
          Log out
        </p>
      </div>
      <div className={styles["navbar-div"]}>
        <span
          style={{ fontSize: "25px", cursor: "pointer", color: "#ffffff" }}
          onClick={() => {
            openNav();
          }}
        >
          &#9776;
        </span>
        <div
          style={{
            color: "#ffffff",
            marginRight: "5%",
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
          ₹ {userData?.amount}
        </div>
      </div>
    </>
  );
};
