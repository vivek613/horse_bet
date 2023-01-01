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

const BetTable = () => {
  const {
    indiaRace,
    setIndiaRace,
    userData,
    betData,
    setBetData,
    setRaceIndexNum,
    amountData,
    setAmountData,
  } = useContext(Context);
  const [selectedState, setSelectedState] = useState(true);
  const [raceWiseBetData, setRaceWiseBetData] = useState();
  const [updateData, setUpdateData] = useState();
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
    });
    db.collection("participant")
      .doc("eecYvXE0OXOczXQAodjzfjZ89ry2")
      .onSnapshot((snapshot) => {
        setBetData(snapshot.data()?.data);
      });

    // doc;
  }, []);

  return (
    <>
      <div>
        <Sidebar />
        <div className="user-data-tabel">
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
                    onClick={() => {
                      // handleGetRace(e);
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

          <div className="table-container">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>user id</th>
                  <th>jockey</th>
                  <th>Race No</th>
                  <th>potential am</th>
                  <th>odds</th>
                  <th>venue</th>

                  <th>status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {!!raceWiseBetData &&
                  raceWiseBetData?.map((e, index) => {
                    return (
                      <tr index={index}>
                        <td>{e.user_id}</td>
                        <td>{e.jockey_name}</td>
                        <td>{e.race_number}</td>
                        <td>{e.potential_amount}</td>
                        <td>{e.type}</td>
                        <td>{e.venue}</td>
                        <td>{e.status}</td>

                        <td>
                          <FiEdit
                            onClick={(event) => {
                              event.preventDefault();

                              setUpdateData(e);
                              db.collection("users")
                                .doc(e.user_id)
                                .onSnapshot((snapshot) => {
                                  setAmountData(snapshot.data());
                                });

                              setModalShow(true);
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
    </>
  );
};

export default BetTable;
