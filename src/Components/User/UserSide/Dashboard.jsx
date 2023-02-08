import React, { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { NavbarCommon } from "../../Navbar";
import styles from "./Dashboard.module.css";
import { auth, db } from "../../../config/firebase";
import { useNavigate } from "react-router";
import { getCookie } from "../../../Hook/Cookies";
import { toast, Toaster } from "react-hot-toast";
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
    participants,
    setParticipants,
    setIndexNum,
  } = useContext(Context);
  const navigate = useNavigate();
  const [stateHorce, setStateHorce] = useState([
    "Madras",
    "Mumbai",
    "Delhi",
    "Calcutta",
    "Hyderabad",
    "Mysore",
  ]);
  const [horcesData, setHorcesData] = useState({});
  const [stateWiseData, setStateWiseData] = useState([]);
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [selectedState, setSelectedState] = useState({
    venue: "",
    raceNum: "",
  });
  const [walletModal, setWalletModal] = useState(false);

  const [resultData, setResultData] = useState([]);
  const [ind, setInd] = useState();
  const [stateName, setStateName] = useState("");
  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
      setParticipants(
        snapshot.docs
          .map((doc) => doc.data())[0]
          .Allrace.filter((item) => {
            if (item.vName === stateName) {
              return item;
            }
          })[ind]
      );
    });
  }, [ind]);

  useEffect(() => {
    if (getCookie("access_token")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  const handleGetRace = (e) => {
    setParticipants(e);
    e.status.toLowerCase() === "drl" &&
      setResultData(e.statusView.split("-").slice(0, -1));
    setWinPlc({
      ...winPlc,
      user_id: user.uid,
      email: user.email,
      race_number: e.raceNumber,
      race_time: e.raceTime,
      venue: e.vName,
      status: "disabled",
      withdraw: false,
    });
  };

  return (
    <>
      <NavbarCommon />
      <Toaster position="top-right" reverseOrder={false} />
      <div className={styles["user-race-data-main"]}>
        <p className={styles["user-race-title"]}>Today's Race</p>
        <div className={styles["state-array"]}>
          {stateHorce.map((items, index) => {
            return (
              <button
                className={
                  selectedState.venue === index
                    ? styles["state-button-user-select"]
                    : styles["state-button-user"]
                }
                onClick={() => {
                  setRaceIndexNum(index);
                  setSelectedState({ ...selectedState, venue: index });
                  setParticipants([]);
                  setInd();
                  setStateName(items);
                  setStateWiseData(
                    indiaRace.filter((data) => {
                      if (data.vName.toLowerCase() === items.toLowerCase()) {
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
                    selectedState.raceNum === index
                      ? styles["user-simple-card-select"]
                      : styles["user-simple-card"]
                  }
                  onClick={() => {
                    selectedState.raceNum !== index && handleGetRace(e);
                    setInd(index);
                    setRaceIndexNum(index);
                    setSelectedState({
                      ...selectedState,
                      raceNum: index,
                    });
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
        {participants && participants?.runners ? (
          <>
            <p className={styles["user-race-title"]}>Race Details :</p>
            <Card className={styles["race-details-card"]}>
              <Card.Body className={styles["race-id-main"]}>
                <div>
                  <Card style={{ height: "100%" }}>
                    <Card.Body>
                      <Card.Title>{participants?.raceNumber}</Card.Title>
                    </Card.Body>
                  </Card>
                </div>
                <Card className={styles["selected-race-data"]}>
                  <Card.Body className={styles["race-details-div"]}>
                    <span className={styles["race-details-span"]}>
                      {participants?.name}
                    </span>
                    <span className={styles["race-details-span"]}>
                      Distance: {participants?.length}
                    </span>
                    <span
                      style={{
                        background:
                          participants?.status === "DRL"
                            ? "#f44336"
                            : participants?.status === "STP"
                            ? "#f44336"
                            : "#1976d2",
                        textAlign: "center",
                        borderRadius: "7px",
                      }}
                    >
                      {participants?.status.toLowerCase() === "drl"
                        ? "completed"
                        : participants?.status.toLowerCase() === "stp"
                        ? "Stop"
                        : "Opening"}
                    </span>
                  </Card.Body>
                  {participants?.status === "DRL" && (
                    <Card.Body className={styles["results-div"]}>
                      {resultData?.map((item, index) => {
                        return (
                          <>
                            <div className={styles["jersey-div"]}>
                              <span className={styles["horce-num"]}>
                                {index + 1}
                                <sup>
                                  {index === 0
                                    ? "st"
                                    : index === 1
                                    ? "nd"
                                    : "rd"}
                                </sup>
                              </span>

                              <small className={styles["draw-num"]}>
                                {item}
                              </small>
                            </div>
                          </>
                        );
                      })}
                    </Card.Body>
                  )}
                </Card>
              </Card.Body>
            </Card>
            {participants?.runners && (
              <Card style={{ marginLeft: "8px", border: "none" }}>
                <Card.Body
                  style={{ padding: "0px", width: "calc(100% - 2px)" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ margin: "0px" }}>Horses :</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        marginRight: "20px",
                      }}
                    >
                      <p className={styles["user-race-title"]}>Win</p>
                      <p className={styles["user-race-title"]}>Plc</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
            <div className={styles["user-horce-card"]}>
              {participants?.runners?.map((e, index) => {
                return (
                  <>
                    <Card style={{ width: "calc(100% - 2px)" }}>
                      <Card.Body className={styles["horce-card-body"]}>
                        <div className={styles["horce-data-div"]}>
                          <div
                            className={styles["jersey-div"]}
                            style={{
                              marginRight: "15px",
                              height: "74px",
                            }}
                          >
                            <span className={styles["horce-num"]}>
                              {e.position}
                            </span>
                            <img
                              className={styles["jersey-image"]}
                              src={e.jerseyUrl}
                            ></img>
                            <small
                              className={styles["draw-num"]}
                            >{`(${e.drawNumber})`}</small>
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
                              Wt = {e.weight} , draw : #{e.drawNumber}
                            </div>
                            <div
                              class="text-red-9"
                              style={{
                                fontSize: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: "column",
                              }}
                            >
                              <span className={styles["jockey-details"]}>
                                <span className={styles["jockey-icons"]}>
                                  J
                                </span>{" "}
                                {e.jockey.name}
                              </span>

                              <span className={styles["trainer-details"]}>
                                <span class={styles["trainer-icons"]}>T</span>
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
                          {participants?.status?.toLowerCase() === "bst" && (
                            <>
                              <button
                                disabled={
                                  participants?.status?.toLowerCase() ===
                                    "bst" &&
                                  Number(e.odds.FOWIN) !== 0 &&
                                  Number(e.odds.FOWIN) !== 0.0
                                    ? false
                                    : true
                                }
                                style={{
                                  cursor:
                                    participants?.status?.toLowerCase() ===
                                      "bst" &&
                                    Number(e.odds.FOWIN) !== 0 &&
                                    Number(e.odds.FOWIN) !== 0.0
                                      ? "pointer"
                                      : "not-allowed",
                                }}
                                className={styles["odds-button"]}
                                onClick={() => {
                                  setIndexNum(index);
                                  setHorcesData(e);
                                  setWinPlc({
                                    ...winPlc,
                                    type: "WIN",
                                    value: e.odds.FOWIN,
                                    jockey_name: e.jockey.name,
                                    horce_number: e.position,
                                    time: Math.round(Date.now() / 1000),
                                  });
                                  setWalletModal(true);
                                }}
                              >
                                {e.odds.FOWIN}
                              </button>
                              <button
                                disabled={
                                  participants?.status?.toLowerCase() ===
                                    "bst" &&
                                  Number(e.odds.FOPLC) !== 0 &&
                                  Number(e.odds.FOPLC) !== 0.0
                                    ? false
                                    : true
                                }
                                style={{
                                  cursor:
                                    participants?.status?.toLowerCase() ===
                                      "bst" &&
                                    Number(e.odds.FOPLC) !== 0 &&
                                    Number(e.odds.FOPLC) !== 0.0
                                      ? "pointer"
                                      : "not-allowed",
                                }}
                                className={styles["bet-button"]}
                                onClick={() => {
                                  setHorcesData(e);
                                  setWinPlc({
                                    ...winPlc,
                                    type: "PLC",
                                    value: e.odds.FOPLC,
                                    jockey_name: e.jockey.name,
                                    horce_number: e.position,
                                    time: Math.round(Date.now() / 1000),
                                  });
                                  setWalletModal(true);
                                }}
                              >
                                {e.odds.FOPLC}
                              </button>
                            </>
                          )}
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
        horcesData={horcesData}
      />
    </>
  );
};
