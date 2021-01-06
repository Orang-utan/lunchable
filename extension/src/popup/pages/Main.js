import { useEffect, useState } from "react";
import { goTo } from "react-chrome-extension-router";
import { FaSearch } from "react-icons/fa";
import { IconContext } from "react-icons";

import "../styles/typography.css";
import "../styles/color.css";
import "../styles/layout.css";
import "../styles/animation.css";

import "../styles/Main.css";

const randNum = (a, b) => {
  return Math.floor(Math.random() * (b - a) + a);
};

const Main = ({ setLoggedIn, searching }) => {
  console.log(searching);
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
    console.log("searching");
    chrome.runtime.sendMessage({ type: "findmatch" }, (response) => {
      console.log(response);
    });
  };

  const cancelSearch = (e) => {
    setSearchState("rest");
  };

  const joinCall = (e) => {
    console.log("Joining call");
  };

  return (
    <div className="popupContainer">
      <div className="contentContainer">
        <div className="top-container">
          <div className="h1">
            {searchState === "rest"
              ? `Ready to eat?`
              : searchState === "searching"
              ? `Searching for friends ...`
              : searchState === "matched"
              ? "Matched!"
              : null}
          </div>
          <div className="body">
            {searchState === "rest"
              ? `Match with your friends`
              : searchState === "searching"
              ? `Hang on tight!`
              : searchState === "matched"
              ? "Yay"
              : null}
          </div>
          <br />
          {searchState === "rest" ? (
            <div style={{ fontSize: "120px" }}>🤔</div>
          ) : searchState === "searching" ? (
            <EmojiPicker />
          ) : searchState === "matched" ? (
            <div style={{ fontSize: "120px" }}>😎</div>
          ) : null}
        </div>
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
        ) : searchState === "matched" ? (
          <button
            className="fullstretchButton primary-button"
            onClick={(e) => joinCall(e)}
          >
            Join call →
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Main;
