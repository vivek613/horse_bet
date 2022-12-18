import React, { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { NavbarCommon } from "../../Navbar";
import styles from "./Dashboard.module.css";
import { db } from "../../../config/firebase";
import { useNavigate } from "react-router";
import { getCookie } from "../../../Hook/Cookies";
import { Toaster } from "react-hot-toast";
import axios from "axios";

export const Dashboard = () => {
  const horceTime = [
    {
      time: "Time",
      hour: "9:30 to 10:30",
    },
    {
      time: "Time",
      hour: "9:30 to 10:30",
    },
    {
      time: "Time",
      hour: "9:30 to 10:30",
    },
    {
      time: "Time",
      hour: "9:30 to 10:30",
    },
    {
      time: "Time",
      hour: "9:30 to 10:30",
    },
    {
      time: "Time",
      hour: "9:30 to 10:30",
    },
    {
      time: "Time",
      hour: "9:30 to 10:30",
    },
  ];
  const navigate = useNavigate();
  const [indiaRace, setIndiaRace] = useState([]);
  const [stateHorce, setStateHorce] = useState([]);
  const [horces, setHorces] = useState();
  const [participants, setParticipants] = useState();

  function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }
  useEffect(() => {
    // indiaRace?.todo?.forEach((data) => {
    //   item = data.venue;
    //   array.push(item);
    // });
  }, [indiaRace]);

  console.log(stateHorce);
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
          data?.todo?.forEach((items) => {
            item = items.venue;
            array.push(item);
            setStateHorce(removeDuplicates(array));
          });
        });
      });
    // doc;
  }, []);
  useEffect(() => {
    if (getCookie("access_token")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  const handleGetRace = (e) => {
    setHorces(e);
    console.log(e);
    navigate(`/dashboard?id=${e.uid}`);

    axios
      .get(`http://localhost:5000/api/getTimesOfRacing?id=${e.uid}`)
      .then((res) => {
        console.log(res);
        setParticipants(res?.data?.data);
        // setHorseData(res?.data?.data);

        // const taskDocRef = doc(db, "horsedata", "NXXo7iy7JLCkcaIO47O3");
        // try {
        //   updateDoc(taskDocRef, {
        //     todo: res?.data?.data,
        //   });
        // } catch (err) {
        //   alert(err);
        // }
      });
  };

  // console.log(indiaRace?.todo[0]);
  return (
    <>
      <NavbarCommon />
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles["user-race-data-main"]}>
        <p className={styles["user-race-title"]}>Today's Race</p>
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
                      <Card.Text className={styles["user-simple-card-time"]}>
                        {e.data.raceNumber}
                      </Card.Text>
                      <Card.Text className={styles["user-simple-card-hour"]}>
                        {e.hour}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </>
              );
            })}
        </div>
        <p className={styles["user-race-title"]}>Race Details :</p>
        <Card className={styles["race-details-card"]}>
          <Card.Body className={styles["race-id-main"]}>
            <div>
              <Card style={{ height: "100%" }}>
                <Card.Body>
                  <Card.Title>{horces?.data.raceNumber}</Card.Title>
                </Card.Body>
              </Card>
            </div>
            <Card className={styles["selected-race-data"]}>
              <Card.Body>
                <Card.Text>{horces?.data.label}</Card.Text>
                <Card.Text>Venue: {horces?.venue}</Card.Text>
                <Card.Text>Distance: {horces?.data.distance}</Card.Text>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
        <p className={styles["user-race-title"]}>Horces</p>
        <div className={styles["user-horce-card"]}>
          {participants?.participants.map((e) => {
            return (
              <>
                <Card>
                  <Card.Body className={styles["horce-card-body"]}>
                    <div className={styles["jersey-div"]}>
                      <img
                        src={e.data.jerseyUrl}
                        style={{
                          height: "50px",
                          width: "50px",
                        }}
                      ></img>
                    </div>

                    <div className={styles["details-div"]}>
                      <div className={styles["horce-card-prs-name"]}>
                        {e.participant.name}
                      </div>
                      <div
                        style={{
                          fontSize: " 0.75em",
                        }}
                      >
                        Wt={e.data.weight} draw:#{e.data.cageNumber}
                      </div>
                      <div class="text-red-9" style={{ fontSize: "0.75em" }}>
                        <span className={styles["jockey-icons"]}>J</span>
                        <span className={styles["jockey-details"]}>
                          {e.data.jockey}
                        </span>
                        <span class={styles["trainer-icons"]}>T</span>
                        <span className={styles["trainer-details"]}>
                          {e.data.trainer}
                        </span>
                      </div>
                    </div>
                    <div>
                      <button>a</button>
                      <button>b</button>
                    </div>
                  </Card.Body>
                </Card>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};
