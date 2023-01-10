import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../config/firebase";
import { Context } from "../../App";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";

export const AddUserModel = (props) => {
  const { setAdmin, userData, setUseData, addUser, setAddUser } =
    useContext(Context);

  const [formData, setFormData] = useState(userData);

  const handleSubmit = async (user) => {
    const authentication = getAuth();

    const res = createUserWithEmailAndPassword(
      authentication,
      addUser.email,
      addUser.password
    )
      .then((response) => {
        const user = response.user;
        toast.success(`add Succesfully ${addUser.email}`);

        db.collection("users").doc(response._tokenResponse.localId).set({
          uid: response._tokenResponse.localId,
          email: addUser.email,
          password: addUser.password,
          admin: addUser.admin,
          amount: "0",
        });
      })

      .catch((error) => {
        console.log(error);
        toast.error(` ${error.message}`);
      });

    // e.preventDefault();
    // AddDataToFirebase(formData);
    props.onHide();
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="Amount"
              required
              placeholder="Enter email"
              value={addUser.email}
              onChange={(e) =>
                setAddUser({ ...addUser, email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>password</Form.Label>
            <Form.Control
              type="text"
              name="Amount"
              required
              placeholder="Enter password"
              value={addUser.password}
              onChange={(e) =>
                setAddUser({ ...addUser, password: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group
            className="mb-3 add-user-check"
            controlId="formBasicPassword"
          >
            <Form.Label>Admin</Form.Label>
            <input
              style={{
                height: "20px",
                width: "20px",
                marginRight: "72%",
              }}
              type="checkbox"
              checked={addUser.admin}
              name="vehicle1"
              value="Bike"
              onChange={(e) => {
                setAddUser({ ...addUser, admin: e.target.checked });
              }}
            ></input>
          </Form.Group>
          <Button
            style={{
              marginRight: "10px",
            }}
            variant="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
