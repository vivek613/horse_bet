import React, { useState } from "react";
import { NavbarCommon } from "../Navbar";
import Table from "react-bootstrap/Table";
import "./AdminDashboard.css";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import { AdminDashboardModel } from "./AdminDashboardModel";

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
              <th>Date</th>
              <th>start time </th>
              <th>end time </th>
              <th>Prize</th>
              <th colSpan={2}>action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e, index) => {
              return (
                <tr index={index}>
                  <td>{e.id}</td>
                  <td>{e.horseName}</td>
                  <td>{e.horseNumber}</td>
                  <td>{e.date}</td>
                  <td>{e.startTime}</td>
                  <td>{e.endTime}</td>
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
