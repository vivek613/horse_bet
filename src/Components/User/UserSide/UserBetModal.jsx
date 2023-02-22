import React, { useEffect, useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import styles from "./Dashboard.module.css";
import { db } from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { Context } from "../../../App";
import { getCookie } from "../../../Hook/Cookies";
import ReactLoading from "react-loading";

export const UserBetModal = ({ walletModal, setWalletModal }) => {
  const {
    winPlc,
    setWinPlc,
    userBet,
    setUserBet,
    raceIndexNum,
    indexNum,
    indiaRace,
    setIndiaRace,
  } = useContext(Context);
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [participant, setParticipant] = useState([]);
  const [betAmount, setBetAmount] = useState(0);
  const [userData, setUserData] = useState([]);
  const [showValue, setShowValue] = useState(false);
  const [betLoading, setbetLoading] = useState(false);
  const [forProfitAdminData, setforProfitAdminData] = useState();

  useEffect(() => {
    db.collection("users")
      .doc("gP7ssoPxhkcaFPuPNIS9AXdv1BE3")
      .onSnapshot((snapshot) => {
        setforProfitAdminData(snapshot.data());
      });
  }, []);

  useEffect(() => {
    const uid = getCookie("Uid");
    db.collection("participant")
      .doc("gP7ssoPxhkcaFPuPNIS9AXdv1BE3")
      .onSnapshot((snapshot) => {
        setParticipant(snapshot.data()?.data);
      });
    db.collection("participant")
      .doc(uid)
      .onSnapshot((snapshot) => {
        if (snapshot.data()) {
          setUserBet(snapshot.data()?.data);
        }
      });
    db.collection("users")
      .doc(uid)
      .onSnapshot((res) => {
        setUserData(res.data());
      });
  }, [user]);

  useEffect(() => {
    db.collection("TimeData").onSnapshot((snapshot) => {
      setIndiaRace(snapshot.docs.map((doc) => doc.data())[0].Allrace);
    });
  }, []);

  const handleSubmit = () => {
    setbetLoading(true);
    if (Number(betAmount) <= Number(userData.amount)) {
      db.collection("users")
        .doc(user?.uid)
        .update({
          ...userData,
          amount:
            Number(userData.amount) -
            Number(betAmount) -
            (Number(betAmount) * 10) / 100,
        })
        .then(function () {
          setbetLoading(false);
          setWalletModal(false);
          setBetAmount(0);
          db.collection("users")
            .doc("gP7ssoPxhkcaFPuPNIS9AXdv1BE3")
            .update({
              ...forProfitAdminData,
              sc:
                Number(forProfitAdminData?.sc) + (Number(betAmount) * 10) / 100,
              amount: Number(forProfitAdminData?.amount) + Number(betAmount),
            })
            .then(function () {});
        });
      db.collection("participant")
        .doc("gP7ssoPxhkcaFPuPNIS9AXdv1BE3")
        .set({
          data: [...participant, winPlc],
        });
      db.collection("participant")
        .doc(user?.uid)
        .set({
          data: [...userBet, winPlc],
        });
    } else {
    }
  };

  return (
    <>
      {walletModal && (
        <div className="bet-main-div">
          <div
            className="bet-pop-up"
            style={{
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.15), 0 6px 20px 0 rgba(0, 0, 0, 0.50)",
            }}
          >
            <h4>Bet for you...</h4>
            <hr style={{ color: "#866afb" }} />

            <div className={styles["wallet-calc"]}>
              <p>
                Odds - {winPlc.type} : {winPlc.value}
              </p>

              {Number(betAmount) + (Number(betAmount) * 10) / 100 <=
              Number(userData?.amount) ? (
                <p>Your Bet Amount : {betAmount}</p>
              ) : (
                <p style={{ color: "red" }}>
                  Sorry, You have not enough balance
                </p>
              )}
            </div>
            <Form style={{ width: "100%" }}>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  min={100}
                  max={25000}
                  value={betAmount}
                  name="amount"
                  placeholder="Enter Amount"
                  onChange={(e) => {
                    if (e.target.value < 100 || e.target.value > 25000) {
                      setShowValue(true);
                    } else {
                      setShowValue(false);
                      setWinPlc({
                        ...winPlc,
                        user_amount: e.target.value,
                        dividend: 0,
                        potential_amount:
                          Number(e.target.value) * Number(winPlc.value) +
                          Number(e.target.value),
                      });
                    }
                    setBetAmount(e.target.value);
                  }}
                />
              </Form.Group>
              {showValue && betAmount !== 0 ? (
                <p
                  style={{
                    color: "red",
                  }}
                >
                  {" "}
                  Please enter a minimum 100 and maximum 25000 amount
                </p>
              ) : (
                ""
              )}
              <hr style={{ color: "#866afb" }} />
              <div className={styles["wallet-calc"]}>
                <p>BWP :</p>
                <p>{(Number(betAmount) * 10) / 100}</p>
              </div>
              <div className={styles["wallet-calc"]}>
                <p>Potential Amount :</p>
                <p>
                  +
                  {Number(betAmount) * Number(winPlc.value) + Number(betAmount)}
                </p>
              </div>
              <div className={styles["wallet-button-wrapper"]}>
                {betLoading ? (
                  <ReactLoading
                    type={"spin"}
                    color={"#000000"}
                    height={30}
                    width={30}
                  />
                ) : (
                  <Button
                    disabled={
                      Number(betAmount) + (Number(betAmount) * 10) / 100 <=
                        Number(userData?.amount) &&
                      betAmount >= 100 &&
                      betAmount <= 25000
                        ? false
                        : true
                    }
                    variant="primary"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Confirm
                  </Button>
                )}
                <Button
                  variant="primary"
                  style={{
                    background: "transparent",
                    color: "black",
                    outline: "1px solid black",
                  }}
                  onClick={() => {
                    setBetAmount(0);
                    setWalletModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
