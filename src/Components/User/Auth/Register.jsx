import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../../../Assets/common.css";
import { FaLock } from "react-icons/fa";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { db, auth } from "../../../config/firebase";
import { toast, Toaster } from "react-hot-toast";
import ReactLoading from "react-loading";

export const Register = () => {
  const navigate = useNavigate();
  const [registerLoading, setregisterLoading] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [userData, setUserData] = useState([]);
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
  });

  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) => {
      setUserData(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);
  const registerWithEmailAndPassword = async (email, password, phoneNumber) => {
    setregisterLoading(true);

    const authentication = getAuth();
    if (isValidPhoneNumber) {
      const emailSignInMethods = await fetchSignInMethodsForEmail(
        authentication,
        email
      );
      if (emailSignInMethods.length > 0) {
        setregisterLoading(false);
        toast.error(`Email is already registered.`);
        return;
      }

      // Check if the phone number is already registered
      const phoneNumberSignInMethods = userData.filter(
        (d) => d.phoneNumber === phoneNumber
      );

      if (phoneNumberSignInMethods.length > 0) {
        setregisterLoading(false);
        toast.error(`Phone number is already registered.`);
        return;
      }
      try {
        const res = createUserWithEmailAndPassword(
          authentication,
          email,
          password
        )
          .then((response) => {
            const user = response.user;
            setregisterLoading(false);
            db.collection("users").doc(user.uid).set({
              uid: user.uid,
              email,
              admin: false,
              phoneNumber,
              amount: "0",
            });

            toast.success(`welcome ${response?.user?.email}`);
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          })

          .catch((error) => {
            setregisterLoading(false);
            toast.error(` Wrong !${error?.message}`);
          });
      } catch (err) {
        setregisterLoading(false);
        toast.error(`Oops , Something went wrong...`);
      }
    } else {
      toast.error(` Please enter valid phone number`);
    }
  };

  return (
    <>
      <div className="main-div">
        <div class="login-form">
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                registerWithEmailAndPassword(
                  registerData.email,
                  registerData.password,
                  registerData.phoneNumber
                );
              }}
            >
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
                  type="text"
                  class="form-control"
                  placeholder="Enter phone Number (10 digits)"
                  required
                  value={registerData.phoneNumber}
                  onChange={(e) => {
                    const phoneNumberPattern = /^\d{10}$/;

                    setIsValidPhoneNumber(
                      phoneNumberPattern.test(e.target.value)
                    );
                    setRegisterData({
                      ...registerData,
                      phoneNumber: e.target.value,
                    });
                  }}
                />
                {!isValidPhoneNumber && (
                  <p style={{ color: "red" }}>
                    Invalid phone number! Please enter 10 digits.
                  </p>
                )}
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  placeholder="Enter Password"
                  required
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              {registerLoading ? (
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
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   registerWithEmailAndPassword(
                  //     registerData.email,
                  //     registerData.password,
                  //     registerData.phoneNumber
                  //   );
                  // }}
                >
                  Register
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
            Do you have an account?{" "}
            <a
              style={{
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

        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <p
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          bottom: "-15px",
          position: "absolute",
          width: "100%",
          background: "#00000063",
          color: "white",
          padding: "3px 5px",
          fontSize: "8px",
        }}
      >
        For Inquiry and Balance Withdrawal Contact : 86 69 64 69 69 / 86 69 65
        69 69
      </p>
    </>
  );
};
