import React, { useState, createContext } from "react";

export const useContext = () => {
  const [hosreData, setHorseData] = useState([]);
  const [indiaRace, setIndiaRace] = useState([]);
  const [userData, setUseData] = useState({});
  const [winPlc, setWinPlc] = useState([]);
  const [betData, setBetData] = useState();
  const [amountData, setAmountData] = useState({});
  const [addUser, setAddUser] = useState({});

  const [indexNum, setIndexNum] = useState();
  const [raceIndexNum, setRaceIndexNum] = useState();
  const [userBet, setUserBet] = useState([]);

  const [admin, setAdmin] = useState({});
  return {
    hosreData,
    setHorseData,
    admin,
    setAdmin,
    indiaRace,
    setIndiaRace,
    userData,
    setUseData,
    indexNum,
    setIndexNum,
    raceIndexNum,
    setRaceIndexNum,
    winPlc,
    setWinPlc,
    betData,
    setBetData,
    amountData,
    setAmountData,
    userBet,
    setUserBet,
    addUser,
    setAddUser,
  };
};
