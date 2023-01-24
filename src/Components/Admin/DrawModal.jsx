import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./AdminDashboard.css";
import { Context } from "../../App";
import { db } from "../../config/firebase";

const DrawModal = (props) => {
  const {
    raceIndexNum,
    setRaceIndexNums,
    setIndiaRace,
    betData,
    setBetData,
    amountData,
    setAmountData,
  } = useContext(Context);
  const handleChange = async (event) => {
    if (event.target.checked) {
      db.collection("participant")
        .doc("eecYvXE0OXOczXQAodjzfjZ89ry2")
        .set({
          data: betData.map((data, index) => {
            if (
              props?.updateData?.data?.time === data.time &&
              props?.updateData?.data?.user_id === data.user_id &&
              props?.updateData?.data?.race_number === data.race_number &&
              props?.updateData?.data?.horce_number === data.horce_number &&
              props?.updateData?.data?.venue === data.venue
            ) {
              data.withdraw = true;
              data.status = "enabled";
            }
            return data;
          }),
        })
        .then(async (dd) => {
          db.collection("users")
            .doc(props?.updateData?.data?.user_id)
            .update({
              ...amountData,
              amount:
                Number(amountData.amount) +
                Number(props?.updateData?.data?.user_amount),
            })
            .then(() => {
              props.onHide();
            });
        });
    }
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
          Withdraw Status Update
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Form.Group className="status-form-div" controlId="formBasicPassword">
            <Form.Label> Withdraw Status</Form.Label>
            <input
              style={{
                height: "40px",
                width: "26px",
              }}
              type="checkbox"
              disabled={props?.updateData?.data?.withdraw}
              checked={props?.updateData?.data?.withdraw}
              id="withdraw"
              name="withdraw"
              value="Bike"
              onChange={(event) => {
                handleChange(event);
              }}
            ></input>
          </Form.Group>

          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DrawModal;
