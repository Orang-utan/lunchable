import React from "react-router-dom";

import SmallSpinner from "../../assets/loadingSpinner.svg";

const ButtonSpinner = () => {
  return (
    <img
      src={SmallSpinner}
      className="rotate-fast"
      style={{ marginLeft: "8px" }}
    />
  );
};

export default ButtonSpinner;
