import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import styles from "./Dashboard.module.css";

export const UserBetModal = ({ walletModal, setWalletModal, winPlc }) => {
  const [betAmount, setBetAmount] = useState(0);

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
              <p>Odds - Win : {winPlc} </p>
              <p>Your Bet Amount : {betAmount}</p>
            </div>
            <Form style={{ width: "100%" }}>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
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
                <p>+{(betAmount - (betAmount * 28.18) / 100) * winPlc}</p>
              </div>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={() => {
                  setBetAmount(0);
                  setWalletModal(false);
                }}
              >
                Cancel
              </Button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
