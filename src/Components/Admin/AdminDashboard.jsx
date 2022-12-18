import React, { useContext, useEffect, useState } from "react";
import { NavbarCommon } from "../Navbar";
import Table from "react-bootstrap/Table";
import "./AdminDashboard.css";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import { AdminDashboardModel } from "./AdminDashboardModel";
import {
  AddDataToFirebase,
  DeleteData,
  GetFirebaseData,
} from "../../Hook/FirebaseDrivers";
import axios from "axios";
import { db } from "../../config/firebase";

import { getCookie } from "../../Hook/Cookies";
import { useNavigate } from "react-router";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Context } from "../../App";

export const AdminDashboard = () => {
  const { horseData, setHorseData, admin, setAdmin } = useContext(Context);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [table, setTable] = useState([]);

  // var docRef = firebase
  //   .firestore()
  //   .collection("users")
  //   .doc(firebase.auth().currentUser.uid);
  // var o = {};
  // docRef.get().then(function (thisDoc) {
  //   if (thisDoc.exists) {
  //     //user is already there, write only last login
  //     o.lastLoginDate = Date.now();
  //     docRef.update(o);
  //   } else {
  //     //new user
  //     o.displayName = firebase.auth().currentUser.displayName;
  //     o.accountCreatedDate = Date.now();
  //     o.lastLoginDate = Date.now();
  //     // Send it
  //     docRef.set(o);
  //   }
  // });
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
    const aarr = table.filter((data) => {
      if (data.admin === true) {
        setAdmin(data);
      }
    });
  }, [table]);

  const handleRefreshAPi = async (e) => {
    e.preventDefault();
    axios.get("http://localhost:5000/api/allDataForCountry").then((res) => {
      setHorseData(res?.data?.data);

      // addDoc(collection(db, "horsedata").doc("NXXo7iy7JLCkcaIO47O3"), {
      //   todo: res?.data?.data,
      // });
      // e.preventDefault();
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

  return (
    <>
      <NavbarCommon />
      <Button onClick={handleRefreshAPi}>refresh</Button>
      <h2>user details</h2>
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
              <th> user id</th>
              <th>email</th>
              {/* <th>Horse number</th> */}
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
                  <td>{e.admin}</td>

                  <td>
                    <AiFillEdit
                      style={{
                        margin: "5px 20px",
                      }}
                    />
                    {e.admin === "false" && (
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
                    )}
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
