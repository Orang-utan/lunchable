import React from "react";
import SmallSpinner from "../../img/loadingSpinner.svg";
import BigPageSpinner from "../../img/pageSpinner.svg";
import "../styles/animation.css";

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
