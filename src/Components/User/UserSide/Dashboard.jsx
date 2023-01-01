import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { NavbarCommon } from "../../Navbar";
import styles from "./Dashboard.module.css";
import { auth, db } from "../../../config/firebase";
import { useNavigate } from "react-router";
import { getCookie } from "../../../Hook/Cookies";
import { Toaster } from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import { Context } from "../../../App";
import { UserBetModal } from "./UserBetModal";
import { ReactComponent as NoRace } from "../../../Assets/NoRace.svg";

export const Dashboard = () => {
  const {
    indiaRace,
    setIndiaRace,
    raceIndexNum,
    setRaceIndexNum,
    winPlc,
    setWinPlc,
  } = useContext(Context);
  const navigate = useNavigate();
  const [stateHorce, setStateHorce] = useState([
    "Madras",
    "Mumbai",
    "Delhi",
    "Calcutta",
    "Hyderabad",
    "Mysore",
    "Banglore",
  ]);
  const [horcesData, setHorcesData] = useState({});
  const [participants, setParticipants] = useState();
  const [stateWiseData, setStateWiseData] = useState([]);
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [selectedState, setSelectedState] = useState("");
  const [walletModal, setWalletModal] = useState(false);
  const [userData, setUserData] = useState();
  const [adminData, setAdminData] = useState();

  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
      setParticipants(
        snapshot.docs.map((doc) => doc.data())[0].Allrace[raceIndexNum]?.runners
      );
      // setStateWiseData(
      //   snapshot.docs
      //     .map((doc) => doc.data())[0]
      //     .Allrace.filter((data) => {
      //       if (data.vName.toLowerCase() == "Madras") {
      //         return data;
      //       }
      //     })
      // );
      // setHorces(
      //   snapshot.docs.map((doc) => doc.data())[0].Allrace[raceIndexNum]
      // );
    });

    // doc;
  }, []);
  useEffect(() => {
    db.collection("users")
      .doc("hMPGPOkqNQQvRxUD0NuW0oc1U6v1")
      .get()
      .then((res) => {
        setAdminData(res.data());
      });
  }, [user]);
  useEffect(() => {
    db.collection("users")
      .doc(user?.uid)
      .get()
      .then((res) => {
        setUserData(res.data());
      });
  }, [user]);
  useEffect(() => {
    if (getCookie("access_token")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  const handleGetRace = (e) => {
    setParticipants(e.runners);
    setWinPlc({
      ...winPlc,
      user_id: user.uid,
      race_number: e.raceNumber,
      venue: e.vName,
      status: "disabled",
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
                className={
                  selectedState === items
                    ? styles["state-button-user-select"]
                    : styles["state-button-user"]
                }
                onClick={() => {
                  setParticipants();
                  setSelectedState(items);
                  setStateWiseData(
                    indiaRace.filter((data) => {
                      if (data.vName.toLowerCase() == items.toLowerCase()) {
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
          {stateWiseData.map((e, index) => {
            return (
              <>
                <Card
                  className={
                    raceIndexNum === e.raceNumber - 1
                      ? styles["user-simple-card-select"]
                      : styles["user-simple-card"]
                  }
                  onClick={() => {
                    handleGetRace(e);
                    setRaceIndexNum(index);
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
        {/* <p className={styles["user-race-title"]}>Race Details :</p>
        <Card className={styles["race-details-card"]}>
          <Card.Body className={styles["race-id-main"]}>
            <div>
              <Card style={{ height: "100%" }}>
                <Card.Body>
                  <Card.Title>{horces?.raceNumber}</Card.Title>
                </Card.Body>
              </Card>
            </div>
            <Card className={styles["selected-race-data"]}>
              <Card.Body>
                <Card.Text>{horces?.name}</Card.Text>
                <Card.Text>Venue: {horces?.vName}</Card.Text>
                <Card.Text>Distance: {horces?.length}</Card.Text>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card> */}
        {participants && participants ? (
          <>
            <p className={styles["user-race-title"]}>Participant Horces :</p>
            <div className={styles["user-horce-card"]}>
              {participants?.map((e) => {
                return (
                  <>
                    <Card style={{ width: "calc(100% - 2px)" }}>
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
                            width: "125px",
                            position: "absolute",
                            right: "0",
                          }}
                        >
                          <button
                            className={styles["odds-button"]}
                            onClick={() => {
                              setHorcesData(e);
                              setWinPlc({
                                ...winPlc,
                                type: "WIN",
                                value: e.odds.WIN,
                                jockey_name: e.jockey.name,
                              });
                              setWalletModal(true);
                            }}
                          >
                            {e.odds.WIN}
                          </button>
                          <button
                            className={styles["bet-button"]}
                            onClick={() => {
                              setHorcesData(e);
                              setWinPlc({
                                ...winPlc,
                                type: "PLC",
                                value: e.odds.PLC,
                                jockey_name: e.jockey.name,
                              });
                              setWalletModal(true);
                            }}
                          >
                            {e.odds.PLC}
                          </button>
                        </div>
                      </Card.Body>
                    </Card>
                  </>
                );
              })}
            </div>
          </>
        ) : !selectedState ? (
          <>
            <div className={styles["please-select-race"]}>
              <h1 style={{ paddingTop: "200px" }}>Please Select One</h1>
            </div>
          </>
        ) : stateWiseData.length === 0 ? (
          <>
            <div className={styles["please-select-race"]}>
              <NoRace
                style={{ height: "420px", padding: "110px 50px 0px 50px" }}
              />
              <h1>Oops! No Race Today</h1>
            </div>
          </>
        ) : (
          <>
            <div className={styles["please-select-race"]}>
              <h1 style={{ paddingTop: "200px" }}>Please Select race</h1>
            </div>
          </>
        )}
      </div>
      <UserBetModal
        walletModal={walletModal}
        setWalletModal={setWalletModal}
        winPlc={winPlc}
        userData={userData}
        horcesData={horcesData}
        adminData={adminData}
      />
    </>
  );
};
