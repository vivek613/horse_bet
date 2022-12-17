import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
// import { signOut } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { deleteAllCookies } from "../Hook/Cookies";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../App";
import { toast } from "react-hot-toast";

export const NavbarCommon = () => {
  const auth = getAuth();
  const { toastData, setToastData } = useContext(Context);

  const [user, loading, error] = useAuthState(auth);

  const navigate = useNavigate();
  console.log(auth);

  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <Navbar.Brand href="#home">Horse Race</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <div
            style={{
              display: "flex",
              gap: "15px",
            }}
          >
            {user ? (
              <div>
                <Button
                  variant="primary"
                  onClick={(e) => {
                    // e.preventDefault();
                    try {
                      auth
                        .signOut()
                        .then((response) => {
                          toast.success(`log Out  successfully`);
                          navigate("/login");
                          deleteAllCookies();
                        })
                        .catch((error) => {
                          toast.error(error.message);
                        });
                    } catch (err) {
                      toast.error(err.message);
                      // <Toasts />;
                    }
                  }}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={(e) => {
                    // e.preventDefault();
                    // deleteAllCookies();

                    navigate("/login");
                  }}
                >
                  login
                </Button>
                <Button
                  variant="primary"
                  onClick={(e) => {
                    // e.preventDefault();

                    navigate("/register");
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
