import React from "react-router-dom";

import SmallSpinner from "../assets/loadingSpinner.svg";
import BigPageSpinner from "../assets/pageSpinner.svg";

const ButtonSpinner = () => {
  return (
    <img
      src={SmallSpinner}
      className="rotate-fast"
      style={{ marginLeft: "8px" }}
      alt="smallSpinner"
    />
  );
};

const PageSpinner = () => {
  return (
    <div style={{ width: "100%", justifyContent: "center", display: "flex" }}>
      <img
        src={BigPageSpinner}
        className="rotate-fastest"
        alt="fullPageSpinner"
      />
    </div>
  );
};

export { ButtonSpinner, PageSpinner };
