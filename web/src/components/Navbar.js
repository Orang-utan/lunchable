import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import Colors from "../common/Colors";
import { AuthContext } from "../context";

import "../styles/color.css";
import "../styles/layout.css";

const NavBarItems = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

function Navbar() {
  const auth = useContext(AuthContext);
  const history = useHistory();

  async function handleLogout() {
    await auth.logout();
  }

  return (
    <nav className="navbar-master" style={{ background: `${Colors.blue}44` }}>
      <div className="nav-container">
        <div>
          <a href="/" className="title is-4">
            🌯 Lunchable
          </a>
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
    </nav>
  );
}

export default Navbar;
