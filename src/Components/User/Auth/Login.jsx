import React, { useState } from "react";
import { useNavigate } from "react-router";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../../../config/firebase";
import "../../../Assets/common.css";
import { FaLock } from "react-icons/fa";

export const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const logInWithEmailAndPassword = async (email, password) => {
    console.log("first");
    try {
      await signInWithEmailAndPassword(auth, email, password).then((data) => {
        console.log(data);
        navigate("/user/admin");
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  return (
    <div className="main-div">
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
          Don't have an account? <a href="/register">register</a>
        </div>
      </div>
    </div>
  );
};
