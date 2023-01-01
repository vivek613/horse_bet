import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";

import "../../../Assets/common.css";
import { FaLock } from "react-icons/fa";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { db, auth } from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../../../App";
import { toast, Toaster } from "react-hot-toast";

export const Register = () => {
  const navigate = useNavigate();
  // const {} = useContext(Context);
  // const [user, loading, error] = useAuthState(auth);

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
  });

  const registerWithEmailAndPassword = async (email, password) => {
    const authentication = getAuth();
    try {
      const res = createUserWithEmailAndPassword(
        authentication,
        email,
        password
      )
        .then((response) => {
          const user = response.user;

          db.collection("users").doc(user.uid).set({
            uid: user.uid,
            email,
            authProvider: "local",
            admin: false,
            amount: "100",
          });

          toast.success(`welcome ${response?.user?.email}`);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })

        .catch((error) => {
          toast.error(` Wrong !${error?.message}`);
        });
    } catch (err) {
      console.error(err);
      // alert(err.message);
      toast.error(` Wrong !${err?.message}`);
    }
  };
  // const handleAction = (email, password) => {
  //   const authentication = getAuth();

  //   createUserWithEmailAndPassword(authentication, email, password).then(
  //     (data) => {
  //       navigate("/login");
  //     }
  //   );
  // };
  return (
    <>
      <div className="main-div">
        <div class="login-form">
          <form
          // handleAction={handleAction(registerData.email, registerData.password)}
          >
            <div class="avatar">
              <FaLock />
            </div>
            <h4 class="modal-title">Register</h4>

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
                  registerData.email,
                  registerData.password
                );
              }}
            >
              Register
            </button>
          </form>
          <div class="text-center small">
            Do you have an account?{" "}
            <a
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </a>
          </div>
        </div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </>
  );
};
