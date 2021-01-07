import React, { useState, useEffect } from "react";

import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";

import Star1 from "../../img/star1.svg";
import Star2 from "../../img/star2.svg";

const Feedback = ({ pState, setPState }) => {
  const [stars, setStars] = useState(1);
  const [feedback, setFeedback] = useState("");

  const submitFeedback = () => {
    let feedbackObj = { stars, feedback };

    // API Call here plz
    setPState({ ...pState, matchStatus: "rest" });
  };

  return (
    <div className="contentContainer">
      <div>
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
