import React, { useState, useEffect } from "react";

import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/animation.css";

const Setting = () => {
  return (
    <div className="dash-container fade-in">
      <div className="title-container">
        <div className="header3">Setting</div>
      </div>
      <div>Usual lunch start time</div>
      <input
        class="input inputContainer inputDefault"
        type="text"
        placeholder="Type in time"
      />
      <div>Duration</div>
      <input
        class="input inputContainer inputDefault"
        type="text"
        placeholder="in minutes"
      />
    </div>
  );
};

export default Setting;
