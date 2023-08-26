import React, { useState, createContext } from "react";

export const useContext = () => {
  const [hosreData, setHorseData] = useState([]);
  const [indiaRace, setIndiaRace] = useState([]);
  const [userData, setUseData] = useState({});
  const [winPlc, setWinPlc] = useState([]);
  const [betData, setBetData] = useState();
  const [amountData, setAmountData] = useState({});
  const [addUser, setAddUser] = useState({
    admin: false,
    amount: 0,
  });

  const [indexNum, setIndexNum] = useState();
  const [raceIndexNum, setRaceIndexNum] = useState();
  const [userBet, setUserBet] = useState([]);
  const [admin, setAdmin] = useState({});
  const [participants, setParticipants] = useState();
  const convertHour = (data) => {
    const date = new Date(data);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const seconds = date.getSeconds();

    return (
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0")
    );
  };
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
    participants,
    setParticipants,
    convertHour,
  };
};
