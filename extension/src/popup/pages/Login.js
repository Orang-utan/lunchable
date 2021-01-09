import styled from "styled-components";
import { LOGIN_URL, SIGNUP_URL } from "../../services/config";

import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";
import "../styles/Main.css";
import "../styles/typography.css";

const LoginContainer = styled.div`
  text-align: left;
  width: 310px;
  max-height: 290px;
  overflow: scroll;
`;

const Login = () => {
  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  return (
    <LoginContainer>
      <div className="header4">Welcome!</div>
      <div className="body">
        Connect with friends over virtual meals, just like the old days
      </div>
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
    </LoginContainer>
  );
};

export default Login;
