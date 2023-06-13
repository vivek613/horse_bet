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

  const [ind, setInd] = useState();
  const [stateName, setStateName] = useState("");
  const [allData, setAllData] = useState([]);
  const [allCountry, setAllCountry] = useState([]);
  const [countryState, setCountryState] = useState([]);
  const [stateRace, setStateRace] = useState([]);

  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setWalletModal(false);
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
    axios
      .get("http://localhost:5000/api/allDataForCountry")
      .then((item) => {
        const country = [
          ...new Set(
            item?.data?.data.map((e) => {
              return e.data.venueCountry;
            })
          ),
        ];
        const countryStateArray = [
          ...new Set(
            item?.data?.data.map((e) => {
              return e.data.venueName;
            })
          ),
        ];
        setAllData(item?.data?.data);
        setAllCountry(country);
        console.log(item?.data?.data, countryStateArray, country);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (getCookie("access_token")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  const handleGetRace = (e) => {
    setParticipants(e);
  };

  const getRaceDataTime = (id) => {
    axios
      .get(`http://localhost:5000/api/getTimesOfRacing?id=${id}`)
      .then((item) => {
        // const country = [
        //   ...new Set(
        //     item?.data?.data.map((e) => {
        //       return e.data.venueCountry;
        //     })
        //   ),
        // ];
        // const countryStateArray = [
        //   ...new Set(
        //     item?.data?.data.map((e) => {
        //       return e.data.venueName;
        //     })
        //   ),
        // ];
        // setAllData(item?.data?.data);
        // setAllCountry(country);
        console.log(item?.data?.data);
        setParticipants(item?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const convertHour = (data) => {
    const date = new Date(data);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return hours + ":" + minutes;
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
                  selectedState.venue === index
                    ? styles["state-button-user-select"]
                    : styles["state-button-user"]
                }
                onClick={() => {
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
                  setStateWiseData([]);
                  setParticipants();
                }}
              >
                {items}
              </button>
            );
          })}
        </div>
        <div className={styles["state-array"]}>
          {countryState.map((items, index) => {
            return (
              <button
                className={
                  selectedState.venue === index
                    ? styles["state-button-user-select"]
                    : styles["state-button-user"]
                }
                onClick={() => {
                  const array = allData.filter((e) => {
                    return e.data.venueName === items;
                  });
                  console.log(array, "array");
                  setStateRace(array);
                  setStateWiseData(array);
                }}
              >
                {items}
              </button>
            );
          })}
        </div>
        {/* <div className={styles["state-array"]}>
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
        </div> */}
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
                    getRaceDataTime(e.uid);
                    // selectedState.raceNum !== index && handleGetRace(e);
                    // setWinPlc({
                    //   ...winPlc,
                    //   user_id: user.uid,
                    //   email: user.email,
                    //   race_number: e.raceNumber,
                    //   race_time: e.raceTime,
                    //   venue: e.vName,
                    //   status: "disabled",
                    //   withdraw: false,
                    // });
                    // setInd(index);
                    // setRaceIndexNum(index);
                    // setSelectedState({
                    //   ...selectedState,
                    //   raceNum: index,
                    // });
                  }}
                >
                  <Card.Body className={styles["user-card-body"]}>
                    <Card.Title>{`Race: ${e?.data?.raceNumber}`}</Card.Title>
                    <Card.Text
                      className={styles["user-simple-card-time"]}
                    ></Card.Text>
                    <Card.Text className={styles["user-simple-card-hour"]}>
                      {/* {new Date(e?.data?.raceTime)} */}
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
                            : participants?.status === "STP"
                            ? "#f44336"
                            : "#1976d2",
                        textAlign: "center",
                        borderRadius: "7px",
                      }}
                    >
                      {participants?.status.toLowerCase() === "complete"
                        ? "completed"
                        : participants?.status.toLowerCase() === "stp"
                        ? "Stop"
                        : "Opening"}
                    </span>
                  </Card.Body>
                  {participants?.status === "COMPLETE" && (
                    <Card.Body className={styles["results-div"]}>
                      {participants?.standings?.map((item, index) => {
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
                      })}
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
                              height: "74px",
                            }}
                          >
                            <span className={styles["horce-num"]}>
                              {e.data.horceNumber}
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
                                fontSize: "15px",
                              }}
                            >
                              Wt = {e.data.weight} , draw : #{e.data.cageNumber}
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
                          {participants?.status?.toLowerCase() !==
                            "completed" && (
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
                                  ) !== 0.0
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
                                    ) !== 0.0
                                      ? "pointer"
                                      : "not-allowed",
                                }}
                                className={styles["odds-button"]}
                                onClick={() => {
                                  // setIndexNum(index);
                                  // setHorcesData(e);
                                  // setWinPlc({
                                  //   ...winPlc,
                                  //   type: "WIN",
                                  //   value: e.odds.FOWIN,
                                  //   jockey_name: e.jockey.name,
                                  //   horce_number: e.position,
                                  //   time: new Date().getTime(),
                                  //   // time: Math.round(Date.now() / 1000),
                                  // });
                                  // setWalletModal(true);
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
                                  ) !== 0.0
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
                                    ) !== 0.0
                                      ? "pointer"
                                      : "not-allowed",
                                }}
                                className={styles["bet-button"]}
                                onClick={() => {
                                  // setHorcesData(e);
                                  // setWinPlc({
                                  //   ...winPlc,
                                  //   type: "PLC",
                                  //   value: e.odds.FOPLC,
                                  //   jockey_name: e.jockey.name,
                                  //   horce_number: e.position,
                                  //   time: new Date().getTime(),
                                  //   // time: Math.round(Date.now() / 1000),
                                  // });
                                  // setWalletModal(true);
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
      {participants?.status?.toLowerCase() === "bst" && (
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
