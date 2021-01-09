import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../context";

import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";
import Circle from "../assets/circle.svg";

const NavBarItems = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

function Navbar() {
  const auth = useContext(AuthContext);

  async function handleLogout() {
    await auth.logout();
  }

  return (
    <div className="nav-master">
      <div className="nav-horizontal-container">
        <div style={{ display: "flex", flexDirection: "row" }}>
          {auth.isAuthenticated ? (
            <>
              <img
                src={Circle}
                alt="logo"
                style={{ height: "70px", marginRight: "12px" }}
              />
              <div>
                <div className="caption">Kevin Zhang</div>
                <div className="header1">
                  <Link to="/">Lunch center</Link>
                </div>
              </div>
            </>
          ) : (
            <div className="header1">
              <Link to="/">Lunchable</Link>
            </div>
          )}
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            {auth.isAuthenticated ? (
              <NavBarItems
                className="navbar-item"
                onClick={() => handleLogout()}
              >
                Logout
              </NavBarItems>
            ) : (
              <React.Fragment>
                <Link to="/login" className="navbar-links">
                  Login
                </Link>
                <Link to="/register" className="navbar-links">
                  Register
                </Link>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      <hr />
      <br />
      <br />
    </div>
  );
}

export default Navbar;
