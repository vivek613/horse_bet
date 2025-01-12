import React, { useContext, useEffect, useState } from "react";
import styles from "../User/UserSide/Dashboard.module.css";
import { Sidebar } from './Sidebar';
import { db } from "../../config/firebase";
import toast, { Toaster } from "react-hot-toast";

const Settings = (props) => {
  const [adminBWPData, setAdminBWPData] = useState(0);
  const [maxbet, setMaxbet] = useState(0);
  const [minbet, setMinbet] = useState(0);
  const [betmaxoddwin, setBetmaxoddwin] = useState(0);
  const [betmaxoddplc, setBetmaxoddplc] = useState(0);

  useEffect(() => {
    const unsubscribeUsers = db.collection("users")
      .doc("T0xHihFaGFfgLyByPzMcyvHm8du1")
      .onSnapshot((snapshot) => {
        setAdminBWPData(snapshot.data().sc);
      });

    const unsubscribeGeneralSetting = db.collection("GeneralSetting")
      .doc("optBALAApIh1cCTOZJOL")
      .onSnapshot((snapshot) => {
        const values = snapshot.data();
        setMaxbet(values.MaxBet);
        setMinbet(values.MinBet);
        setBetmaxoddwin(values.MaxOddWin);
        setBetmaxoddplc(values.MaxOddPlc);
      });

    return () => {
      unsubscribeUsers();
      unsubscribeGeneralSetting();
    };
  }, []);

  const handleUpdate = async () => {
    try {
      await db.collection("GeneralSetting").doc("optBALAApIh1cCTOZJOL").update({
        MaxBet: maxbet,
        MinBet: minbet,
        MaxOddWin: betmaxoddwin,
        MaxOddPlc: betmaxoddplc,
      });
      toast.success(`Values updated successfully`);
    } catch (error) {
      toast.error(`Failed to update values: ${error.message}`);
    }
  };

  return (
    <>
      <div>
        <Sidebar />
        <Toaster position="top-right" reverseOrder={false} />
        <div className="user-data-tabel">
          <p style={{ margin: "15px 15px 5px 0px", padding: "10px 10px 0px 0px", fontSize: "20px", color: "black", fontWeight: "600" }}>
            Update Settings
          </p>
          <p style={{ margin: "0px" }}>
            BWP Daily Service Charge : {adminBWPData}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "10px", flexDirection: "column" }}>
            {[
              { label: "Max Bet Value", value: maxbet, setter: setMaxbet },
              { label: "Min Bet Value", value: minbet, setter: setMinbet },
              { label: "Bet Max Odd Win", value: betmaxoddwin, setter: setBetmaxoddwin },
              { label: "Bet Max Odd Plc", value: betmaxoddplc, setter: setBetmaxoddplc }
            ].map((item, index) => (
              <div key={index} className="state-array-item" style={{ marginTop: "10px", width: "200px" }}>
                <label>{item.label}</label>
                <input type="text" placeholder={item.label} value={item.value} onChange={(e) => item.setter(e.target.value)} />
              </div>
            ))}
            <button
              className={styles["state-button-user-select"]}
              style={{ marginTop: "10px", width: "200px" }}
              onClick={handleUpdate}>Update</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
