import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../../../Assets/common.css";
import { FaLock } from "react-icons/fa";
import { setCookie } from "../../../Hook/Cookies";
import { toast, Toaster } from "react-hot-toast";
import { db } from "../../../config/firebase";
import ReactLoading from "react-loading";
export const Login = () => {
  const navigate = useNavigate();
  const [loginLoading, setloginLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const logInWithEmailAndPassword = async (email, password) => {
    const authentication = getAuth();
    setloginLoading(true);
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
              setloginLoading(false);
              if (res.data().uid === "eecYvXE0OXOczXQAodjzfjZ89ry2") {
                navigate(`/user/admin/:eecYvXE0OXOczXQAodjzfjZ89ry2`);
              } else {
                navigate(`/dashboard`);
              }
              // setAdminData(res.data());
            });
        })
        .catch((error) => {
          setloginLoading(false);
          toast.error(` Wrong !${error?.message}`);
        });
    } catch (err) {
      setloginLoading(false);
      toast.error(` Wrong !${err?.message}`);
    }
  };

  return (
    <>
      <div className="main-div">
        <Toaster position="top-right" reverseOrder={false} />
        <div class="login-form">
          <div>
            <form>
              <div class="avatar">
                <FaLock />
              </div>
              <div class="login-logo">
                <img
                  src="/Images/logo1.jpg"
                  width={"100px"}
                  style={{ background: "transparent" }}
                ></img>
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
              <div
                class="form-group small clearfix"
                style={{ marginBottom: "0" }}
              >
                <p
                  onClick={() => {
                    navigate("/resetpassword");
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                  class="forgot-link"
                >
                  Forgot Password?
                </p>
              </div>
              {loginLoading ? (
                <ReactLoading
                  type={"spin"}
                  color={"#000000"}
                  height={30}
                  width={30}
                />
              ) : (
                <button
                  type="submit"
                  class="btn btn-primary btn-block btn-lg"
                  value="Login"
                  onClick={(e) => {
                    e.preventDefault();
                    logInWithEmailAndPassword(
                      loginData.email,
                      loginData.password
                    );
                  }}
                >
                  Log in
                </button>
              )}
            </form>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "-16px 0 5px 0",
                background: "#f0eeee",
                padding: "5px 0px",
                color: "black",
              }}
            >
              Welcome to BetWinPlace
            </div>
          </div>
          <div class="text-center small">
            Don't have an account?{" "}
            <a
              style={{
                color: "black",
              }}
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
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
          fontSize: "8px",
        }}
      >
        For Inquiry and Balance Withdrawal Contact : 86 69 64 69 69 / 86 69 65
        69 69
      </p>
    </>
  );
};
