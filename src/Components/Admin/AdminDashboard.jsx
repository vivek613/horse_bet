import React, { useContext, useEffect, useState } from "react";
import { NavbarCommon } from "../Navbar";
import Table from "react-bootstrap/Table";
import "./AdminDashboard.css";
import { AiFillDelete, AiFillEdit, AiOutlineUser } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import { AdminDashboardModel } from "./AdminDashboardModel";
import { DeleteData } from "../../Hook/FirebaseDrivers";
import axios from "axios";
import { db } from "../../config/firebase";

import { useNavigate } from "react-router";
import { updateDoc, doc } from "firebase/firestore";
import { Context } from "../../App";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";

// Be sure to include styles at some point, probably during your bootstraping
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FaUserAlt } from "react-icons/fa";

export const AdminDashboard = () => {
  const { horseData, setHorseData, admin, setAdmin } = useContext(Context);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [table, setTable] = useState([]);

  useEffect(() => {
    const collectionName = "users";

    const array = [];
    let item;
    db.collection(collectionName)
      .get()
      .then((res_array) => {
        res_array.forEach((doc) => {
          item = doc.data();
          item.id = doc.id;
          array.push(item);
          item.admin === true && setAdmin(item.id);
        });

        setTable(array);
      });
    // doc;
  }, []);
  useEffect(() => {
    table.filter((data) => {
      if (data.admin === true) {
        setAdmin(data);
      }
    });
  }, [table]);
  console.log(table);

  const handleRefreshAPi = async (e) => {
    e.preventDefault();
    axios.get("http://localhost:5000/api/allDataForCountry").then((res) => {
      setHorseData(res?.data?.data);

      const taskDocRef = doc(db, "horsedata", "NXXo7iy7JLCkcaIO47O3");
      try {
        updateDoc(taskDocRef, {
          todo: res?.data?.data,
        });
      } catch (err) {
        alert(err);
      }
    });
  };

  return (
    <>
      <SideNav
        onSelect={(selected) => {
          // Add your code here
        }}
      >
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="home">
            <NavIcon>
              <FaUserAlt />
            </NavIcon>
            <NavText>Home</NavText>
          </NavItem>
          <NavItem eventKey="charts">
            <NavIcon>
              <i
                className="fa fa-fw fa-line-chart"
                style={{ fontSize: "1.75em" }}
              />
            </NavIcon>
            <NavText>Charts</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
      {/* <NavbarCommon />
       */}
      {/* <div
        style={{
          display: "flex",
        }}
      >
        <div class="header"></div>
        <input type="checkbox" class="openSidebarMenu" id="openSidebarMenu" />
        <label for="openSidebarMenu" class="sidebarIconToggle">
          <div class="spinner diagonal part-1"></div>
          <div class="spinner horizontal"></div>
          <div class="spinner diagonal part-2"></div>
        </label>
        <div id="sidebarMenu">
          <ul class="sidebarMenuInner">
            <li>
              Jelena Jovanovic <span>Web Developer</span>
            </li>
            <li>
              <a href="https://vanila.io" target="_blank">
                Company
              </a>
            </li>
            <li>
              <a href="https://instagram.com/plavookac" target="_blank">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://twitter.com/plavookac" target="_blank">
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/channel/UCDfZM0IK6RBgud8HYGFXAJg"
                target="_blank"
              >
                YouTube
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/plavookac/" target="_blank">
                Linkedin
              </a>
            </li>
          </ul>
        </div>
        <div>fsdgfgdgdf</div>
        fdsfdd
      </div> */}

      {/* <Button onClick={handleRefreshAPi}>refresh</Button>
      <h2>user details</h2>
      <div className="table-container">
        <Button
          style={{
            margin: "0px 7px",
          }}
          variant="primary"
          onClick={() => setModalShow(true)}
        >
          Add data
        </Button>

        <AdminDashboardModel
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>user id</th>
              <th>email</th>
              <th>amount</th>
              <th>admin</th>
            </tr>
          </thead>
          <tbody>
            {table?.map((e, index) => {
              console.log(e);
              return (
                <tr index={index}>
                  <td>{e.uid}</td>
                  <td>{e.email}</td>
                  <td>{e.amount}</td>
                  <td>{`${e.admin} `}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div> */}
    </>
  );
};
