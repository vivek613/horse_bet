import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Context } from "../../App";
import { db } from "../../config/firebase";

const RaceModel = (props) => {
  const { indexNum, indiaRace, raceIndexNum, setIndiaRace, setParticipants } =
    useContext(Context);
  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
      setParticipants(
        snapshot.docs.map((doc) => doc.data())[0].Allrace[raceIndexNum]?.runners
      );
    });
  }, []);

  const handleSubmit = async (user) => {
    db.collection("TimeData").doc("RaceData").update({ Allrace: indiaRace });
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
          Odd Win Change
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
            <Form.Label>WIN</Form.Label>
            <Form.Control
              type="text"
              name="Amount"
              required
              placeholder="Enter prize"
              defaultValue={
                indiaRace[raceIndexNum]?.runners[indexNum]?.odds.FOWIN
              }
              value={indiaRace[raceIndexNum]?.runners[indexNum]?.odds.FOWIN}
              onChange={(e) => {
                // setUseData({ ...userData, amount: e.target.value });
                const array1 = [...indiaRace];
                array1[raceIndexNum].runners[indexNum].odds.FOWIN =
                  e.target.value;
                setIndiaRace(array1);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>PLC</Form.Label>
            <Form.Control
              type="text"
              name="Amount"
              required
              placeholder="Enter prize"
              defaultValue={
                indiaRace[raceIndexNum]?.runners[indexNum]?.odds.FOPLC
              }
              value={indiaRace[raceIndexNum]?.runners[indexNum]?.odds.FOPLC}
              onChange={(e) => {
                const array1 = [...indiaRace];
                array1[raceIndexNum].runners[indexNum].odds.FOPLC =
                  e.target.value;
                setIndiaRace(array1);
              }}
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

export default RaceModel;
