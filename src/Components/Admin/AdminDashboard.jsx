import React, { useEffect, useState } from "react";
import { NavbarCommon } from "../Navbar";
import Table from "react-bootstrap/Table";
import "./AdminDashboard.css";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import { AdminDashboardModel } from "./AdminDashboardModel";
import { DeleteData, GetFirebaseData } from "../../Hook/FirebaseDrivers";
import axios from "axios";

const data = [
  {
    id: 1,
    horseName: "jockey",
    horseNumber: "2",
    date: "12-12-2022",
    startTime: "23:13",
    endTime: "23:50",
    prize: "$20",
  },
  {
    id: 2,
    horseName: "rockey",
    horseNumber: "2",
    date: "13-12-2022",
    startTime: "21:13",
    endTime: "21:50",
    prize: "$30",
  },
];

export const AdminDashboard = () => {
  const [modalShow, setModalShow] = useState(false);
  const [table, setTable] = useState([]);
  useEffect(() => {
    // GetFirebaseData(setTable);
    const config = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI4NVJmbUduUDJQNkZVWWVDIiwic3ViIjoicmF6b3J8cmFjZTJ3aW4tbG9iYnl8NTUwM2M1NmItNTU0NC00MTZkLWE4ZTMtMzgwYWU0Yzc2ODBlIiwiZXhwIjoxNjcwODMwNTM5LCJpYXQiOjE2NzA4Mjk2MzksImp0aSI6ImVhOWZlYzY5LTQ2ZTgtNDI2ZC1hM2FlLTMxZjI3ZTRkNzIyZiIsInJvbGVzIjoiIn0.HPd_zM8ck9PqR2Wp1HkuONGiKAQ16bpUq1weGJ55K1I`,
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Accept-Language": "en-US,en;q=0.9",
        referer: "https://www.race2win.com/races/2022-12-13",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        // "sec-ch-ua": "Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    };
    const { data } = axios
      .get("https://www.race2win.com/api/mc/sport-fixture?active=true", config)
      .then((response) => {
        console.log(response.data);
        // this.setState({ posts: response.data });
      })
      .catch((err) => {
        console.log("API call error:", err.message);
      });
  }, []);
  console.log(table);
  return (
    <>
      <NavbarCommon />

      <div className="table-container">
        <Button
          style={{
            margin: "0px 7px",
          }}
          variant="primary"
          onClick={() => setModalShow(true)}
        >
          Add data
        </Button>

        <AdminDashboardModel
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Horse name</th>
              <th>Horse number</th>
              <th>Trainer</th>
              <th>Date</th>
              <th>start time </th>
              <th>end time </th>
              <th>Prize</th>
              <th colSpan={2}>action</th>
            </tr>
          </thead>
          <tbody>
            {table?.map((e, index) => {
              return (
                <tr index={index}>
                  <td>{e.id}</td>
                  <td>{e.horsename}</td>
                  <td>{e.horsenumber}</td>
                  <td>{e.trainer}</td>
                  <td>{e.date}</td>
                  <td>{e.starttime}</td>
                  <td>{e.endtime}</td>
                  <td>{e.prize}</td>
                  <td>
                    <AiFillEdit
                      style={{
                        margin: "5px 20px",
                      }}
                    />
                    <AiFillDelete
                      style={{
                        margin: "5px",
                      }}
                      onClick={(event) => {
                        console.log(e.id);
                        event.preventDefault();
                        DeleteData(e.id);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};
