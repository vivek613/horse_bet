import React, { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import styles from "../User/UserSide/Dashboard.module.css";

import { NavbarCommon } from "../Navbar";
import Table from "react-bootstrap/Table";
import "./AdminDashboard.css";
import { AiFillDelete, AiFillEdit, AiOutlineUser } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import { AdminDashboardModel } from "./AdminDashboardModel";
import { DeleteData } from "../../Hook/FirebaseDrivers";
import axios from "axios";
import { db } from "../../config/firebase";

import { useNavigate } from "react-router";
import { updateDoc, doc } from "firebase/firestore";
import { Context } from "../../App";
import { Sidebar } from "./Sidebar";

// Be sure to include styles at some point, probably during your bootstraping

export const AdminDashboard = () => {
  const { setHorseData, indiaRace, setIndiaRace } = useContext(Context);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [oddData, setOddData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const array = [];
    let item;
    db.collection("horsedata")
      .get()
      .then((querySnapshot) => {
        // Loop through the data and store
        // it in array to display
        querySnapshot.forEach((element) => {
          var data = element.data();

          setIndiaRace(data);
        });
      });
    // doc;
  }, []);
  console.log(indiaRace);

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
    indiaRace.todo?.map((data) => {
      axios
        .get(`http://localhost:5000/api/getTimesOfRacing?id=${data.uid}`)
        .then((res) => {
          console.log(res.data.data);
          // db.collection("TimeData").doc(data.uid).set(res?.data?.data);
          // console.log();
          // const array = res?.data?.data.participants.map((item) => {
          //   return item.participant.uid;
          // });
          // setHorseData(res?.data?.data);

          // const taskDocRef = doc(db, "horsedata", "NXXo7iy7JLCkcaIO47O3");
          // try {
          //   updateDoc(taskDocRef, {
          //     todo: res?.data?.data,
          //   });
          // } catch (err) {
          //   alert(err);
          // }
          // db.collection("oddTable").doc(array.map());
        });
    });
  };
  const handleGetRace = (e) => {
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
        // console.log(array3Alternative);
        // console.log(arr1, arr2);
        // const mergeByProperty = (target, source, prop) => {
        //   const array = [];
        //   target.forEach((sourceElement) => {
        //     let targetElement = source.forEach((targetElement) => {
        //       // console.log(sourceElement, targetElement);

        //       return sourceElement.participants === targetElement.participants;
        //       sourceElement["odds"] = targetElement.odds;
        //       console.log(sourceElement);
        //     });

        //     target.push(sourceElement.odds);
        //   });
        // };
        // mergeByProperty(arr1, arr2, "uid");
        // console.log(arr1);
      });
    // const docRef = db.collection("TimeData").doc(e.uid);
    // docRef.get().then((docSnap) => {
    //   setOddData(docSnap.data());
    //   console.log(docSnap.data());
    // });
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
                  oddData?.map((e, index) => {
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
