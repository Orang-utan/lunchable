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

const Main = ({ setLoggedIn, searchState, setSearchState }) => {
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

  const logout = () => {
    chrome.runtime.sendMessage({ type: "logout" }, (response) => {
      if (response && response.success) {
        setLoggedIn(false);
        return;
      }
      console.log("Error");
    });
  };

  const startSearch = (e) => {
    setSearchState("searching");
    chrome.runtime.sendMessage({ type: "findMatch" }, (response) => {
      console.log(response);
    });
  };

  const cancelSearch = (e) => {
    setSearchState("rest");
    chrome.runtime.sendMessage({ type: "cancelMatch" }, (response) => {});
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
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Main;
