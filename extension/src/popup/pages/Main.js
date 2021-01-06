import { useEffect, useState } from "react";
import styled from "styled-components";
import Autosuggest from "react-autosuggest";
import { goTo } from "react-chrome-extension-router";
import { FaSearch } from "react-icons/fa";
import { IconContext } from "react-icons";

import "../styles/typography.css";
import "../styles/color.css";
import "../styles/layout.css";
import "../styles/animation.css";

import "../styles/Main.css";
import { setISOWeekYear } from "date-fns";

const randNum = (a, b) => {
  return Math.floor(Math.random() * (b - a) + a);
};

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
  const [searchState, setSearchState] = useState("rest");

  const [recipient, setRecipient] = useState("");
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const EmojiPicker = () => {
    let num = randNum(0, 3);
    return (
      <div className="food-container">
        <div className="food-emoji rotate">
          {num === 0 ? "🍕" : num === 1 ? "🍔" : num === 2 ? "🌮" : "🍆"}
        </div>
      </div>
    );
  };

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

  const startSearch = (e) => {
    setSearchState("searching");
  };

  const cancelSearch = (e) => {
    setSearchState("rest");
  };

  return (
    <div className="popupContainer">
      <div className="contentContainer">
        <div className="h1">
          {searchState === "rest"
            ? `Ready to eat?`
            : searchState === "searching"
            ? `Searching for friends ...`
            : null}
        </div>
        <div className="body">
          {searchState === "rest"
            ? `Match with your friends`
            : searchState === "searching"
            ? `Hang on tight!`
            : null}
        </div>
        <br />
        {searchState === "searching" ? (
          <EmojiPicker />
        ) : searchState === "matched" ? (
          <div>Matched</div>
        ) : null}
        <br />
        {searchState === "rest" ? (
          <button
            className="fullstretchButton primary-button"
            onClick={(e) => startSearch(e)}
          >
            Join to eat
          </button>
        ) : searchState === "searching" ? (
          <button
            className="fullstretchButton secondary-button"
            onClick={(e) => cancelSearch(e)}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Main;
