import React, { useContext, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
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
import { ImVideoCamera } from "react-icons/im";
import ReactLoading from "react-loading";

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
  const [user, error] = useAuthState(auth);
  const [liveTrue, setLiveTrue] = useState(false);
  const [selectedState, setSelectedState] = useState({
    venue: "",
    raceNum: "",
    venueState: "",
  });
  const [walletModal, setWalletModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ind, setInd] = useState();
  const [allData, setAllData] = useState([]);
  const [allCountry, setAllCountry] = useState([]);
  const [countryState, setCountryState] = useState([]);
  const [liveVideoData, setLiveVideoData] = useState({});

  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setWalletModal(false);
      const all_race = snapshot.docs.map((doc) => doc.data())[0].Allrace;
      setAllData(all_race.sort((a, b) => a.startDate - b.startDate));
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
  const handleGetLiveData = async (data) => {
    const id = data?.data?.externalId.split("-")[1];
    if (!liveTrue) {
      setLoading(true);

      try {
        await axios
          .get(
            `https://horse-batting.onrender.com/api/getliveData?id=${data?.uid}&streamId=${id}`
          )
          .then((res) => {
            console.log("ress", res);
            if (res?.data?.status) {
              setLiveVideoData(res?.data?.data);
            }
            setLoading(false);

            setLiveTrue(true);
          })
          .catch((e) => { });
      } catch (error) {
        console.error(error);
      }
    } else {
      setLiveTrue(false);
    }
  };

  useEffect(() => {
    setParticipants({});
    setCountryState([]);
    setStateWiseData([]);
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

  const hlsUrl =
    "https://pcast.phenixrts.com/pcast/channel/uk-southeast%23sis.tv%23mkppStrPhnx01Port04.mwquP9iF0JEb/live.m3u8?streamToken=DIGEST:eyJhcHBsaWNhdGlvbklkIjoic2lzLnR2IiwiZGlnZXN0IjoiaE9GeFhabWRIM1FRcGx3Tjd0MktFaytBZnQ2WmkyUER2NzlZR3RJYUpLWnRDVCtsK2F3d2VZSmVPQ3kvODBxNngzVGZpQWlhMlcydVpFVDdzc3U4U3c9PSIsInRva2VuIjoie1wicmVxdWlyZWRUYWdcIjpcImNoYW5uZWxBbGlhczpNSzAxX1BPUlRfMDRcIixcImFwcGx5VGFnc1wiOltcIkN1c3RvbWVyPXhnQ0RPcHZNJmFzc2V0SWQ9MTgxJlVzZXJJZD0wZDY1YmU0Ni03ODExLTQ0YzYtODczMy00MTQwOWMzN2UxM2EmY2hhbm5lbD1SYWNpbmcrVmljdG9yaWElMkZTb3V0aCtBdXN0cmFsaWEmc2VjdXJlPWZhbHNlJnRyYWNrTmFtZT1XYXJybmFtYm9vbCZzcG9ydENvZGU9V0wmY291bnRyeT1BVSZjYXRlZ29yeT1IUiZldmVudElkPTI5OTIyMTImc2Vzc2lvbklkPTBkNjViZTQ2LTc4MTEtNDRjNi04NzMzLTQxNDA5YzM3ZTEzYTE2OTI1MTEyMTcyMDk4MVwiXSxcImV4cGlyZXNcIjoxNjkyNTE4NDE3NzA2fSJ9";

  return (
    <>
      <NavbarCommon />
      <Toaster position="top-right" reverseOrder={false} />
      <marquee className={styles["marq"]} bgcolor="#cdc6eb"
        direction="left" loop="1">
        <div style={{
          color: "#000000"
        }}>Radhe Radhe Welcomes You All on Our Cricket 🏏 Betting site <a href="https://onlycricket.co.in" target="_blank"> onlysession.in</a> kindly make your id All odds available IPL CUP Match odds Session Toss just what's app to get id</div>

      </marquee>
      <div className={styles["user-race-data-main"]}>
        <div className={styles["user-race-header"]}>
          <p className={styles["user-race-title"]}>Today's Race</p>
          <button
            className={styles["state-button-user"]}
            onClick={() => {
              setParticipants({});
              setCountryState([]);
              setStateWiseData([]);
              setSelectedState({
                venue: "",
                raceNum: "",
                venueState: "",
              });
            }}>
            {" "}
            Today Race List
          </button>
        </div>

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
                          return data.data.venueName || data.venue;
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
                }}>
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
                  if (
                    items === "MYS" ||
                    items === "HYD" ||
                    items === "PUN" ||
                    items === "BLR" ||
                    items === "CAL" ||
                    items === "MAD" ||
                    items === "MMB"
                  ) {
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
                }}>
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
                    setLiveTrue(false);

                    setRaceIndexNum(index);
                    setSelectedState({
                      ...selectedState,
                      raceNum: index,
                      id: e.uid,
                    });
                  }}>
                  <Card.Body className={styles["user-card-body"]}>
                    <Card.Title>{`Race: ${e?.data?.raceNumber}`}</Card.Title>
                    <Card.Text
                      className={styles["user-simple-card-time"]}></Card.Text>
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
            <div className={styles["bet-live-button-div"]}>
              <p className={styles["user-race-title"]}>Race Details :</p>
              <Button
                className={styles["bet-live-button"]}
                onClick={() => handleGetLiveData(participants)}>
                {loading ? (
                  <ReactLoading
                    type={"spin"}
                    color={"#000000"}
                    height={30}
                    width={30}
                  />
                ) : (
                  <>
                    {" "}
                    <ImVideoCamera />
                    live
                  </>
                )}
              </Button>
            </div>

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
                      Distance: {participants?.data?.distance}
                    </span>
                    <span
                      style={{
                        background:
                          participants?.status === "COMPLETE" ||
                            participants?.status === "STOP"
                            ? "#f44336"
                            : participants?.status.toLowerCase() === "suspended"
                              ? "#f44336"
                              : "#1976d2",
                        textAlign: "center",
                        borderRadius: "7px",
                        padding: "4px",
                      }}>
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
                                    {item.map((e) => {
                                      return <>{e},</>;
                                    })}
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
            {liveTrue && (
              <div className={styles["bet-live-video"]}>
                <iframe
                  src={liveVideoData?.phenixEmbedUrl}
                  title="Phenix Live Streaming"
                  width="100%"
                  height="200px"
                  frameBorder="0"
                  style={{ position: "absolute", zIndex: 2 }}></iframe>
                <video
                  controls
                  width="100%"
                  height="200px"
                  style={{
                    position: "absolute",
                  }}>
                  <source
                    src={liveVideoData?.hlsUrl}
                    type="application/x-mpegURL"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {participants?.participants && (
              <Card style={{ marginLeft: "8px", border: "none" }}>
                <Card.Body
                  style={{ padding: "0px", width: "calc(100% - 2px)" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                    <p style={{ margin: "0px" }}>Horses :</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        marginRight: "20px",
                      }}>
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
                            }}>
                            <span className={styles["horce-num"]}>
                              {`(${e.data.horseNumber})`}
                            </span>
                            <img
                              className={styles["jersey-image"]}
                              src={e.data.jerseyUrl}></img>
                            <small
                              className={
                                styles["draw-num"]
                              }>{`(${e.data.cageNumber})`}</small>
                          </div>
                          <div className={styles["details-div"]}>
                            <div className={styles["horce-card-prs-name"]}>
                              {e.participant.name}
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                              }}>
                              Wt ={e.data.weight},draw :#{e.data.cageNumber}
                            </div>

                            <div
                              class="text-red-9"
                              style={{
                                fontSize: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: "column",
                              }}>
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
                          }}>
                          {(participants?.status?.toLowerCase() !==
                            "complete" ||
                            participants?.status?.toLowerCase() !== "result" ||
                            participants?.status?.toLowerCase() !== "stop") && (
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
                                        ? "#000000"
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
                                  }}>
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
                                        ? "#000000"
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
                                  }}>
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
                              style={{ fontSize: "5px", fill: "red" }}>
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
            <div className={styles["bet-all-list-header"]}>
              UPCOMING RACE <span>{new Date().toJSON().slice(0, 10)}</span>
            </div>
            <div className={styles["bet-all-list-div"]}>
              {allData.map((e, index) => {
                return (
                  <>
                    <div
                      className={styles["bet-all-list-race-show"]}
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
                        setLiveTrue(false);

                        setRaceIndexNum(index);
                        setSelectedState({
                          ...selectedState,
                          raceNum: index,
                          id: e.uid,
                        });
                      }}>
                      <div className={styles["bet-all-list-race-venue-div"]}>
                        <div className={styles["bet-all-list-race-venue"]}>
                          {e?.venue}
                        </div>
                        {e?.venue}
                      </div>
                      <div className={styles["bet-all-list-race-details"]}>
                        <span>race {e.data.raceNumber}</span>
                        <span style={{ fontWeight: 700 }}>
                          {convertHour(e.startDate)}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })}
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
