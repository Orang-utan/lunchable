import { useEffect, useState } from "react";
import { sendAmplitudeData } from "../util/amplitude";

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

const Main = ({ pState, setPState }) => {
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
        setPState({ ...pState, loggedIn: false });
        return;
      }
      console.log("Error");
    });
  };

  const startSearch = () => {
    setPState({ ...pState, matchStatus: "searching" });
    chrome.runtime.sendMessage({ type: "findMatch" }, (state) => {
      setPState({ ...pState, matchStatus: state.matchStatus });
      console.log(state);
    });
  };

  const cancelSearch = () => {
    setPState({ ...pState, matchStatus: "rest" });
    chrome.runtime.sendMessage({ type: "cancelMatch" }, (response) => {});
  };

  const endCall = () => {
    setPState({ ...pState, matchStatus: "rest" });
    chrome.runtime.sendMessage({ type: "endCall" });
  };

  const joinCall = () => {
    console.log("Joining call");
  };

  return (
    <div className="popupContainer">
      <div className="contentContainer">
        <div className="top-container">
          <div className="h1">
            {pState.matchStatus === "rest"
              ? `Ready to eat?`
              : pState.matchStatus === "searching"
              ? `Searching for friends ...`
              : pState.matchStatus === "matched"
              ? "Matched!"
              : null}
          </div>
          <div className="body">
            {pState.matchStatus === "rest"
              ? `Match with your friends`
              : pState.matchStatus === "searching"
              ? `Hang on tight!`
              : pState.matchStatus === "matched"
              ? "Yay"
              : null}
          </div>
          <br />
          {pState.matchStatus === "rest" ? (
            <div style={{ fontSize: "120px" }}>🤔</div>
          ) : pState.matchStatus === "searching" ? (
            <EmojiPicker />
          ) : pState.matchStatus === "matched" ? (
            <div style={{ fontSize: "120px" }}>😎</div>
          ) : null}
        </div>
        {pState.matchStatus === "rest" ? (
          <button
            className="fullstretchButton primary-button"
            onClick={startSearch}
          >
            Join to eat
          </button>
        ) : pState.matchStatus === "searching" ? (
          <button
            className="fullstretchButton secondary-button"
            onClick={cancelSearch}
          >
            Cancel
          </button>
        ) : pState.matchStatus === "matched" ? (
          <>
            <button
              className="fullstretchButton primary-button"
              onClick={joinCall}
            >
              Join call →
            </button>
            <button onClick={endCall}>Call Already Ended?</button>
          </>
        ) : null}
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Main;
