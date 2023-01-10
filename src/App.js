import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AdminDashboard } from "./Components/Admin/AdminDashboard";
import { Login } from "./Components/User/Auth/Login";
import { Dashboard } from "./Components/User/UserSide/Dashboard";
import { Register } from "./Components/User/Auth/Register";
import { useContext } from "./Context/useContext";

import { createContext } from "react";
import User from "./Components/Admin/User";
import BetTable from "./Components/Admin/BetTable";
import MyBet from "./Components/User/UserSide/MyBet";
import AddUserClient from "./Components/User/UserSide/AddUserClient";

export const Context = createContext(useContext);
function App() {
  const value = useContext(Context);
  return (
    <>
      <BrowserRouter>
        <Context.Provider value={value}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/mybet" element={<MyBet />} />
            <Route path="/dashboard/adduserpage" element={<AddUserClient />} />

            {/* <Route path="/dashboard/:id" element={<Dashboard />} /> */}

            <Route path="/user/admin/:id" element={<AdminDashboard />} />
            <Route path="/user/admin/usertable/:id" element={<User />} />
            <Route path="/user/admin/bettable/:id" element={<BetTable />} />
          </Routes>
        </Context.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
