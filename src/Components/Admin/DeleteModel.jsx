import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { db } from "../../config/firebase";

export const DeleteModel = (props) => {
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
            Bet Data Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <p> are you sure you want to all Bet data Delete?</p>
            <Button
              style={{
                marginRight: "10px",
              }}
              variant="danger"
              type="submit"
              onClick={() => {
                db.collection("participant")
                  .doc("gP7ssoPxhkcaFPuPNIS9AXdv1BE3")
                  .set({
                    data: [],
                  })
                  .then((item) => {
                    props.onHide();
                  });
              }}
            >
              Clear
            </Button>
            <Button variant="secondary" onClick={props.onHide}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
