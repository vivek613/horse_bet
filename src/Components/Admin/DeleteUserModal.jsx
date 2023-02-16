import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { db } from "../../config/firebase";

export const DeleteUserModal = (props) => {
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "black" }}>
            Are you sure you want to delete{" "}
            <span style={{ color: "red" }}>{props.deleteData.userEmail}</span>?
          </p>
          <Button
            style={{
              marginRight: "10px",
            }}
            variant="danger"
            type="submit"
            onClick={() => {
              db.collection("users")
                .doc(props.deleteData.userId)
                .delete()
                .then((item) => {
                  props.onHide();
                });
            }}
          >
            Confirm
          </Button>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};
