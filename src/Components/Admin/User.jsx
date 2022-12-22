import React, { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { Context } from "../../App";
import { db } from "../../config/firebase";
import { Sidebar } from "./Sidebar";

const User = () => {
  const { setAdmin } = useContext(Context);
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
        </div>
      </div>
    </>
  );
};

export default User;
