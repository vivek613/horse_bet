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
  // const { toastData, setToastData, admin, setAdmin } = useContext(Context);

  // console.log(user, loading, error);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {}, []);
  const navigateData = () => {
    onAuthStateChanged(auth, async (currentUser) => {
      const citiesRef = collection(db, "users");

      // Create a query against the collection.
      const q = query(citiesRef, where("uid", "==", currentUser?.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        doc.data().admin === true
          ? navigate("/user/admin")
          : navigate("/dashboard");
      });
    });
  };

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
          navigateData();
          // if (
          //   response._tokenResponse.localId === "eecYvXE0OXOczXQAodjzfjZ89ry2"
          // ) {
          //   setInterval(() => {
          //     navigate("/user/admin");
          //   }, 2000);
          // } else {
          //   setTimeout(() => {
          //     navigate("/dashboard");
          //   }, 2000);
          // }
        })
        .catch((error) => {
          console.log(error);
          toast.error(` Wrong !${error?.message}`);
        });
    } catch (err) {
      console.log(err);

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
    </>
  );
};
