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
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { DeleteUserModal } from "./DeleteUserModal";

const User = () => {
  const { userData, setUseData } = useContext(Context);
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const [table, setTable] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [deleteUserShow, setdeleteUserShow] = useState(false);
  const [deleteData, setdeleteData] = useState({
    userId: "",
    userEmail: "",
  });

  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) => {
      setTable(snapshot.docs.map((doc) => doc.data()));
    });
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
          {user?.uid === "gP7ssoPxhkcaFPuPNIS9AXdv1BE3" && (
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
          )}
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
              {user?.uid === "gP7ssoPxhkcaFPuPNIS9AXdv1BE3" &&
                table?.map((e, index) => {
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
                          onClick={() => {
                            setdeleteData({
                              userId: e.uid,
                              userEmail: e.email,
                            });
                            setdeleteUserShow(true);
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
        <DeleteUserModal
          show={deleteUserShow}
          onHide={() => setdeleteUserShow(false)}
          deleteData={deleteData}
        />
      </div>
    </>
  );
};

export default User;
