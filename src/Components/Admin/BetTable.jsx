import React, { useContext, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import Table from "react-bootstrap/Table";
import styles from "../User/UserSide/Dashboard.module.css";
import { Context } from "../../App";
import { db } from "../../config/firebase";
import { FiEdit } from "react-icons/fi";
import StatusModel from "./StatusModel";
import DrawModal from "./DrawModal";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const BetTable = () => {
  const {
    indiaRace,
    setIndiaRace,
    betData,
    setBetData,
    setRaceIndexNum,
    setAmountData,
    convertHour,
  } = useContext(Context);
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [selectedState, setSelectedState] = useState({});
  const [raceWiseBetData, setRaceWiseBetData] = useState();
  const [updateData, setUpdateData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [drawModalShow, setDrawModalShow] = useState(false);
  const [filterHorce, setFilterHorce] = useState();
  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
    });
    db.collection("participant")
      .doc("gP7ssoPxhkcaFPuPNIS9AXdv1BE3")
      .onSnapshot((snapshot) => {
        setBetData(snapshot.data()?.data);
        setRaceWiseBetData(snapshot.data()?.data);
      });

    // doc;
  }, []);
  useEffect(() => {
    if (!filterHorce) {
      setRaceWiseBetData(betData);
    }
  }, [filterHorce]);
  // useEffect(() => {
  //   setRaceWiseBetData(betData);
  // }, []);

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
                      selectedState.time === convertHour(e.startDate)
                        ? styles["user-simple-card-select"]
                        : styles["user-simple-card"]
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // handleGetRace(e);
                      setFilterHorce();
                      setSelectedState({
                        time: convertHour(e.startDate),
                        venue: e.data.venueName,
                        num: e.data.raceNumber,
                      });
                      setRaceWiseBetData(
                        betData.filter((item) => {
                          if (
                            item.venue === e.data.venueName &&
                            item.race_number === e.data.raceNumber
                          ) {
                            return item;
                          }
                        })
                      );
                      setRaceIndexNum(index);
                    }}
                  >
                    <Card.Body className={styles["user-card-body"]}>
                      <Card.Title>{`Race: ${e.data.raceNumber}`}</Card.Title>
                      <Card.Text className={styles["user-simple-card-time"]}>
                        {e.data?.venueName}
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
            style={{
              margin: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <p style={{ fontWeight: "600", color: "black" }}>
              Horce Number :-{" "}
            </p>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  min={1}
                  name="horce_number"
                  value={filterHorce}
                  placeholder="Enter Horce Number"
                  onChange={(e) => {
                    setFilterHorce(e.target.value);

                    // setRaceWiseBetData(
                    //   raceWiseBetData.filter(
                    //     (d) => d.horce_number === Number(e.target.value)
                    //   )
                    // );
                  }}
                />
              </Form.Group>
            </Form>
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
                  <th>B.Time</th>
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
                {user?.uid === "gP7ssoPxhkcaFPuPNIS9AXdv1BE3" &&
                  raceWiseBetData?.map((e, index) => {
                    return (
                      <tr index={index}>
                        <td>{e.email}</td>
                        <td>{e.jockey_name}</td>
                        <td>{`${new Date(e.time).getHours()}:${new Date(
                          e.time
                        ).getMinutes()}`}</td>
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
