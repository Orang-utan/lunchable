import { useState } from "react";
import Feedback from "./Feedback";
import { ButtonSpinner } from "../components/LoadingSpinner";
import { sendAmplitudeData } from "../util/amplitude";

import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";
import "../styles/Main.css";
import "../styles/typography.css";

const EmojiPicker = () => {
  const randNum = (a, b) => {
    return Math.floor(Math.random() * (b - a) + a);
  };
  let num = randNum(0, 3);
  return (
    <div className="food-container">
      <div className="food-emoji rotate">
        {num === 0 ? "🍕" : num === 1 ? "🍔" : num === 2 ? "🌮" : "🍆"}
      </div>
    </div>
  );
};

const Main = ({ pState, setPState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inFeedback, setInFeedback] = useState(false);

  // listener for match found
  chrome.runtime.onMessage.addListener((msg, _, __) => {
    switch (msg.type) {
      case "matchFound":
        setPState(msg.state);
        break;
      default:
        break;
    }
  });

  const logout = () => {
    chrome.runtime.sendMessage({ type: "logout" }, (res) => {
      console.log(res);
      if (res.error) {
        // TODO: handle error
        console.log(res.error);
        return;
      }
      if (!_.isEqual(res.state, pState)) setPState(res.state);
    });
  };

  const startSearch = () => {
    setIsLoading(true);
    sendAmplitudeData("START_MATCHING");
    chrome.runtime.sendMessage({ type: "findMatch" }, (res) => {
      console.log("find match promsie end");
      console.log(res);
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
    sendAmplitudeData("COMPLETE_MATCH");
    chrome.runtime.sendMessage({ type: "completeMatch" }, (res) => {
      if (res.error) {
        // TODO: handle error
        return;
      }
      if (!_.isEqual(res.state, pState)) setPState(res.state);
      setInFeedback(true);
    });
  };

  const joinCall = () => {
    sendAmplitudeData("JOIN_CALL");
    openURL(pState.roomUrl);
  };

  const openURL = (url) => {
    chrome.tabs.create({ active: true, url });
  };

  return inFeedback === true ? (
    <Feedback setInFeedback={setInFeedback} />
  ) : (
    <div className="contentContainer fade-in">
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
            ? `Feel free to close the extension! We'll notify you when it's ready`
            : pState.matchStatus === "matched"
            ? "Yay"
            : null}
        </div>
        {pState.matchStatus === "rest" ? (
          <div style={{ fontSize: "110px" }}>🤔</div>
        ) : pState.matchStatus === "searching" ? (
          <EmojiPicker />
        ) : pState.matchStatus === "matched" ? (
          <div style={{ fontSize: "120px" }}>😎</div>
        ) : null}
      </div>
      <div className="caption">
        <div className="online-circle"></div> Currently {pState.online} users
        are online!
      </div>
      {pState.matchStatus === "rest" ? (
        <button
          className="fullstretchButton primary-button"
          onClick={startSearch}
        >
          Join to eat
          {isLoading && <ButtonSpinner />}
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
          <button
            className="fullstretchButton secondary-button"
            onClick={completeMatch}
          >
            Call Already Ended?
          </button>
        </>
      ) : null}
      {/* <button onClick={logout}>Logout</button> */}
    </div>
  );
};

export default Main;
