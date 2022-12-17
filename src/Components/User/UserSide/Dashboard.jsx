import React from "react";
import { Card, Button } from "react-bootstrap";
import { NavbarCommon } from "../../Navbar";
import styles from "./Dashboard.module.css";

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
  return (
    <>
      <NavbarCommon />
      <div className={styles["user-race-data-main"]}>
        <p className={styles["user-race-title"]}>Today's Race</p>
        <div className={styles["user-card-main"]}>
          {horceTime.map((e, index) => {
            return (
              <>
                <Card className={styles["user-simple-card"]}>
                  <Card.Body>
                    <Card.Title>{`Race: ${index + 1}`}</Card.Title>
                    <Card.Text className={styles["user-simple-card-time"]}>
                      {e.time}
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
        <p className={styles["user-race-title"]}>Horces</p>
        <div className={styles["user-horce-card"]}>
          {horceTime.map((e) => {
            return (
              <>
                <Card>
                  <Card.Body>
                    <Card.Title>{e.time}</Card.Title>
                    <Card.Text>{e.hour}</Card.Text>
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
