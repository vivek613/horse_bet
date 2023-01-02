import React, { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import styles from "../User/UserSide/Dashboard.module.css";
import Table from "react-bootstrap/Table";
import "./AdminDashboard.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { db } from "../../config/firebase";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Context } from "../../App";
import { Sidebar } from "./Sidebar";
import { FiEdit } from "react-icons/fi";
import RaceModel from "./RaceModel";
import { useNavigate } from "react-router";
import { getCookie } from "../../Hook/Cookies";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-hot-toast";

// Be sure to include styles at some point, probably during your bootstraping

export const AdminDashboard = () => {
  const auth = getAuth();

  const [user, loading, error] = useAuthState(auth);
  const {
    setHorseData,
    indiaRace,
    setIndiaRace,
    userData,
    setUseData,
    setIndexNum,
    setRaceIndexNum,
    raceIndexNum,
  } = useContext(Context);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [oddData, setOddData] = useState([]);
  const [newRace, setNewRace] = useState([]);
  const [selectedState, setSelectedState] = useState(true);
  console.log(user);
  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
      setOddData(
        snapshot.docs.map((doc) => doc.data())[0]?.Allrace[raceIndexNum]
          ?.runners
      );
    });
    // doc;
  }, []);
  useEffect(() => {
    if (getCookie("access_token")) {
      navigate(`/user/admin/${user?.uid}`);
    } else {
      navigate("/login");
    }
  }, []);

  const handleRefreshAPi = async (e) => {
    e.preventDefault();

    axios.get("https://node.rwitc.com:3002/data/racecard.json").then((data) => {
      const array = [];
      Object.values(data.data.racecard).map((data, index) => {
        return data.filter((item) => {
          if (
            item.vName.toLowerCase() === "mysore" ||
            item.vName.toLowerCase() === "madras" ||
            item.vName.toLowerCase() === "mumbai" ||
            item.vName.toLowerCase() === "hyderabad" ||
            item.vName.toLowerCase() === "delhi" ||
            item.vName.toLowerCase() === "calcutta" ||
            item.vName.toLowerCase() === "bangalore"
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
    });
  };

  const handleGetRace = async (e) => {
    setSelectedState(e.raceTime);
    setOddData(e.runners);
  };
  const handleBetDelete = () => {
    db.collection("participant").doc("eecYvXE0OXOczXQAodjzfjZ89ry2").delete();
  };

  return (
    <>
      <div>
        <Sidebar />
        <div className="user-data-tabel">
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
              Refresh
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
              Refresh
            </Button>
          </div>
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

          <div className="table-container">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>horce num</th>
                  <th>jockey</th>
                  <th>trainer</th>
                  <th>Win</th>
                  <th>place</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {!!oddData &&
                  oddData?.map((e, index) => {
                    return (
                      <tr index={index}>
                        <td>{e.position}</td>
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
                        {/* <td>{`${e.admin} `}</td> */}
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
    </>
  );
};
