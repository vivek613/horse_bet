import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { NavbarCommon } from "../../Navbar";
import styles from "./Dashboard.module.css";
import { auth, db } from "../../../config/firebase";
import { useNavigate } from "react-router";
import { getCookie } from "../../../Hook/Cookies";
import { Toaster } from "react-hot-toast";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import { Context } from "../../../App";

export const Dashboard = () => {
  const { indiaRace, setIndiaRace } = useContext(Context);
  const navigate = useNavigate();
  const [stateHorce, setStateHorce] = useState([
    "Madras",
    "Mumbai",
    "Delhi",
    "calcutta",
    "hyderabad",
    "Mysore",
  ]);
  const [horces, setHorces] = useState();
  const [participants, setParticipants] = useState();
  const [stateWiseData, setStateWiseData] = useState([]);
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [selectedState, setSelectedState] = useState(false);

  function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }

  useLayoutEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
    });

    // doc;
  }, []);
  useEffect(() => {
    if (getCookie("access_token")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  const handleGetRace = (e) => {
    setParticipants(e.runners);
  };

  return (
    <>
      <NavbarCommon />
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles["user-race-data-main"]}>
        <p className={styles["user-race-title"]}>Today's Race</p>
        <div className={styles["state-array"]}>
          {stateHorce.map((items) => {
            return (
              <button
                className={
                  selectedState === items
                    ? styles["state-button-user-select"]
                    : styles["state-button-user"]
                }
                onClick={() => {
                  setSelectedState(items);
                  setStateWiseData(
                    indiaRace.filter((data) => {
                      if (data.vName == items) {
                        return data;
                      }
                    })
                  );
                }}
              >
                {items}
              </button>
            );
          })}
        </div>
        <div className={styles["user-card-main"]}>
          {stateWiseData.map((e) => {
            return (
              <>
                <Card
                  className={styles["user-simple-card"]}
                  onClick={() => {
                    handleGetRace(e);
                  }}
                >
                  <Card.Body className={styles["user-card-body"]}>
                    <Card.Title>{`Race: ${e.raceNumber}`}</Card.Title>
                    <Card.Text
                      className={styles["user-simple-card-time"]}
                    ></Card.Text>
                    <Card.Text className={styles["user-simple-card-hour"]}>
                      {e.raceTime}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </>
            );
          })}
        </div>
        <p className={styles["user-race-title"]}>Race Details :</p>
        <Card className={styles["race-details-card"]}>
          <Card.Body className={styles["race-id-main"]}>
            <div>
              <Card style={{ height: "100%" }}>
                <Card.Body>
                  <Card.Title>{horces?.data.raceNumber}</Card.Title>
                </Card.Body>
              </Card>
            </div>
            <Card className={styles["selected-race-data"]}>
              <Card.Body>
                <Card.Text>{horces?.data.label}</Card.Text>
                <Card.Text>Venue: {horces?.venue}</Card.Text>
                <Card.Text>Distance: {horces?.data.distance}</Card.Text>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
        <p className={styles["user-race-title"]}>Participant Horces :</p>
        <div className={styles["user-horce-card"]}>
          {participants?.map((e) => {
            return (
              <>
                <Card>
                  <Card.Body className={styles["horce-card-body"]}>
                    <div>
                      <div className={styles["jersey-div"]}>
                        <img
                          src={e.jerseyUrl}
                          style={{
                            height: "50px",
                            width: "50px",
                          }}
                        ></img>
                      </div>
                      <div className={styles["details-div"]}>
                        <div className={styles["horce-card-prs-name"]}>
                          {e.name}
                        </div>
                        <div
                          style={{
                            fontSize: "15px",
                          }}
                        >
                          Wt = {e.weight} , draw : #{e.rating}
                        </div>
                        <div
                          class="text-red-9"
                          style={{
                            fontSize: "14px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span className={styles["jockey-icons"]}>J</span>
                          <span className={styles["jockey-details"]}>
                            {e.jockey.name}
                          </span>
                          <span class={styles["trainer-icons"]}>T</span>
                          <span className={styles["trainer-details"]}>
                            {e.trainer.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        width: "100px",
                        position: "absolute",
                        right: "0",
                      }}
                    >
                      <button className={styles["odds-button"]}>
                        {e.odds.WIN}
                      </button>
                      <button className={styles["bet-button"]}>
                        {e.odds.PLC}
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};
