import styled from "styled-components";
import { LOGIN_URL, SIGNUP_URL } from "../../services/config";

import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";
import "../styles/Main.css";
import "../styles/typography.css";

const Login = () => {
  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  return (
    <div className="contentContainer">
      <div style={{ textAlign: "left" }}>
        <div className="flash" style={{ fontSize: "65px" }}>
          🍝{" "}
        </div>
        <div className="header4">Welcome to Lunchable</div>
        <div className="body">
          Connect with friends over virtual meals, just like the old days
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <button
          className="fullstretchButton primary-button"
          onClick={() => openURL(SIGNUP_URL)}
        >
          Sign up
        </button>
        <button
          className="fullstretchButton secondary-button"
          onClick={() => openURL(LOGIN_URL)}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Login;
