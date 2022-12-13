import React, { useState } from "react";
import { useNavigate } from "react-router";

import "../../../Assets/common.css";
import { FaLock } from "react-icons/fa";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase";

export const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((data) => {
        console.log(data);
        navigate("/login");
      });
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
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
          <h4 class="modal-title">Register</h4>
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              placeholder="Enter your name"
              required
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
            />
          </div>
          <div class="form-group">
            <input
              type="email"
              class="form-control"
              placeholder="Enter Email"
              required
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              class="form-control"
              placeholder="Enter Password"
              required
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block btn-lg"
            value="Login"
            onClick={(e) => {
              e.preventDefault();

              registerWithEmailAndPassword(
                registerData.name,
                registerData.email,
                registerData.password
              );
            }}
          >
            Register
          </button>
        </form>
        <div class="text-center small">
          Do you have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};
