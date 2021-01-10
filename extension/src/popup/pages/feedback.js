import { submitFeedback } from "../../services/apiFactory";

import React, { useState } from "react";
import Star1 from "../../img/star1.svg";
import Star2 from "../../img/star2.svg";
import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";

const Feedback = ({ setInFeedback }) => {
  const [stars, setStars] = useState(1);
  const [feedback, setFeedback] = useState("");

  const submitFeedback = async () => {
    const payload = `${stars}; ${feedback}`;

    chrome.runtime.sendMessage({ type: "submitFeedback", payload });
    setInFeedback(false);
  };

  return (
    <div className="contentContainer">
      <div style={{ width: "100%" }}>
        <div className="h1">How was the call?</div>
        <div className="flex-row">
          {[...Array(5)].map((star, idx) => {
            return (
              <div
                style={{ margin: "3px", cursor: "pointer" }}
                onClick={() => setStars(idx + 1)}
              >
                {idx > stars - 1 ? <img src={Star2} /> : <img src={Star1} />}
              </div>
            );
          })}
        </div>
        <br />
        <div className="body">We'd love any feedback!</div>
        <textarea
          className="textAreaMain"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>
      <button
        className="fullstretchButton primary-button"
        onClick={submitFeedback}
      >
        Submit and complete
      </button>
    </div>
  );
};

export default Feedback;
