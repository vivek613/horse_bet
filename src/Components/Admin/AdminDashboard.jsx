import React, { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import styles from "../User/UserSide/Dashboard.module.css";

import Table from "react-bootstrap/Table";
import "./AdminDashboard.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { db } from "../../config/firebase";

import { useNavigate } from "react-router";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Context } from "../../App";
import { Sidebar } from "./Sidebar";

// Be sure to include styles at some point, probably during your bootstraping

export const AdminDashboard = () => {
  const { setHorseData, indiaRace, setIndiaRace } = useContext(Context);
  const navigate = useNavigate();
  const [oddData, setOddData] = useState([]);

  useEffect(() => {
    db.collection("horsedata").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data()));
    });

    // doc;
    axios
      .get("https://node.rwitc.com:3002/data/racecard.json")
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleRefreshAPi = async (e) => {
    e.preventDefault();
    axios.get("http://localhost:5000/api/allDataForCountry").then((res) => {
      setHorseData(res?.data?.data);

      const taskDocRef = doc(db, "horsedata", "NXXo7iy7JLCkcaIO47O3");
      try {
        updateDoc(taskDocRef, {
          todo: res?.data?.data,
        });
      } catch (err) {
        alert(err);
      }
    });
  };
  const handleRaceTimeData = (e) => {
    e.preventDefault();
    axios
      .all(
        indiaRace.todo.map((data) =>
          axios.get(`http://localhost:5000/api/getTimesOfRacing?id=${data.uid}`)
        )
      )
      .then((res) =>
        indiaRace.todo.map((data) => {
          res.map((res) => {
            var arr1 = res.data.data.participants;
            var arr2 = res.data.data.markets[0].selections;
            var arr3 = res.data.data.markets[1].selections;

            var array3 = arr1.map((obj, index) => ({
              ...obj,
              win: { ...arr2[index].odds },
            }));

            const array4 = array3.map((ob, index) => ({
              ...ob,
              pls: { ...arr3[index].odds },
            }));
            setOddData(array4);

            db.collection("TimeData").doc(data.uid).set(array4);
          });
        })
      );
    // indiaRace.todo?.map((data) => {
    //   setTimeout(() => {
    //     axios
    //       .get(`http://localhost:5000/api/getTimesOfRacing?id=${data.uid}`)
    //       .then((res) => {
    //         console.log(res.data.data);
    //         var arr1 = res.data.data.participants;
    //         var arr2 = res.data.data.markets[0].selections;
    //         var arr3 = res.data.data.markets[1].selections;

    //         var array3 = arr1.map((obj, index) => ({
    //           ...obj,
    //           win: { ...arr2[index].odds },
    //         }));

    //         const array4 = array3.map((ob, index) => ({
    //           ...ob,
    //           pls: { ...arr3[index].odds },
    //         }));
    //         setOddData(array4);
    //         db.collection("TimeData").doc(data.uid).set(array4);
    //         // console.log();
    //         // const array = res?.data?.data.participants.map((item) => {
    //         //   return item.participant.uid;
    //         // });
    //         // setHorseData(res?.data?.data);

    //         // const taskDocRef = doc(db, "horsedata", "NXXo7iy7JLCkcaIO47O3");
    //         // try {
    //         //   updateDoc(taskDocRef, {
    //         //     todo: res?.data?.data,
    //         //   });
    //         // } catch (err) {
    //         //   alert(err);
    //         // }
    //         // db.collection("oddTable").doc(array.map());
    //       });
    //   }, 1000);
    // });
  };
  const handleGetRace = async (e) => {
    db.collection("TimeData")
      .doc("024d203d-aacb-4d47-be64-1d358bb4e")
      .delete()
      .then((data) => {
        console.log(data);
      });
    const docRef = db.collection("TimeData").doc(e.uid);

    await docRef.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        setOddData(docSnapshot.data());
      } else {
        axios
          .get(`http://localhost:5000/api/getTimesOfRacing?id=${e.uid}`)
          .then((res) => {
            var arr1 = res.data.data.participants;
            var arr2 = res.data.data.markets[0].selections;
            var arr3 = res.data.data.markets[1].selections;
            var array3 = arr1.map((obj, index) => ({
              ...obj,
              win: { ...arr2[index].odds },
            }));
            const array4 = array3.map((ob, index) => ({
              ...ob,
              pls: { ...arr3[index].odds },
            }));
            setOddData(array4);
            db.collection("TimeData")
              .doc(res?.data?.data?.uid)
              .set({ participants: array4 });
          });
      }
    });
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
          <p
            style={{
              marging: "0px",
            }}
          >
            racetime Data refresh button
          </p>
          <Button onClick={handleRaceTimeData}> race time refresh</Button>

          <div className={styles["user-card-main"]}>
            {indiaRace &&
              indiaRace.todo?.map((e) => {
                return (
                  <>
                    <Card
                      className={styles["user-simple-card"]}
                      onClick={() => {
                        handleGetRace(e);
                      }}
                    >
                      <Card.Body className={styles["user-card-body"]}>
                        <Card.Title>{`Race: ${e.data.raceNumber}`}</Card.Title>
                        <Card.Text
                          className={styles["user-simple-card-time"]}
                        ></Card.Text>
                        <Card.Text className={styles["user-simple-card-hour"]}>
                          {e.hour}
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
                  <th>trainer</th>
                  <th>Win</th>
                  <th>place</th>
                </tr>
              </thead>
              <tbody>
                {!!oddData &&
                  oddData?.participants?.map((e, index) => {
                    return (
                      <tr index={index}>
                        <td>{e.participant.uid}</td>
                        <td>{e.data.jockey}</td>
                        <td>{e.data.trainer}</td>
                        <td>{e.win.price}</td>
                        <td>{e.pls.price}</td>

                        {/* <td>{`${e.admin} `}</td> */}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};
