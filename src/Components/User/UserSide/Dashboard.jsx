import React, { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { NavbarCommon } from "../../Navbar";
import styles from "./Dashboard.module.css";
import { db } from "../../../config/firebase";
import { useNavigate } from "react-router";
import { getCookie } from "../../../Hook/Cookies";
import { toast, Toaster } from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import { Context } from "../../../App";
import { UserBetModal } from "./UserBetModal";
import axios from "axios";
import { ReactComponent as NoRace } from "../../../Assets/NoRace.svg";

export const Dashboard = () => {
  const {
    indiaRace,
    setIndiaRace,
    setRaceIndexNum,
    winPlc,
    setWinPlc,
    participants,
    setParticipants,
    setIndexNum,
    convertHour,
  } = useContext(Context);
  const navigate = useNavigate();

  const [horcesData, setHorcesData] = useState({});
  const [stateWiseData, setStateWiseData] = useState([]);
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [selectedState, setSelectedState] = useState({
    venue: "",
    raceNum: "",
    venueState: "",
  });
  const [walletModal, setWalletModal] = useState(false);

  const [ind, setInd] = useState();
  const [allData, setAllData] = useState([]);
  const [allCountry, setAllCountry] = useState([]);
  const [countryState, setCountryState] = useState([]);

  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setWalletModal(false);
      const all_race = snapshot.docs.map((doc) => doc.data())[0].Allrace;
      setAllData(all_race);
      setAllCountry([
        ...new Set(
          all_race.map((e) => {
            return e.data.venueCountry;
          })
        ),
      ]);
    });
  }, [ind]);

  useEffect(() => {
    if (getCookie("access_token")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  // const handleGetRace = (e) => {
  //   setParticipants(e);
  // };
  useEffect(() => {
    if (selectedState.id) {
      db.collection("RaceData")
        .doc(selectedState.id)
        .onSnapshot((snapshot) => {
          if (snapshot.data()) {
            setParticipants(snapshot.data());
          }
        });
    }
  }, []);

  const getRaceDataTime = (id) => {
    db.collection("RaceData")
      .doc(id)
      .onSnapshot((snapshot) => {
        if (snapshot.data()) {
          setParticipants(snapshot.data());
        }
      });
  };

  useEffect(() => {
    setParticipants({});
    setCountryState([]);
    setSelectedState({
      venue: "",
      raceNum: "",
      venueState: "",
    });
  }, []);

  const todayDate = () => {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear()).slice();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  return (
    <>
      <NavbarCommon />
      <Toaster position="top-right" reverseOrder={false} />
      <div className={styles["user-race-data-main"]}>
        <p className={styles["user-race-title"]}>Today's Race</p>
        <div className={styles["state-array"]}>
          {allCountry.map((items, index) => {
            return (
              <button
                className={
                  selectedState.venue === items
                    ? styles["state-button-user-select"]
                    : styles["state-button-user"]
                }
                onClick={() => {
                  if (items) {
                    const array = allData.filter((e) => {
                      return e.data.venueCountry === items;
                    });
                    setCountryState([
                      ...new Set(
                        array.map((data) => {
                          return data.data.venueName;
                        })
                      ),
                    ]);
                    setSelectedState({
                      venue: items,
                    });
                    setStateWiseData([]);
                    setParticipants();
                  } else {
                    const array = allData.filter((e) => {
                      return e.data.venueCountry === items;
                    });
                    const filteredData = array.map((item) => item.venue);
                    setCountryState([...new Set(filteredData)]);
                    setSelectedState({
                      venue: items,
                    });
                    setStateWiseData([]);
                    setParticipants();
                  }
                }}
              >
                {items || "IND"}
              </button>
            );
          })}
        </div>
        <div className={styles["state-array"]}>
          {countryState.map((items, index) => {
            return (
              <button
                className={
                  selectedState?.venueState === items
                    ? styles["state-button-user-select"]
                    : styles["state-button-user"]
                }
                onClick={() => {
                  if (items === "MYS" || items === "HYD" || items === "PUN") {
                    const array = allData.filter((e) => {
                      return e.venue === items;
                    });
                    setStateWiseData(
                      array.sort(
                        (a, b) => a.data.raceNumber - b.data.raceNumber
                      )
                    );
                    setSelectedState({
                      ...selectedState,
                      venueState: items,
                      raceNum: "",
                    });
                    setParticipants();
                  } else {
                    const array = allData.filter((e) => {
                      return e.data.venueName === items;
                    });
                    setStateWiseData(
                      array.sort(
                        (a, b) => a.data.raceNumber - b.data.raceNumber
                      )
                    );
                    setSelectedState({
                      ...selectedState,
                      venueState: items,
                      raceNum: "",
                    });
                    setParticipants();
                  }
                }}
              >
                {items}
              </button>
            );
          })}
        </div>
        {console.log(stateWiseData)}
        <div className={styles["user-card-main"]}>
          {stateWiseData.map((e, index) => {
            return (
              <>
                <Card
                  className={
                    selectedState?.raceNum === index
                      ? styles["user-simple-card-select"]
                      : styles["user-simple-card"]
                  }
                  onClick={() => {
                    getRaceDataTime(e.uid);
                    // selectedState.raceNum !== index && handleGetRace(e);
                    setWinPlc({
                      ...winPlc,
                      user_id: user.uid,
                      email: user.email,
                      race_number: e.data.raceNumber,
                      race_time: convertHour(e.startDate),
                      venue: e.data?.venueName || e.venue,
                      status: "disabled",
                      loss: false,
                      withdraw: false,
                    });
                    setInd(index);
                    setRaceIndexNum(index);
                    setSelectedState({
                      ...selectedState,
                      raceNum: index,
                      id: e.uid,
                    });
                  }}
                >
                  <Card.Body className={styles["user-card-body"]}>
                    <Card.Title>{`Race: ${e?.data?.raceNumber}`}</Card.Title>
                    <Card.Text
                      className={styles["user-simple-card-time"]}
                    ></Card.Text>
                    <Card.Text className={styles["user-simple-card-hour"]}>
                      {convertHour(e.startDate)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </>
            );
          })}
        </div>
        {participants && participants?.participants ? (
          <>
            <p className={styles["user-race-title"]}>Race Details :</p>
            <Card className={styles["race-details-card"]}>
              <Card.Body className={styles["race-id-main"]}>
                <div>
                  <Card style={{ height: "100%" }}>
                    <Card.Body>
                      <Card.Title>{participants?.data?.raceNumber}</Card.Title>
                    </Card.Body>
                  </Card>
                </div>
                <Card className={styles["selected-race-data"]}>
                  <Card.Body className={styles["race-details-div"]}>
                    <span className={styles["race-details-span"]}>
                      {participants?.name}
                    </span>
                    <span className={styles["race-details-span"]}>
                      Distance: {participants?.data?.length}
                    </span>
                    <span
                      style={{
                        background:
                          participants?.status === "COMPLETE"
                            ? "#f44336"
                            : participants?.status.toLowerCase() === "suspended"
                            ? "#f44336"
                            : "#1976d2",
                        textAlign: "center",
                        borderRadius: "7px",
                        padding: "4px",
                      }}
                    >
                      {participants?.status.toLowerCase()}
                    </span>
                  </Card.Body>
                  {(participants?.status?.toLowerCase() === "complete" ||
                    participants?.status?.toLowerCase() === "result") && (
                    <Card.Body className={styles["results-div"]}>
                      {Object.values(participants?.result?.standings).map(
                        (item, index) => {
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
                                  {item[0]}
                                </small>
                              </div>
                            </>
                          );
                        }
                      )}
                    </Card.Body>
                  )}
                </Card>
              </Card.Body>
            </Card>
            {participants?.participants && (
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
              {participants?.participants?.map((e, index) => {
                return (
                  <>
                    <Card style={{ width: "calc(100% - 2px)" }}>
                      <Card.Body className={styles["horce-card-body"]}>
                        <div className={styles["horce-data-div"]}>
                          <div
                            className={styles["jersey-div"]}
                            style={{
                              marginRight: "15px",
                              height: "83px",
                            }}
                          >
                            <span className={styles["horce-num"]}>
                              {`(${e.data.horseNumber})`}
                            </span>
                            <img
                              className={styles["jersey-image"]}
                              src={e.data.jerseyUrl}
                            ></img>
                            <small
                              className={styles["draw-num"]}
                            >{`(${e.data.cageNumber})`}</small>
                          </div>
                          <div className={styles["details-div"]}>
                            <div className={styles["horce-card-prs-name"]}>
                              {e.participant.name}
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                              }}
                            >
                              Wt ={e.data.weight},draw :#{e.data.cageNumber}
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
                                {e.data.jockey}
                              </span>

                              <span className={styles["trainer-details"]}>
                                <span class={styles["trainer-icons"]}>T</span>
                                {e.data.trainer}
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
                          {(participants?.status?.toLowerCase() !==
                            "complete" ||
                            participants?.status?.toLowerCase() !==
                              "result") && (
                            <>
                              <button
                                disabled={
                                  participants?.status?.toLowerCase() ===
                                    "published" &&
                                  Number(
                                    participants?.markets[0]?.selections[index]
                                      .odds?.price
                                  ) !== 0 &&
                                  Number(
                                    participants?.markets[0]?.selections[index]
                                      .odds?.price
                                  ) !== 0.0 &&
                                  e.data.isRunner
                                    ? false
                                    : true
                                }
                                style={{
                                  cursor:
                                    participants?.status?.toLowerCase() ===
                                      "published" &&
                                    Number(
                                      participants?.markets[0]?.selections[
                                        index
                                      ].odds?.price
                                    ) !== 0 &&
                                    Number(
                                      participants?.markets[0]?.selections[
                                        index
                                      ].odds?.price
                                    ) !== 0.0 &&
                                    e.data.isRunner
                                      ? "pointer"
                                      : "not-allowed",
                                  background:
                                    participants?.status?.toLowerCase() ===
                                    "published"
                                      ? "#cdc6eb"
                                      : "#827e7e",
                                }}
                                className={styles["odds-button"]}
                                onClick={() => {
                                  setIndexNum(index);
                                  setHorcesData(e);
                                  setWinPlc({
                                    ...winPlc,
                                    type: "WIN",
                                    value:
                                      participants?.markets[0]?.selections[
                                        index
                                      ].odds?.price,
                                    jockey_name: e.data.jockey,
                                    horce_number: e.data.horseNumber,
                                    time: new Date().getTime(),
                                    date: todayDate(),
                                    // time: Math.round(Date.now() / 1000),
                                  });
                                  setWalletModal(true);
                                }}
                              >
                                {
                                  participants?.markets[0]?.selections[index]
                                    .odds?.price
                                }
                              </button>
                              <button
                                disabled={
                                  participants?.status?.toLowerCase() ===
                                    "published" &&
                                  Number(
                                    participants?.markets[0]?.selections[index]
                                      .odds?.price
                                  ) !== 0 &&
                                  Number(
                                    participants?.markets[0]?.selections[index]
                                      .odds?.price
                                  ) !== 0.0 &&
                                  e.data.isRunner
                                    ? false
                                    : true
                                }
                                style={{
                                  cursor:
                                    participants?.status?.toLowerCase() ===
                                      "published" &&
                                    Number(
                                      participants?.markets[1]?.selections[
                                        index
                                      ].odds?.price
                                    ) !== 0 &&
                                    Number(
                                      participants?.markets[1]?.selections[
                                        index
                                      ].odds?.price
                                    ) !== 0.0 &&
                                    e.data.isRunner
                                      ? "pointer"
                                      : "not-allowed",
                                  background:
                                    participants?.status?.toLowerCase() ===
                                    "published"
                                      ? "#cdc6eb"
                                      : "#827e7e",
                                }}
                                className={styles["odds-button"]}
                                onClick={() => {
                                  setHorcesData(e);
                                  setWinPlc({
                                    ...winPlc,
                                    type: "PLC",
                                    value:
                                      participants?.markets[1]?.selections[
                                        index
                                      ].odds?.price,
                                    jockey_name: e.data.jockey,
                                    horce_number: e.data.horseNumber,
                                    time: new Date().getTime(),
                                    date: todayDate(),
                                    // time: Math.round(Date.now() / 1000),
                                  });
                                  setWalletModal(true);
                                }}
                              >
                                {
                                  participants?.markets[1]?.selections[index]
                                    .odds?.price
                                }
                              </button>
                            </>
                          )}
                        </div>
                        {!e.data.isRunner && (
                          <div className={styles["horce-runner-div"]}>
                            <svg
                              class="a-icon text-red-7"
                              aria-hidden="true"
                              role="presentation"
                              viewBox="0 0 24 24"
                              style={{ fontSize: "5px", fill: "red" }}
                            >
                              <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"></path>
                            </svg>
                          </div>
                        )}
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
      {participants?.status?.toLowerCase() === "published" && (
        <UserBetModal
          walletModal={walletModal}
          setWalletModal={setWalletModal}
          winPlc={winPlc}
          horcesData={horcesData}
        />
      )}
    </>
  );
};
