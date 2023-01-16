import React, { useContext, useEffect } from "react";
import { Context } from "../../../App";
import { NavbarCommon } from "../../Navbar";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router";
import { Card } from "react-bootstrap";
import styles from "./Dashboard.module.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../config/firebase";
import { getCookie } from "../../../Hook/Cookies";

const MyBet = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const { winPlc, setWinPlc, userBet, setUserBet } = useContext(Context);
  useEffect(() => {
    const uid = getCookie("Uid");
    db.collection("participant")
      .doc("eecYvXE0OXOczXQAodjzfjZ89ry2")
      .onSnapshot((snapshot) => {
        if (snapshot?.data()?.data) {
          setUserBet(
            snapshot?.data()?.data.filter((item) => {
              if (uid === item.user_id) {
                return item;
              }
            })
          );
          // setUserBet(snapshot.data()?.data);
        }
      });
  }, [user]);

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
      <div
        className={styles["user-horce-card"]}
        style={{ height: "calc(100vh - 170px)", color: "black" }}
      >
        {userBet?.reverse().map((item) => {
          return (
            <Card style={{ width: "calc(100% - 2px)" }}>
              <Card.Body className={styles["horce-card-body"]}>
                <div
                  className={styles["horce-data-div"]}
                  style={{ flexDirection: "column", width: "100%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      margin: "0 0 10px 0",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#39e75f",
                        width: "53px",
                        color: "black",
                        borderRadius: "5px",
                        textAlign: "center",
                      }}
                    >
                      {item?.status === "enabled" && "Win"}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <p>Race No: {item.race_number} </p>
                    <p>{item.race_time}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <p>Horce Number: {item.horce_number}</p>
                    <p>Venue: {item.venue}</p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <p>Odds Type: {item.type}</p>
                    <p>Bet Amount: {item.user_amount}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <p>
                      {item.type} rate: {Number(item.value).toFixed(2)}
                    </p>
                    <p>Potential Amount: {item.potential_amount} </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default MyBet;
