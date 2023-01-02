import React, { useContext } from "react";
import { Context } from "../../../App";
import { NavbarCommon } from "../../Navbar";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router";

const MyBet = () => {
  const navigate = useNavigate();
  const { winPlc, setWinPlc, userBet, setUserBet } = useContext(Context);
  console.log(userBet);

  return (
    <>
      <NavbarCommon />
      <span
        style={{
          fontSize: "39px",
          marginLeft: "15px",
        }}
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        <BiArrowBack />
      </span>
    </>
  );
};

export default MyBet;
