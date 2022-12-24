import React, { useContext, useEffect, useState } from "react";
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
  const [stateHorce, setStateHorce] = useState([]);
  const [horces, setHorces] = useState();
  const [participants, setParticipants] = useState();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [selectedState, setSelectedState] = useState(stateHorce?.[0]);

  function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }
  useEffect(() => {
    // indiaRace?.todo?.forEach((data) => {
    //   item = data.venue;
    //   array.push(item);
    // });
  }, [indiaRace]);

  useEffect(() => {
    const array = [];
    let item;
    db.collection("horsedata")
      .get()
      .then((querySnapshot) => {
        // Loop through the data and store
        // it in array to display
        querySnapshot.forEach((element) => {
          var data = element.data();

          setIndiaRace(data);
          data?.todo?.forEach((items) => {
            item = items.venue;
            array.push(item);
            setStateHorce(removeDuplicates(array));
          });
        });
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
    const docRef = db.collection("TimeData").doc(e.uid);
    docRef.get().then((docSnap) => {
      setParticipants(docSnap.data());
    });
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
                className={styles["state-button-user"]}
                onClick={() => {
                  setSelectedState(items);
                }}
              >
                {items}
              </button>
            );
          })}
        </div>
        <div className={styles["user-card-main"]}>
          {indiaRace &&
            indiaRace.todo?.map((e) => {
              return (
                <>
                  {selectedState === e.venue && (
                    <Card
                      className={styles["user-simple-card"]}
                      onClick={() => {
                        handleGetRace(e);
                      }}
                    >
                      <Card.Body className={styles["user-card-body"]}>
                        <Card.Title>{`Race: ${e.data.raceNumber}`}</Card.Title>
                        <Card.Text className={styles["user-simple-card-time"]}>
                          {selectedState}
                        </Card.Text>
                        <Card.Text className={styles["user-simple-card-hour"]}>
                          {e.hour}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  )}
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
          {participants?.participants.map((e) => {
            return (
              <>
                <Card>
                  <Card.Body className={styles["horce-card-body"]}>
                    <div>
                      <div className={styles["jersey-div"]}>
                        <img
                          src={e.data.jerseyUrl}
                          style={{
                            height: "50px",
                            width: "50px",
                          }}
                        ></img>
                      </div>
                      <div className={styles["details-div"]}>
                        <div className={styles["horce-card-prs-name"]}>
                          {e.participant.name}
                        </div>
                        <div
                          style={{
                            fontSize: "15px",
                          }}
                        >
                          Wt = {e.data.weight} , draw : #{e.data.cageNumber}
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
                            {e.data.jockey}
                          </span>
                          <span class={styles["trainer-icons"]}>T</span>
                          <span className={styles["trainer-details"]}>
                            {e.data.trainer}
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
                        {e.win.price}
                      </button>
                      <button className={styles["bet-button"]}>
                        {e.pls.price}
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
