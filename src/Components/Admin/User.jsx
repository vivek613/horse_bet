import React, { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Context } from "../../App";
import { db } from "../../config/firebase";
import { Sidebar } from "./Sidebar";
import { FiEdit } from "react-icons/fi";
import { AdminDashboardModel } from "./AdminDashboardModel";

const User = () => {
  const { setAdmin, userData, setUseData } = useContext(Context);
  const [table, setTable] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const array = [];
    let item;
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        // Loop through the data and store
        // it in array to display
        querySnapshot.forEach((doc) => {
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

  return (
    <>
      <div>
        <Sidebar />

        <h3
          style={{
            textAlign: "center",
          }}
        >
          User
        </h3>
        <div
          className="table-container"
          style={{
            margin: "10px 89px",
          }}
        >
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>user id</th>
                <th>email</th>
                <th>amount</th>
                <th>admin</th>
                <th>edit</th>
              </tr>
            </thead>
            <tbody>
              {table?.map((e, index) => {
                return (
                  <tr index={index}>
                    <td>{e.id}</td>
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
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <AdminDashboardModel
          show={modalShow}
          data={userData}
          onHide={() => setModalShow(false)}
        />
      </div>
    </>
  );
};

export default User;
