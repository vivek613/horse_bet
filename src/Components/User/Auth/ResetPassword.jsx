import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "../../../Assets/common.css";
import { FaLock } from "react-icons/fa";
import { setCookie } from "../../../Hook/Cookies";
import { toast, Toaster } from "react-hot-toast";
import { auth, db } from "../../../config/firebase";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [email, setEmail] = useState("");
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-block btn-lg"
              value="Login"
              onClick={(e) => {
                e.preventDefault();
                sendPasswordResetEmail(auth, email)
                  .then((data) => {
                    toast.success(
                      ` reset password link send yout email id ${email} Succesfully `
                    );
                  })
                  .catch((errors) => {
                    toast.error(`${errors?.message}`);
                  });
                // logInWithEmailAndPassword(loginData.email, loginData.password);
              }}
            >
              Reset
            </button>
          </form>
          <div class="text-center small">
            Do you have an account?{" "}
            <a
              style={{
                curser: "pointer",
                color: "black",
              }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
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
        For Balance Contact Number : 86 69 64 69 69
      </p>
    </>
  );
};
