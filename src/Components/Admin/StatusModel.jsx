import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./AdminDashboard.css";
import { Context } from "../../App";
import { db } from "../../config/firebase";

const StatusModel = (props) => {
  console.log("props", props);
  const {
    raceIndexNum,
    setRaceIndexNums,
    setIndiaRace,
    betData,
    setBetData,
    amountData,
    setAmountData,
  } = useContext(Context);
  const [dividend, setDividend] = useState(0);
  const handleChange = async (event) => {
    console.log("betData", betData);
    if (event.target.checked) {
      db.collection("participant")
        .doc("eecYvXE0OXOczXQAodjzfjZ89ry2")
        .set({
          data: betData.map((data, index) => {
            if (props.updateData.key === index) {
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
                (Number(props?.updateData?.data?.user_amount) *
                  (Number(props?.updateData?.data?.value) -
                    (Number(props?.updateData?.data?.value) * dividend) / 100) +
                  Number(props?.updateData?.data?.user_amount)),
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
          status update
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Dividend ( IN %)</Form.Label>
            <Form.Control
              // disabled={
              //   props?.updateData?.data.status === "enabled" ? true : false
              // }
              type="number"
              name="dividend"
              required
              placeholder="Enter divident amount"
              value={dividend}
              onChange={(e) => setDividend(e.target.value)}
            />
          </Form.Group>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>
              Potential Amount :{"  "}
              {Number(props?.updateData?.data?.user_amount) *
                (Number(props?.updateData?.data?.value) -
                  (Number(props?.updateData?.data?.value) * dividend) / 100) +
                Number(props?.updateData?.data?.user_amount)}
            </p>
            <Form.Group
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "15px",
                padding: "0px",
              }}
              controlId="formBasicPassword"
            >
              <Form.Label>Status :</Form.Label>
              <input
                style={{
                  height: "26px",
                  width: "26px",
                }}
                type="checkbox"
                disabled={
                  props?.updateData?.data?.status === "enabled" ? true : false
                }
                checked={
                  props?.updateData?.data?.status === "enabled" ? true : false
                }
                id="vehicle1"
                name="vehicle1"
                value="Bike"
                onChange={(event) => {
                  handleChange(event);
                }}
              ></input>
            </Form.Group>
          </div>

          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StatusModel;
