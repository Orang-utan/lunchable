import React, { useState, useEffect } from "react";

import "../styles/animation.css";
import "../styles/color.css";
import "../styles/layout.css";

import star1 from "../../img/star1.svg";
import star2 from "../../img/star2.svg";

const Feedback = () => {
  const [stars, setStars] = useState(2);
  const [feedback, setFeedback] = useState("");

  const selectStar = (idx) => {
    console.log("Setting star");
    setStars(idx + 1);
  };

  return (
    <div>
      <div className="h1">How was the call?</div>
      <div className="flex-row">
        {[...Array(5)].map((star, idx) => {
          return (
            <div onClick={() => selectStar(idx)}>
              <img src={idx + 1 > stars ? star2 : star1} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Feedback;
