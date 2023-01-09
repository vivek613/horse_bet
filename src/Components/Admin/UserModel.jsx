import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../config/firebase";
import { Context } from "../../App";

export const UserModel = (props) => {
  const { setAdmin, userData, setUseData } = useContext(Context);

  const [formData, setFormData] = useState(userData);

  const handleSubmit = async (user) => {
    db.collection("users")
      .doc(userData.uid)
      .update(userData)
      .then(function () {});
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
        <Modal.Title id="contained-modal-title-vcenter">
          User Update
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Prize</Form.Label>
            <Form.Control
              type="text"
              name="Amount"
              required
              placeholder="Enter prize"
              defaultValue={userData.amount}
              value={userData.amount}
              onChange={(e) =>
                setUseData({ ...userData, amount: e.target.value })
              }
            />
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
