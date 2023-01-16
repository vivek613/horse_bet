import React, { useContext, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import Table from "react-bootstrap/Table";
import styles from "../User/UserSide/Dashboard.module.css";
import { Context } from "../../App";
import { db } from "../../config/firebase";
import { FiEdit } from "react-icons/fi";
import { doc, updateDoc } from "firebase/firestore";
import StatusModel from "./StatusModel";
import DrawModal from "./DrawModal";

const BetTable = () => {
  const {
    indiaRace,
    setIndiaRace,
    userData,
    betData,
    setBetData,
    raceIndexNum,
    setRaceIndexNum,
    amountData,
    setAmountData,
  } = useContext(Context);
  const [selectedState, setSelectedState] = useState(true);
  const [raceWiseBetData, setRaceWiseBetData] = useState();
  const [updateData, setUpdateData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [drawModalShow, setDrawModalShow] = useState(false);
  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
    });
    db.collection("participant")
      .doc("eecYvXE0OXOczXQAodjzfjZ89ry2")
      .onSnapshot((snapshot) => {
        setBetData(snapshot.data()?.data);
        setRaceWiseBetData(
          snapshot.data()?.data.filter((item) => {
            if (
              item.venue === selectedState.venue &&
              item.race_number === selectedState.num
            ) {
              return item;
            }
          })
        );
      });

    // doc;
  }, []);

  return (
    <>
      <div>
        <Sidebar />
        <div className="user-data-tabel">
          <p
            style={{
              margin: "15px 15px 5px 15px",
              padding: "10px 10px 0px 10px",
              fontSize: "20px",
              color: "black",
              fontWeight: "600",
            }}
          >
            User Bet Data :{" "}
          </p>
          <div className={styles["user-card-main"]}>
            {indiaRace?.map((e, index) => {
              return (
                <>
                  <Card
                    className={
                      selectedState.time === e.raceTime
                        ? styles["user-simple-card-select"]
                        : styles["user-simple-card"]
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // handleGetRace(e);
                      setSelectedState({
                        time: e.raceTime,
                        venue: e.vName,
                        num: e.raceNumber,
                      });
                      setRaceWiseBetData(
                        betData.filter((item) => {
                          if (
                            item.venue === e.vName &&
                            item.race_number === e.raceNumber
                          ) {
                            return item;
                          }
                        })
                      );

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
            style={{ margin: "20px 55px 20px -10px" }}
          >
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Email ID</th>
                  <th>Jockey</th>
                  <th>Horce num</th>
                  <th>Odds</th>
                  <th>Race No</th>
                  <th>Potential am</th>
                  <th>Venue</th>
                  <th>₹ Bet</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>draw Status</th>
                </tr>
              </thead>
              <tbody>
                {!!raceWiseBetData &&
                  raceWiseBetData?.map((e, index) => {
                    return (
                      <tr index={index}>
                        <td>{e.email}</td>
                        <td>{e.jockey_name}</td>
                        <td>{e.horce_number}</td>
                        <td>{e.type}</td>
                        <td>{e.race_number}</td>
                        <td>{e.potential_amount}</td>
                        <td>{e.venue}</td>
                        <td>{e.user_amount}</td>
                        <td>{e.status}</td>
                        <td>
                          <FiEdit
                            onClick={(event) => {
                              event.preventDefault();

                              setUpdateData({
                                data: e,
                                key: index,
                              });
                              db.collection("users")
                                .doc(e.user_id)
                                .onSnapshot((snapshot) => {
                                  setAmountData(snapshot.data());
                                });

                              setModalShow(true);
                            }}
                          />
                        </td>
                        <td>
                          <FiEdit
                            onClick={(event) => {
                              event.preventDefault();

                              // setUpdateData(e);
                              setUpdateData({
                                data: e,
                                key: index,
                              });
                              db.collection("users")
                                .doc(e.user_id)
                                .onSnapshot((snapshot) => {
                                  setAmountData(snapshot.data());
                                });

                              setDrawModalShow(true);
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
      <StatusModel
        show={modalShow}
        updateData={updateData}
        onHide={() => setModalShow(false)}
      />
      <DrawModal
        show={drawModalShow}
        updateData={updateData}
        onHide={() => setDrawModalShow(false)}
      />
    </>
  );
};

export default BetTable;
