import React, { useState, createContext } from "react";

export const useContext = () => {
  const [hosreData, setHorseData] = useState([]);
  const [indiaRace, setIndiaRace] = useState([]);

  const [admin, setAdmin] = useState({});
  return {
    hosreData,
    setHorseData,
    admin,
    setAdmin,
    indiaRace,
    setIndiaRace,
  };
};
