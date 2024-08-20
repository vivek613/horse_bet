import React, { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import styles from "../User/UserSide/Dashboard.module.css";
import Table from "react-bootstrap/Table";
import "./AdminDashboard.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { db } from "../../config/firebase";
import { Context } from "../../App";
import { Sidebar } from "./Sidebar";
import { FiEdit } from "react-icons/fi";
import RaceModel from "./RaceModel";
import { useNavigate } from "react-router";
import { getCookie } from "../../Hook/Cookies";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-hot-toast";
import ReactLoading from "react-loading";
import { DeleteModel } from "./DeleteModel";
import { ImVideoCamera } from "react-icons/im";

const convertHour = (data) => {
  const date = new Date(data);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return hours + ":" + minutes;
};
export const AdminDashboard = () => {
  const auth = getAuth();

  const [user, loading, error] = useAuthState(auth);
  const {
    indiaRace,
    setIndiaRace,
    setUseData,
    setIndexNum,
    setRaceIndexNum,
    raceIndexNum,
  } = useContext(Context);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [detelemodalShow, setDeleteModalShow] = useState(false);
  const [loadingg, setLoadingg] = useState(false);
  const [raceDataLoading, setRaceDataLoading] = useState(false);
  const [raceResultLoading, setRaceResultLoading] = useState(false);

  const [oddData, setOddData] = useState([]);
  const [newRace, setNewRace] = useState([]);
  const [selectedState, setSelectedState] = useState(true);
  const [allCountry, setAllCountry] = useState([]);
  const [countryState, setCountryState] = useState([]);
  const [stateWiseData, setStateWiseData] = useState([]);
  const [liveTrue, setLiveTrue] = useState(false);
  const [liveVideoData, setLiveVideoData] = useState({});
  const [loadingLive, setLoadingLive] = useState(false);
  const [adminBWPData, setAdminBWPData] = useState(0);

  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
      const all_race = snapshot.docs.map((doc) => doc.data())[0].Allrace;

      const country = [
        ...new Set(
          all_race?.map((e) => {
            return e.data.venueCountry;
          })
        ),
      ];
      setAllCountry(country);
      setNewRace(all_race);
    });
  }, [raceIndexNum]);
  useEffect(() => {
    if (getCookie("access_token")) {
      navigate(`/user/admin/:gP7ssoPxhkcaFPuPNIS9AXdv1BE3`);
    } else {
      navigate("/login");
    }

    db.collection("users")
      .doc("gP7ssoPxhkcaFPuPNIS9AXdv1BE3")
      .onSnapshot((snapshot) => {
        setAdminBWPData(snapshot.data()?.sc);
      });
  }, []);

  const handleRefreshAPi = async (e) => {
    setLoadingg(true);
    e.preventDefault();
    axios
      .get("https://horse-batting.onrender.com/api/allDataForCountry")
      .then((data) => {
        setLoadingg(false);
        const country = [
          ...new Set(
            data?.data?.data.map((e) => {
              return e.data.venueCountry;
            })
          ),
        ];

        setNewRace(data?.data?.data);
        const array = [];

        setAllCountry(country);

        db.collection("TimeData")
          .doc("RaceData")
          .update({ Allrace: data?.data?.data })
          .then((data) => {
            toast.success(`update Succesfully `);
          });
        makeApiCalls(
          data?.data?.data.map((e) => {
            return e.uid;
          })
        );
      })
      .catch((error) => {
        setLoadingg(false);
      });
  };

  async function fetchData(uid) {
    setLoadingg(true);

    try {
      await axios
        .get(
          `https://horse-batting.onrender.com/api/getTimesOfRacing?id=${uid}`
        )
        .then((res) => {
          setLoadingg(false);
          setRaceDataLoading(false);
          db.collection("RaceData").doc(uid).set(res?.data?.data);
        })
        .catch((e) => {
          setLoadingg(false);
          setRaceDataLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoadingg(false);
      setRaceDataLoading(false);
    }
  }

  async function makeApiCalls(uids) {
    for (let i = 0; i < uids.length; i++) {
      await fetchData(uids[i]);
    }
  }

  const handleGetRace = async (e) => {
    // setSelectedState(e.raceTime);
    db.collection("RaceData")
      .doc(e.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.data()) {
          setOddData(snapshot.data());
        }
      });
    // setOddData(e);
  };
  const handleBetDelete = () => {
    setDeleteModalShow(true);
  };
  const handleRaceRefreshAPi = async (uid) => {
    setRaceDataLoading(true);

    try {
      await axios
        .get(
          `https://horse-batting.onrender.com/api/getTimesOfRacing?id=${uid}`
        )
        .then((res) => {
          setLoadingg(false);
          setRaceDataLoading(false);
          db.collection("RaceData").doc(uid).set(res?.data?.data);
        })
        .catch((e) => {
          setLoadingg(false);
          setRaceDataLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoadingg(false);
      setRaceDataLoading(false);
    }
  };
  const handleResultRefreshAPI = async (uid) => {
    setRaceResultLoading(true);
    try {
      await axios
        .get(
          `https://horse-batting.onrender.com/api/getTimesOfRacing?id=${uid}`
        )
        .then((res) => {
          setLoadingg(false);
          setRaceResultLoading(false);

          const new_object = {
            ...res.data.data,
            markets: oddData.markets,
          };

          db.collection("RaceData").doc(uid).set(new_object);
        })
        .catch((e) => {
          setLoadingg(false);
          setRaceResultLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoadingg(false);
      setRaceResultLoading(false);
    }
  };
  const handleGetLiveData = async (data) => {
    const id = data?.data?.externalId.split("-")[1];
    if (!liveTrue) {
      setLoadingLive(true);

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
            setLoadingLive(false);

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
  return (
    <>
      <div>
        <Sidebar />
        <div className="user-data-tabel">
          {user?.uid === "gP7ssoPxhkcaFPuPNIS9AXdv1BE3" && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                height: "50px",
                marginLeft: "15px",
              }}
            >
              <p
                style={{
                  marginTop: "10px",
                  color: "black",
                }}
              >
                Indian Race data
              </p>
              <Button
                style={{
                  background: "#cdc6eb",
                  color: "black",
                  border: "1px solid black",
                }}
                onClick={handleRefreshAPi}
              >
                {loadingg ? (
                  <ReactLoading
                    type={"spin"}
                    color={"#000000"}
                    height={30}
                    width={30}
                  />
                ) : (
                  "Refresh"
                )}
              </Button>
              <p
                style={{
                  marginTop: "10px",
                  color: "black",
                }}
              >
                Bet Data Delete
              </p>
              <Button
                style={{
                  background: "#cdc6eb",
                  color: "black",
                  border: "1px solid black",
                }}
                onClick={handleBetDelete}
              >
                Delete
              </Button>

              <p style={{ margin: "0px" }}>
                BWP Daily Service Charge : {adminBWPData}
              </p>
            </div>
          )}
          <div className={styles["state-array"]}>
            {allCountry?.map((items, index) => {
              return (
                <button
                  className={
                    selectedState?.venue === items
                      ? styles["state-button-user-select"]
                      : styles["state-button-user"]
                  }
                  onClick={() => {
                    setOddData({});
                    setStateWiseData([]);
                    if (items) {
                      const array = newRace.filter((e) => {
                        return e.data?.venueCountry === items;
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
                    } else {
                      const array = newRace.filter((e) => {
                        return e.data?.venueCountry === items;
                      });
                      const filteredData = array.map((item) => item.venue);

                      setCountryState([...new Set(filteredData)]);
                      setSelectedState({
                        venue: items,
                      });
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
                    if (
                      items === "MYS" ||
                      items === "HYD" ||
                      items === "PUN" ||
                      items === "BLR" ||
                      items === "CAL" ||
                      items === "MAD" ||
                      items === "MMB"
                    ) {
                      const array = newRace.filter((e) => {
                        return e.venue === items;
                      });
                      // setStateRace(array);
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
                    } else {
                      const array = newRace.filter((e) => {
                        return e.data.venueName === items;
                      });
                      // setStateRace(array);
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
                    }
                  }}
                >
                  {items}
                </button>
              );
            })}
          </div>
          <div className={styles["user-card-main"]}>
            {stateWiseData?.map((e, index) => {
              return (
                <>
                  <Card
                    className={
                      selectedState?.raceNum === index
                        ? styles["user-simple-card-select"]
                        : styles["user-simple-card"]
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleGetRace(e);
                      setSelectedState({
                        ...selectedState,
                        raceNum: index,
                      });
                      setLiveTrue(false);
                    }}
                  >
                    <Card.Body className={styles["user-card-body"]}>
                      <Card.Title>{`Race: ${e.data?.raceNumber}`}</Card.Title>
                      <Card.Text className={styles["user-simple-card-time"]}>
                        {/* {e.vName} */}
                      </Card.Text>
                      <Card.Text className={styles["user-simple-card-hour"]}>
                        {convertHour(e.startDate)}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </>
              );
            })}
          </div>

          <div
            className="table-container"
            style={{ margin: "20px 60px 20px 0px" }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                height: "50px",
                margin: "10px 0px 30px 0px",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div>
                {(oddData?.status === "COMPLETE" ||
                  oddData?.status?.toLowerCase() === "result") && (
                    <Card>
                      <Card.Body className={styles["results-div"]}>
                        {Object.values(oddData?.result?.standings)?.map(
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
                    </Card>
                  )}
              </div>

              {user?.uid === "gP7ssoPxhkcaFPuPNIS9AXdv1BE3" && (
                <>
                  <Button
                    className={styles["bet-live-button"]}
                    onClick={() => handleGetLiveData(oddData)}
                  >
                    {loadingLive ? (
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
                  <Button
                    style={{
                      background: "#cdc6eb",
                      color: "black",
                      border: "1px solid black",
                    }}
                    onClick={() => handleResultRefreshAPI(oddData.uid)}
                  >
                    {raceResultLoading ? (
                      <ReactLoading
                        type={"spin"}
                        color={"#000000"}
                        height={30}
                        width={30}
                      />
                    ) : (
                      "RaceResult Refresh"
                    )}
                  </Button>
                  <Button
                    style={{
                      background: "#cdc6eb",
                      color: "black",
                      border: "1px solid black",
                    }}
                    onClick={() => handleRaceRefreshAPi(oddData.uid)}
                  >
                    {raceDataLoading ? (
                      <ReactLoading
                        type={"spin"}
                        color={"#000000"}
                        height={30}
                        width={30}
                      />
                    ) : (
                      "RaceData Refresh"
                    )}
                  </Button>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      height: "50px",
                      margin: "10px 0px",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: "0px",
                        padding: "0px",
                        color: "red",
                        fontSize: "20px",
                        fontWeight: "600",
                      }}
                    >
                      Stop Bet :{" "}
                    </p>
                    <label class="switch">
                      <input
                        type="checkbox"
                        checked={
                          oddData?.status?.toLowerCase() === "complete" ||
                            oddData?.status?.toLowerCase() === "suspended" ||
                            oddData?.status?.toLowerCase() === "result" ||
                            oddData?.status?.toLowerCase() === "stop"
                            ? true
                            : false
                        }
                        disabled={
                          oddData?.status?.toLowerCase() === "complete"
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          if (oddData?.status?.toLowerCase() === "stop") {
                            const new_object = {
                              ...oddData,
                              status: "published",
                            };
                            db.collection("RaceData")
                              .doc(oddData.uid)
                              .set(new_object);
                          } else {
                            const new_object = {
                              ...oddData,
                              status: "STOP",
                            };
                            db.collection("RaceData")
                              .doc(oddData.uid)
                              .set(new_object);
                          }
                        }}
                      />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </>
              )}
            </div>
            {liveTrue && (
              <div className={styles["bet-live-video"]}>
                <iframe
                  src={liveVideoData?.phenixEmbedUrl}
                  title="Phenix Live Streaming"
                  width="100%"
                  height="200px"
                  frameBorder="0"
                  style={{ position: "absolute", zIndex: 2 }}
                ></iframe>
                <video
                  controls
                  width="100%"
                  height="200px"
                  style={{
                    position: "absolute",
                  }}
                >
                  <source
                    src={liveVideoData?.hlsUrl}
                    type="application/x-mpegURL"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <Table bordered hover>
              <thead>
                <tr>
                  <th>horce num</th>
                  <th>horce name</th>

                  <th>jockey</th>
                  <th>trainer</th>
                  <th>Win</th>
                  <th>place</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {!!oddData &&
                  user?.uid === "gP7ssoPxhkcaFPuPNIS9AXdv1BE3" &&
                  oddData?.participants?.map((e, index) => {
                    return (
                      <tr index={index}>
                        <td>{e.data.horseNumber}</td>
                        <td>{e.participant.name}</td>

                        <td>{e.data.jockey}</td>
                        <td>{e.data.trainer}</td>
                        <td>
                          {oddData?.markets[0]?.selections[index].odds?.price}
                        </td>
                        <td>
                          {oddData?.markets[1]?.selections[index].odds?.price}
                        </td>
                        <td>
                          <FiEdit
                            onClick={(event) => {
                              event.preventDefault();
                              setModalShow(true);
                              setUseData(e);
                              setIndexNum(index);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {modalShow && (
        <RaceModel
          show={modalShow}
          data={oddData}
          onHide={() => setModalShow(false)}
        />
      )}
      <DeleteModel
        show={detelemodalShow}
        onHide={() => setDeleteModalShow(false)}
      ></DeleteModel>
    </>
  );
};
