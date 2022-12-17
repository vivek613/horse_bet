import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AdminDashboard } from "./Components/Admin/AdminDashboard";
import { Login } from "./Components/User/Auth/Login";
import { Dashboard } from "./Components/User/UserSide/Dashboard";
import { Register } from "./Components/User/Auth/Register";
import { useContext } from "./Context/useContext";

import { createContext } from "react";

export const Context = createContext(useContext);
function App() {
  const value = useContext(Context);
  return (
    <>
      <BrowserRouter>
        <Context.Provider value={value}>
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user/admin" element={<AdminDashboard />} />
          </Routes>
        </Context.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
