import React, { useContext, useEffect, useState } from "react";
import { NavbarCommon } from "../Navbar";

import { db } from "../../config/firebase";
import { getCookie } from "../../Hook/Cookies";
import { useNavigate } from "react-router";
import { Toaster } from "react-hot-toast";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [indiaRace, setIndiaRace] = useState([]);

  useEffect(() => {
    db.collection("horsedata")
      .get()
      .then((querySnapshot) => {
        // Loop through the data and store
        // it in array to display
        querySnapshot.forEach((element) => {
          var data = element.data();
          setIndiaRace(data);
        });
      });
    // doc;
  }, []);
  console.log(indiaRace);
  useEffect(() => {
    if (getCookie("access_token")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <NavbarCommon />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};
