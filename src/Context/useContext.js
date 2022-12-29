import React, { useState, createContext } from "react";

export const useContext = () => {
  const [hosreData, setHorseData] = useState([]);
  const [indiaRace, setIndiaRace] = useState([]);
  const [userData, setUseData] = useState({});

  const [indexNum, setIndexNum] = useState();
  const [raceIndexNum, setRaceIndexNum] = useState(0);

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
  };
};
