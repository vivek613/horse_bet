import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Context } from "../../App";
import { db } from "../../config/firebase";
import { Sidebar } from "./Sidebar";
import { FiEdit } from "react-icons/fi";

import { AiFillDelete } from "react-icons/ai";

import { UserModel } from "./UserModel";
import { AddUserModel } from "./AddUserModel";
import { Toaster } from "react-hot-toast";
import { deleteUser, getAuth } from "firebase/auth";

const User = () => {
  const { setAdmin, userData, setUseData } = useContext(Context);
  const [table, setTable] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    let item;
    const array = [];

    db.collection("users").onSnapshot((snapshot) => {
      setTable(snapshot.docs.map((doc) => doc.data()));
      // snapshot.docs.map((doc) => {
      //  setTable()
      // });
    });
    // firebase
    //   .auth()
    //   .getUser("v3Vo9zautNTdPGlwdSBhGHixN502")
    //   .delete()
    //   .then(function () {
    //     console.log("user deleted");
    //   })
    //   .catch(function (error) {
    //     // console.log("Error while deleting user " + user.email);
    //   });
  }, []);

  return (
    <>
      <div>
        <Sidebar />
        <Toaster position="top-center" reverseOrder={false} />

        <h3
          style={{
            textAlign: "center",
            margin: "20px 10px 10px 10px",
            outline: "none",
            color: "black",
          }}
        >
          User
        </h3>
        <div></div>

        <div
          className="table-container"
          style={{
            margin: "10px 10px 10px 72px",
          }}
        >
          <button
            onClick={() => {
              setAddModalShow(true);
            }}
            style={{
              margin: "10px",
              height: "36px",
              padding: "0px 10px",
              outline: "none",
              border: "1px solid black",
              background: "#cdc6eb",
              color: "black",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add User
          </button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>user id</th>
                <th>email</th>
                <th>amount</th>
                <th>admin</th>
                <th>edit</th>
                <th>Delete</th>
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
                    <td>
                      <FiEdit
                        onClick={(event) => {
                          event.preventDefault();

                          setModalShow(true);
                          setUseData(e);
                        }}
                      />
                    </td>
                    <td>
                      <AiFillDelete
                        onClick={(event) => {
                          // const auth = getAuth();
                          // const user = auth.currentUser;
                          // // const user = auth.getUser(e.uid);
                          // deleteUser(e.uid).then((data) => {
                          //   console.log(data);
                          // });
                          // console.log(user);

                          getAuth()
                            .getUser(e.uid)
                            .then((userRecord) => {
                              // See the UserRecord reference doc for the contents of userRecord.
                              console.log(
                                `Successfully fetched user data: ${userRecord.toJSON()}`
                              );
                            })
                            .catch((error) => {
                              console.log("Error fetching user data:", error);
                            });
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <UserModel
          show={modalShow}
          data={userData}
          onHide={() => setModalShow(false)}
        />
        <AddUserModel
          show={addModalShow}
          onHide={() => setAddModalShow(false)}
        />
      </div>
    </>
  );
};

export default User;
