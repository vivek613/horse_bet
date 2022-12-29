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

// Be sure to include styles at some point, probably during your bootstraping

export const AdminDashboard = () => {
  const { setHorseData, indiaRace, setIndiaRace } = useContext(Context);
  const [oddData, setOddData] = useState([]);
  const [newRace, setNewRace] = useState([]);

  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
    });
    // doc;
  }, [newRace]);
  console.log(indiaRace);

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

        db.collection("TimeData").doc("RaceData").set({ Allrace: array });
      })
      .catch((error) => {
        console.log(error);
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
    console.log(e);
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
          <p
            style={{
              marging: "0px",
            }}
          >
            racetime Data refresh button
          </p>
          <Button onClick={handleRaceTimeData}> race time refresh</Button>

          <div className={styles["user-card-main"]}>
            {indiaRace?.map((e) => {
              return (
                <>
                  <Card
                    className={styles["user-simple-card"]}
                    onClick={() => {
                      handleGetRace(e);
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
