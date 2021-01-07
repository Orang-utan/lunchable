import React, { useState, useEffect } from "react";

import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";

import star1 from "../../img/star1.svg";
import star2 from "../../img/star2.svg";

const Feedback = () => {
  const [stars, setStars] = useState(1);
  const [feedback, setFeedback] = useState("");

  const selectStar = (idx) => {
    console.log("Setting star");
    setStars(idx + 1);
  };

  return (
    <div className="contentContainer">
      <div>
        <div className="h1">How was the call?</div>
        <div className="flex-row">
          {[...Array(5)].map((star, idx) => {
            return (
              <img
                src={idx + 1 > stars ? star2 : star1}
                style={{ margin: "3px", cursor: "pointer" }}
                onClick={() => setStars(idx + 1)}
              />
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
      <button className="fullstretchButton primary-button">
        Submit and complete
      </button>
    </div>
  );
};

export default Feedback;
