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
    GetFirebaseData(setTable);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://www.race2win.com/api/mc/sport-fixture?active=true&date=2022-12-08",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
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
