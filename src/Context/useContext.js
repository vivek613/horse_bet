import React, { useState, createContext } from "react";

export const useContext = () => {
  const [hosreData, setHorseData] = useState([]);
  const [indiaRace, setIndiaRace] = useState([]);

  const [admin, setAdmin] = useState({});
  console.log(hosreData);
  return {
    hosreData,
    setHorseData,
    admin,
    setAdmin,
    indiaRace,
    setIndiaRace,
  };
};
