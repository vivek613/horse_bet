import React, { useContext, useEffect, useState } from "react";
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
  const { horseData, setHorseData, admin, setAdmin, indiaRace } =
    useContext(Context);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [table, setTable] = useState([]);

  useEffect(() => {
    const collectionName = "users";

    const array = [];
    let item;
    db.collection(collectionName)
      .get()
      .then((res_array) => {
        res_array.forEach((doc) => {
          item = doc.data();
          item.id = doc.id;
          array.push(item);
          item.admin === true && setAdmin(item.id);
        });

        setTable(array);
      });
    // doc;
  }, []);
  useEffect(() => {
    table.filter((data) => {
      if (data.admin === true) {
        setAdmin(data);
      }
    });
  }, [table]);

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
    indiaRace.todo?.map((data) => {
      axios
        .get(`http://localhost:5000/api/getTimesOfRacing?id=${data.uid}`)
        .then((res) => {
          db.collection("TimeData").doc(data.uid).set(res?.data?.data);
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
                  <th>user id</th>
                  <th>email</th>
                  <th>amount</th>
                  <th>admin</th>
                </tr>
              </thead>
              <tbody>
                {table?.map((e, index) => {
                  return (
                    <tr index={index}>
                      <td>{e.uid}</td>
                      <td>{e.email}</td>
                      <td>{e.amount}</td>
                      <td>{`${e.admin} `}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>{" "}
        </div>
      </div>
    </>
  );
};
