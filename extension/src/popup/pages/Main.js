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
    chrome.runtime.sendMessage({ type: "logout" }, (res) => {
      if (res.error) {
        // TODO: handle error
        return;
      }
      setPState(res.state);
    });
  };

  const startSearch = () => {
    chrome.runtime.sendMessage({ type: "findMatch" }, (res) => {
      if (res.error) {
        // TODO: handle error
        return;
      }
      if (!_.isEqual(res.state, pState)) setPState(res.state);
    });
  };

  const cancelSearch = () => {
    chrome.runtime.sendMessage({ type: "cancelMatch" }, (res) => {
      if (res.error) {
        // TODO: handle error
        return;
      }
      if (!_.isEqual(res.state, pState)) setPState(res.state);
    });
  };

  const completeMatch = () => {
    chrome.runtime.sendMessage({ type: "completeMatch" }, (res) => {
      if (res.error) {
        // TODO: handle error
        return;
      }
      if (!_.isEqual(res.state, pState)) setPState(res.state);
    });
  };

  const joinCall = () => {
    console.log("Joining call");
    console.log(pState);
    openURL(pState.roomUrl);
  };

  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
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
            <button onClick={completeMatch}>Call Already Ended?</button>
          </>
        ) : null}
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Main;
