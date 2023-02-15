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

  const [oddData, setOddData] = useState([]);
  const [newRace, setNewRace] = useState([]);
  const [selectedState, setSelectedState] = useState(true);
  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
      setOddData(
        snapshot.docs.map((doc) => doc.data())[0]?.Allrace[raceIndexNum]
      );
    });
  }, [raceIndexNum]);
  useEffect(() => {
    if (getCookie("access_token")) {
      navigate(`/user/admin/:gP7ssoPxhkcaFPuPNIS9AXdv1BE3`);
    } else {
      navigate("/login");
    }
  }, []);

  const handleRefreshAPi = async (e) => {
    setLoadingg(true);
    e.preventDefault();
    axios
      .get("https://node.rwitc.com:3002/data/racecard.json")
      .then((data) => {
        setLoadingg(false);
        const array = [];
        Object.values(data.data.racecard).map((data, index) => {
          return data.filter((item) => {
            if (
              item.vName.toLowerCase() === "mysore" ||
              item.vName.toLowerCase() === "madras" ||
              item.vName.toLowerCase() === "mumbai" ||
              item.vName.toLowerCase() === "hyderabad" ||
              item.vName.toLowerCase() === "delhi" ||
              item.vName.toLowerCase() === "calcutta"
            ) {
              return array.push(item);
            }
          });
        });
        setNewRace(array);

        db.collection("TimeData")
          .doc("RaceData")
          .update({ Allrace: array })
          .then((data) => {
            toast.success(`update Succesfully `);
          });
      })
      .catch((error) => {
        setLoadingg(false);
      });
  };

  const handleGetRace = async (e) => {
    setSelectedState(e.raceTime);
    setOddData(e);
  };
  const handleBetDelete = () => {
    setDeleteModalShow(true);
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
            </div>
          )}
          <div className={styles["user-card-main"]}>
            {indiaRace?.map((e, index) => {
              return (
                <>
                  <Card
                    className={
                      selectedState === e.raceTime
                        ? styles["user-simple-card-select"]
                        : styles["user-simple-card"]
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleGetRace(e);
                      setRaceIndexNum(index);
                    }}
                  >
                    <Card.Body className={styles["user-card-body"]}>
                      <Card.Title>{`Race: ${e.raceNumber}`}</Card.Title>
                      <Card.Text className={styles["user-simple-card-time"]}>
                        {e.vName}
                      </Card.Text>
                      <Card.Text className={styles["user-simple-card-hour"]}>
                        {e.raceTime}
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
                {oddData?.status === "DRL" && (
                  <Card>
                    <Card.Body className={styles["results-div"]}>
                      {oddData?.statusView
                        ?.split("-")
                        .slice(0, -1)
                        ?.map((item, index) => {
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
                  </Card>
                )}
              </div>
              {user?.uid === "gP7ssoPxhkcaFPuPNIS9AXdv1BE3" && (
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
                        oddData?.status?.toLowerCase() === "drl" ||
                        oddData?.status?.toLowerCase() === "stp"
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        const array1 = [...indiaRace];
                        if (
                          array1[raceIndexNum].status.toLowerCase() === "drl"
                        ) {
                          array1[raceIndexNum].status = "BST";
                        } else if (
                          array1[raceIndexNum].status.toLowerCase() === "bst"
                        ) {
                          array1[raceIndexNum].status = "STP";
                        } else if (
                          array1[raceIndexNum].status.toLowerCase() === "stp"
                        ) {
                          array1[raceIndexNum].status = "DRL";
                        }
                        db.collection("TimeData")
                          .doc("RaceData")
                          .update({ Allrace: array1 });
                      }}
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              )}
            </div>
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
                  oddData?.runners?.map((e, index) => {
                    return (
                      <tr index={index}>
                        <td>{e.position}</td>
                        <td>{e.name}</td>

                        <td>{e.jockey.name}</td>
                        <td>{e.trainer.name}</td>
                        <td>{e.odds.FOWIN}</td>
                        <td>{e.odds.FOPLC}</td>
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
      <RaceModel
        show={modalShow}
        data={oddData}
        onHide={() => setModalShow(false)}
      />
      <DeleteModel
        show={detelemodalShow}
        onHide={() => setDeleteModalShow(false)}
      ></DeleteModel>
    </>
  );
};
