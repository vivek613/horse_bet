import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import "../../../Assets/common.css";
import { FaLock } from "react-icons/fa";
import { getCookie, setCookie } from "../../../Hook/Cookies";
import { Context } from "../../../App";
import { toast, Toaster } from "react-hot-toast";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../config/firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {}, []);
  // const navigateData = () => {
  //   onAuthStateChanged(auth, async (currentUser) => {
  //     const citiesRef = collection(db, "users");

  //     // Create a query against the collection.
  //     const q = query(citiesRef, where("uid", "==", currentUser?.uid));
  //     const querySnapshot = await getDocs(q);
  //     // querySnapshot.forEach((doc) => {
  //     //   doc.data().admin === true
  //     //     ? navigate(`/user/admin/:eecYvXE0OXOczXQAodjzfjZ89ry2`)
  //     //     : navigate("/dashboard");
  //     // });
  //   });
  // };

  const logInWithEmailAndPassword = async (email, password) => {
    const authentication = getAuth();

    try {
      await signInWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          toast.success(`login Succesfully ${response._tokenResponse.email}`);

          setCookie("access_token", response._tokenResponse.idToken, 1000);
          setCookie("email", response._tokenResponse.email, 1000);
          setCookie(
            "refresh_token",
            response._tokenResponse.refreshToken,
            1000
          );
          setCookie("Uid", response._tokenResponse.localId, 1000);
          db.collection("users")
            .doc(response._tokenResponse.localId)
            .get()
            .then((res) => {
              console.log(res.data());
              if (res.data().admin === true) {
                navigate(`/user/admin/:eecYvXE0OXOczXQAodjzfjZ89ry2`);
              } else {
                navigate(`/dashboard`);
              }
              // setAdminData(res.data());
            });
        })
        .catch((error) => {
          toast.error(` Wrong !${error?.message}`);
        });
    } catch (err) {
      toast.error(` Wrong !${err?.message}`);
    }
  };

  return (
    <>
      <div className="main-div">
        <Toaster position="top-right" reverseOrder={false} />
        <div class="login-form">
          <form>
            <div class="avatar">
              <FaLock />
            </div>
            <h4 class="modal-title">Login to Your Account</h4>
            <div class="form-group">
              <input
                type="email"
                class="form-control"
                placeholder="Enter Email"
                required
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                placeholder="Enter Password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>
            <div class="form-group small clearfix">
              <a href="#" class="forgot-link">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              class="btn btn-primary btn-block btn-lg"
              value="Login"
              onClick={(e) => {
                e.preventDefault();

                logInWithEmailAndPassword(loginData.email, loginData.password);
              }}
            >
              Log in
            </button>
          </form>
          <div class="text-center small">
            Don't have an account?{" "}
            <a
              style={{
                curser: "pointer",
                color: "black",
              }}
              onClick={() => {
                navigate("/register");
              }}
            >
              register
            </a>
          </div>
        </div>
      </div>
      <p
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          bottom: "-15px",
          position: "absolute",
          width: "100%",
          background: "#00000063",
          color: "white",
          padding: "3px 15px",
          fontSize: "14px",
        }}
      >
        For Balance Contact Number : 1000020000
      </p>
    </>
  );
};
