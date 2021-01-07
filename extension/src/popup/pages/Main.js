import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";
import "../styles/Main.css";
import "../styles/typography.css";

import Feedback from "./feedback.js";

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
  // listener for match found
  chrome.runtime.onMessage.addListener((msg, _, __) => {
    switch (msg.type) {
      case "matchFound":
        console.log("hello");
        setPState(msg.state);
        break;
      default:
        break;
    }
  });

  const logout = () => {
    chrome.runtime.sendMessage({ type: "logout" }, (res) => {
      if (res.error) {
        // TODO: handle error
        return;
      }
      if (!_.isEqual(res.state, pState)) setPState(res.state);
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

  return pState.matchStatus === "complete" ? (
    <Feedback pState={pState} setPState={setPState} />
  ) : (
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
        <div>
          <button
            className="fullstretchButton primary-button"
            onClick={joinCall}
          >
            Join call →
          </button>
          <button onClick={completeMatch}>Call Already Ended?</button>
        </div>
      ) : null}
      <button onClick={logout} className="fullstretchButton secondary-button">
        Logout
      </button>
    </div>
  );
};

export default Main;
