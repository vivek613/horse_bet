import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import styles from "./Dashboard.module.css";
import { db } from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

export const UserBetModal = ({
  walletModal,
  setWalletModal,
  winPlc,
  userData,
  adminData,
  horcesData,
}) => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [participantVivek, setParticipantVivek] = useState([]);
  const [betAmount, setBetAmount] = useState(0);
  const [newBetEntry, setnewBetEntry] = useState({
    jockey_name: horcesData?.jockey?.name,
    odds_type: winPlc?.type,
    potential_amount: (betAmount - (betAmount * 28.18) / 100) * winPlc.value,
    race_no: winPlc?.race_number,
    status: "disabled",
    user_amount: userData?.amount - betAmount,
    user_id: user?.uid,
    venue: winPlc?.venue,
  });

  useEffect(() => {
    db.collection("participant")
      .doc("eecYvXE0OXOczXQAodjzfjZ89ry2")
      .get()
      .then((res) => {
        setParticipantVivek(res.data()?.data?.users);
      });
  }, [user]);

  console.log("participant", participantVivek);

  const handleSubmit = () => {
    // setParticipantVivek([...participantVivek, newBetEntry]);
    if (Number(betAmount) < Number(userData.amount)) {
      db.collection("users")
        .doc(userData.uid)
        .update({
          ...userData,
          amount: Number(userData.amount) - Number(betAmount),
        })
        .then(function () {
          setWalletModal(false);
          db.collection("users")
            .doc(adminData.uid)
            .update({
              ...adminData,
              amount: Number(adminData.amount) + Number(betAmount),
            })
            .then(function () {});
        });
      db.collection("participant")
        .doc("eecYvXE0OXOczXQAodjzfjZ89ry2")
        .set({
          data: {
            jockey_name: horcesData.jockey.name,
            odds_type: winPlc.type,
            potential_amount:
              (betAmount - (betAmount * 28.18) / 100) * winPlc.value,
            race_no: winPlc.race_number,
            status: "disabled",
            user_amount: userData.amount - betAmount,
            user_id: user.uid,
            users: [...participantVivek, newBetEntry],
            venue: winPlc.venue,
          },
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
              <p>Odds - Win : {winPlc.value} </p>
              {Number(betAmount) < Number(userData.amount) ? (
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
                  min={0}
                  value={betAmount}
                  name="amount"
                  placeholder="Enter Amount"
                  onChange={(e) => {
                    setBetAmount(e.target.value);
                  }}
                />
              </Form.Group>
              <div className={styles["wallet-calc"]}>
                <p>Win Faces Amount :</p>
                <p>+ {betAmount - (betAmount * 28.18) / 100}</p>
              </div>
              <div className={styles["wallet-calc"]}>
                <p>GST(14.09%) :</p>
                <p>+ {(betAmount * 14.09) / 100}</p>
              </div>
              <div className={styles["wallet-calc"]}>
                <p>CGST(14.09%) :</p>
                <p>+ {(betAmount * 14.09) / 100}</p>
              </div>
              <hr style={{ color: "#866afb" }} />
              <div className={styles["wallet-calc"]}>
                <p>Potential Amount</p>
                <p>+{(betAmount - (betAmount * 28.18) / 100) * winPlc.value}</p>
              </div>
              <div className={styles["wallet-button-wrapper"]}>
                <Button
                  disabled={
                    Number(betAmount) < Number(userData.amount) &&
                    0 < Number(betAmount)
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
