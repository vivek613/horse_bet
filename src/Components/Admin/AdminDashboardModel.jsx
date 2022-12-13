import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { AddDataToFirebase } from "../../Hook/FirebaseDrivers";

export const AdminDashboardModel = (props) => {
  const [formData, setFormData] = useState({
    horsename: "",
    horsenumber: "",
    trainer: "",
    date: "",
    starttime: "",
    endtime: "",
    prize: "",
  });

  console.log(formData);
  const handleSubmit = (e) => {
    e.preventDefault();
    AddDataToFirebase(formData);
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
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Form.Group className="mb-1" controlId="formBasicEmail">
            <Form.Label>Horse Name</Form.Label>
            <Form.Control
              type="text"
              required
              name="horsename"
              placeholder="Enter horsename"
              value={formData.horsename}
              onChange={(e) =>
                setFormData({ ...formData, horsename: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-1" controlId="formBasicPassword">
            <Form.Label>horse Number</Form.Label>
            <Form.Control
              required
              type="number"
              name="horsenumber"
              placeholder="Enter horsenumber"
              value={formData.horsenumber}
              onChange={(e) =>
                setFormData({ ...formData, horsenumber: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-1" controlId="formBasicPassword">
            <Form.Label>Trainer</Form.Label>
            <Form.Control
              type="text"
              required
              name="trainer"
              placeholder="Enter Trainer Name"
              value={formData.trainer}
              onChange={(e) =>
                setFormData({ ...formData, trainer: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-1" controlId="formBasicPassword">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              required
              placeholder="Enter date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-1" controlId="formBasicPassword">
            <Form.Label>Start time</Form.Label>
            <Form.Control
              type="time"
              required
              name="starttime"
              placeholder="Enter starttime"
              value={formData.starttime}
              onChange={(e) =>
                setFormData({ ...formData, starttime: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-1" controlId="formBasicPassword">
            <Form.Label>End time</Form.Label>
            <Form.Control
              type="time"
              name="endtime"
              required
              placeholder="Enter endtime"
              value={formData.endtime}
              onChange={(e) =>
                setFormData({ ...formData, endtime: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Prize</Form.Label>
            <Form.Control
              type="text"
              name="prize"
              required
              placeholder="Enter prize"
              value={formData.prize}
              onChange={(e) =>
                setFormData({ ...formData, prize: e.target.value })
              }
            />
          </Form.Group>
          <Button
            style={{
              marginRight: "10px",
            }}
            variant="primary"
            type="submit"
            // onClick={handleSubmit}
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
