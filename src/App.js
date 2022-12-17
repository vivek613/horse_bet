import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AdminDashboard } from "./Components/Admin/AdminDashboard";
import { Login } from "./Components/User/Auth/Login";
import { Dashboard } from "./Components/User/UserSide/Dashboard";
import { Register } from "./Components/User/Auth/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
