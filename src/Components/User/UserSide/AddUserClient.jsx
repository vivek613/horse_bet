import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router";
import { NavbarCommon } from "../../Navbar";
import { db } from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { getCookie } from "../../../Hook/Cookies";

const AddUserClient = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    amount: 0,
    admin: false,
  });
  const [clientData, setClientData] = useState();
  useEffect(() => {
    const uid = getCookie("Uid");
    db.collection("users")
      .doc(uid)
      .onSnapshot((snapshot) => {
        setClientData(snapshot.data());
      });
  }, [user]);

  const handleAddUserClient = async () => {
    const authentication = getAuth();
    const res = createUserWithEmailAndPassword(
      authentication,
      newUser.email,
      newUser.password
    )
      .then((response) => {
        toast.success(`add Succesfully ${newUser.email}`);

        db.collection("users").doc(response._tokenResponse.localId).set({
          uid: response._tokenResponse.localId,
          email: newUser.email,
          // password: newUser.password,
          admin: newUser.admin,
          amount: newUser.amount,
        });
        db.collection("users")
          .doc(clientData.uid)
          .set({
            ...clientData,
            amount: Number(clientData.amount) - Number(newUser.amount),
          });
        setNewUser({ email: "", password: "", amount: 0, admin: false });
      })

      .catch((error) => {
        toast.error(` ${error.message}`);
      });
  };

  return (
    <>
      <NavbarCommon />
      <Toaster position="top-right" reverseOrder={false} />

      <span
        style={{
          fontSize: "39px",
          marginLeft: "15px",
        }}
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        <BiArrowBack />
      </span>
      <div style={{ margin: "20px 50px" }}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Email id for user</Form.Label>
            <Form.Control
              type="text"
              name="email"
              required
              placeholder="Enter user email..."
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password for user</Form.Label>
            <Form.Control
              type="text"
              name="password"
              required
              placeholder="Enter password for user..."
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Amount for user</Form.Label>
            <Form.Control
              type="text"
              name="amount"
              required
              placeholder="Enter amount for user..."
              value={newUser.amount}
              onChange={(e) =>
                setNewUser({ ...newUser, amount: e.target.value })
              }
            />
          </Form.Group>
          {clientData?.admin && newUser.amount < clientData.amount ? (
            <Button
              style={{
                marginRight: "10px",
              }}
              variant="primary"
              onClick={() => {
                handleAddUserClient();
              }}
            >
              Add User
            </Button>
          ) : (
            <p style={{ color: "red" }}>You can't add amount more than you.</p>
          )}
        </Form>
      </div>
    </>
  );
};

export default AddUserClient;
