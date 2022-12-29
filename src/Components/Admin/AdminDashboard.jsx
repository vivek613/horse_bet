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

// Be sure to include styles at some point, probably during your bootstraping

export const AdminDashboard = () => {
  const {
    setHorseData,
    indiaRace,
    setIndiaRace,
    userData,
    setUseData,
    setIndexNum,
    setRaceIndexNum,
  } = useContext(Context);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [oddData, setOddData] = useState([]);
  const [newRace, setNewRace] = useState([]);
  const [selectedState, setSelectedState] = useState(false);

  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
    });
    // doc;
  }, [newRace]);

  const handleRefreshAPi = async (e) => {
    e.preventDefault();
    // axios.get("http://localhost:5000/api/allDataForCountry").then((res) => {
    //   setHorseData(res?.data?.data);

    //   const taskDocRef = doc(db, "horsedata", "NXXo7iy7JLCkcaIO47O3");
    //   try {
    //     updateDoc(taskDocRef, {
    //       todo: res?.data?.data,
    //     });
    //   } catch (err) {
    //     alert(err);
    //   }
    // });
    axios
      .get("https://node.rwitc.com:3002/data/racecard.json")
      .then((data) => {
        const array = [];
        Object.values(data.data.racecard).map((data, index) => {
          return data.filter((item) => {
            console.log(data);
            if (
              item.vName === "Mysore" ||
              item.vName === "Madras" ||
              item.vName === "MUMBAI" ||
              item.vName === "HYDERABAD" ||
              item.vName === "Delhi" ||
              item.vName === "CALCUTTA"
            ) {
              return array.push(item);
            }
          });
        });
        console.log(array);
        setNewRace(array);

        db.collection("TimeData").doc("RaceData").update({ Allrace: array });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetRace = async (e) => {
    console.log(e);
    setSelectedState(e.raceNumber);
    setOddData(e.runners);
  };

  return (
    <>
      <div>
        <Sidebar />

        <div className="user-data-tabel">
          <p
            style={{
              marging: "0px",
            }}
          >
            indiaRace data refresh button
          </p>
          <Button onClick={handleRefreshAPi}>refresh</Button>

          <div className={styles["user-card-main"]}>
            {indiaRace?.map((e, index) => {
              return (
                <>
                  <Card
                    className={
                      selectedState === e.raceNumber
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

          <div className="table-container">
            <Table bordered hover>
              <thead>
                <tr>
                  {/* <th>user id</th> */}
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
                        {/* <td>{e.uid}</td> */}
                        <td>{e.jockey.name}</td>
                        <td>{e.trainer.name}</td>
                        <td>{e.odds.WIN}</td>
                        <td>{e.odds.PLC}</td>
                        <td>
                          <FiEdit
                            onClick={(event) => {
                              event.preventDefault();
                              console.log(index);
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
