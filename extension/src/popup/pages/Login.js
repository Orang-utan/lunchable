import styled from "styled-components";
import { LOGIN_URL, SIGNUP_URL } from "../../services/config";

const LoginContainer = styled.div`
  text-align: left;
  width: 310px;
  max-height: 290px;
  overflow: scroll;
`;

const ContentContainer = styled.div`
  margin: 20px;
`;

const Headline = styled.p`
  font-size: 20px;
  font-family: "Avenir";
  font-weight: 600;
  margin: 0px;
`;

const InputField = styled.input`
  width: 230px;
  border-radius: 12px;
  color: #797979;
  background-color: #f5f6f8;
  padding: 8px 16px;
  font-family: "Avenir";
  font-weight: 400;
  font-size: 14px;
  border: 3px solid #f5f6f8;
  margin-bottom: 20px;
  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
  &:focus {
    outline: none;
    background: white;
    border: 3px solid #ff8686;
    color: black;
  }
`;

const Paragraph = styled.div`
  font-size: 12px;
  font-family: "Avenir";
  font-weight: 400;
  margin: 10px 0px 15px 0px;
`;

const Button = styled.button`
  font-family: "Avenir";
  border-radius: 10px;
  font-weight: 400;
  background-color: #6593f5;
  margin-top: 1px;
  padding-left: 25px;
  padding-right: 25px;
  margin-right: 10px;
  padding-bottom: 5px;
  padding-top: 5px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  border-style: none;
  text-align: center;
  display: inline-block;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 10px;
    opacity: 0.9;
    background-color: #658feb;
  }
  &:active {
    opacity: 0.6;
  }
`;

const LoginButton = styled.button`
  text-align: center;
  display: inline-block;
  padding: 0.3em 1.2em;
  margin: 0 0.1em 0.1em 0;
  border: 0.16em solid rgba(255, 255, 255, 0);
  border-radius: 20px;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Avenir";
  font-weight: 400;
  color: #ffffff;
  text-shadow: 0 0.04em 0.04em rgba(0, 0, 0, 0.35);
  text-align: center;
  transition: all 0.2s;
  background-color: #4e9af1;
  padding: 7px 30px;
  &:hover {
    cursor: pointer;
    border-color: rgba(255, 255, 255, 1);
  }
`;

const Login = () => {
  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  return (
    <LoginContainer>
      <ContentContainer>
        <Headline>Welcome Back!</Headline>
        <Paragraph>
          Don't have an account yet?{" "}
          <a href="#" onClick={() => openURL(SIGNUP_URL)}>
            Sign Up
          </a>
        </Paragraph>
        <Button onClick={() => openURL(LOGIN_URL)}>Login</Button>
      </ContentContainer>
    </LoginContainer>
  );
};

export default Login;
