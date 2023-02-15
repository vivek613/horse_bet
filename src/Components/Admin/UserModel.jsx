import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { db } from "../../config/firebase";
import { Context } from "../../App";

export const UserModel = (props) => {
  const { userData } = useContext(Context);
  const [userAddAMount, setUserAddAMount] = useState(0);

  const handleSubmit = async (user) => {
    db.collection("users")
      .doc(userData.uid)
      .update({
        ...userData,
        amount: Number(userData.amount) + Number(userAddAMount),
      })
      .then(function () {});
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
              type="number"
              name="Amount"
              required
              placeholder="Enter prize"
              value={userAddAMount}
              onChange={(e) => setUserAddAMount(e.target.value)}
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
