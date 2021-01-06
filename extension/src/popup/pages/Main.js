import { useEffect, useState } from "react";
import styled from "styled-components";
import Autosuggest from "react-autosuggest";
import { goTo } from "react-chrome-extension-router";
import { FaSearch } from "react-icons/fa";
import { IconContext } from "react-icons";

import "../styles/Main.css";

const PopupContainer = styled.div`
  text-align: left;
  width: 310px;
  height: 400px;
  overflow: scroll;
`;

const ContentContainer = styled.div`
  margin: 20px;
`;

const Headline = styled.p`
  font-size: 20px;
  font-family: "Avenir";
  font-weight: 600;
  color: white;
  margin: 5px;
  padding: 0px;
`;

const SearchButton = styled.div`
  margin-left: 143px;
  display: inline-block;

  &:hover {
    cursor: pointer;
  }
`;

const MoreButton = styled.button`
  font-family: "Avenir";
  border-radius: 10px;
  font-weight: 400;
  background-color: #6593f5;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 5px;
  padding-top: 5px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  border-style: none;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
  margin-left: 30%;
  display: inline-block;
  border: 0.16em solid rgba(255, 255, 255, 0);
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 10px;
    opacity: 0.9;
    background-color: #658feb;
    cursor: pointer;
  }
  &:active {
    opacity: 0.6;
  }
`;

const Paragraph = styled.div`
  font-size: 14px;
  font-family: "Avenir";
  font-weight: 500;
  color: white;
  margin: 10px 0px 15px 0px;
`;

const SecondaryButton = styled.button`
  border: none;
  background-color: inherit;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  font-family: "Avenir";
  font-weight: 400;
  color: #ffffff;
  font-size: 12px;
`;

const validateEmail = (email) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

const Tips = [
  "Start typing for suggestions",
  "Hit Enter to send",
  "Hit Esc to hide suggestions",
];
const randomTips = Tips[Math.floor(Math.random() * Tips.length)];

// Component
const Main = ({ setLoggedIn }) => {
  const [recipient, setRecipient] = useState("");
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });
  const [input, setInput] = useState({
    show: false,
  });

  const [myFeed, setMyFeed] = useState();
  const [feedLoading, setFeedLoading] = useState(true);

  const fetchMyFeed = () => {
    setFeedLoading(true);
    const payload = { limit: 5 };
    chrome.runtime.sendMessage({ type: "fetchMyFeed", payload }, (response) => {
      if (response && response.success) {
        setMyFeed(response.links);
        setFeedLoading(false);
        return;
      }
    });
  };

  const fetchCurrentFriend = () => {
    chrome.runtime.sendMessage({ type: "fetchCurrentFriend" }, (response) => {
      if (response && response.success) {
        setFriends(response.friend);
        setSuggestions(response.friend);
        return;
      }
    });
  };

  const handleSend = (email, message) => {
    const query = { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT };

    chrome.tabs.query(query, (tabs) => {
      const linkUrl = tabs[0].url;
      const recipientEmail = email;

      const payload = { linkUrl, recipientEmail, message };

      chrome.runtime.sendMessage({ type: "sendLink", payload }, (response) => {
        if (response && response.success) {
          setToast({ show: true, message: "✅ Your link is sent succesfully" });
          setRecipient("");
          return;
        }
        console.log(response.error);
        setToast({ show: true, message: "😔 Oops. Something went wrong" });
      });
    });
  };

  const logout = () => {
    chrome.runtime.sendMessage({ type: "logout" }, (response) => {
      if (response && response.success) {
        setLoggedIn(false);
        return;
      }
      setToast({ show: true, message: "😔 Oops. Something went wrong" });
    });
  };

  useEffect(() => {
    fetchCurrentFriend();
    fetchMyFeed();
  }, []);

  const handleEnterKey = (e) => {
    // only send when there are no suggestions left
    const separatorIndex = recipient.indexOf(",");
    let email;
    let message;
    if (separatorIndex !== -1) {
      email = recipient.substr(0, separatorIndex).trim();
      message = recipient.substr(separatorIndex + 1).trim();
    } else {
      email = recipient;
    }

    if (e.key === "Enter" && validateEmail(email) && suggestions.length === 0) {
      handleSend(email, message);
    }
    return;
  };

  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  return (
    <PopupContainer>
      <ContentContainer>
        <Headline style={{ display: "inline-block" }}>
          Share this link with
        </Headline>
      </ContentContainer>
    </PopupContainer>
  );
};

export default Main;