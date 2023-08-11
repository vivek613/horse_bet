import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./AdminDashboard.css";
import { Context } from "../../App";
import { db } from "../../config/firebase";
import ReactLoading from "react-loading";

const DrawModal = (props) => {
  const { betData, amountData } = useContext(Context);
  const [adminDataForAmount, setadminDataForAmount] = useState();
  const [userBetData, setUserBetData] = useState([]);

  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    db.collection("users")
      .doc("gP7ssoPxhkcaFPuPNIS9AXdv1BE3")
      .onSnapshot((snapshot) => {
        setadminDataForAmount(snapshot.data());
      });
    db.collection("participant")
      .doc(props?.updateData?.data?.user_id)
      .onSnapshot((snapshot) => {
        setUserBetData(snapshot.data()?.data);
      });
  }, []);

  const handleChange = async (event) => {
    if (event.target.checked) {
      setWithdrawLoading(true);
      db.collection("participant")
        .doc("gP7ssoPxhkcaFPuPNIS9AXdv1BE3")
        .set({
          data: userBetData.map((data, index) => {
            if (
              props?.updateData?.data?.time === data.time &&
              props?.updateData?.data?.user_id === data.user_id &&
              props?.updateData?.data?.race_number === data.race_number &&
              props?.updateData?.data?.horce_number === data.horce_number &&
              props?.updateData?.data?.venue === data.venue
            ) {
              data.withdraw = true;
            }
            return data;
          }),
        });
      db.collection("participant")
        .doc(props?.updateData?.data?.user_id)
        .set({
          data: userBetData.map((data, index) => {
            if (
              props?.updateData?.data?.time === data.time &&
              props?.updateData?.data?.user_id === data.user_id &&
              props?.updateData?.data?.race_number === data.race_number &&
              props?.updateData?.data?.horce_number === data.horce_number &&
              props?.updateData?.data?.venue === data.venue
            ) {
              data.withdraw = true;
            }
            return data;
          }),
        })
        .then(async (dd) => {
          db.collection("users")
            .doc("gP7ssoPxhkcaFPuPNIS9AXdv1BE3")
            .update({
              ...adminDataForAmount,
              sc:
                Number(adminDataForAmount?.sc) -
                (Number(props?.updateData?.data?.user_amount) * 10) / 100,
              amount:
                Number(adminDataForAmount?.amount) -
                Number(props?.updateData?.data?.user_amount),
            })
            .then(function () {
              setWithdrawLoading(false);
            });
          db.collection("users")
            .doc(props?.updateData?.data?.user_id)
            .update({
              ...amountData,
              amount:
                Number(amountData.amount) +
                Number(props?.updateData?.data?.user_amount) +
                (Number(props?.updateData?.data?.user_amount) * 10) / 100,
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
            {withdrawLoading ? (
              <ReactLoading
                type={"spin"}
                color={"#000000"}
                height={30}
                width={30}
              />
            ) : (
              <input
                style={{
                  height: "40px",
                  width: "26px",
                }}
                type="checkbox"
                disabled={
                  props?.updateData?.data?.withdraw === "enabled" ||
                  props?.updateData?.data?.loss === true ||
                  props?.updateData?.data?.withdraw === true
                    ? true
                    : false
                }
                checked={props?.updateData?.data?.withdraw}
                id="withdraw"
                name="withdraw"
                value="Bike"
                onChange={(event) => {
                  handleChange(event);
                }}
              ></input>
            )}
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
