import styled from "styled-components";

const LoadingSkeleton = () => {
  const randNum = (a, b) => {
    return Math.floor(Math.random() * (b - a) + a);
  };
  let num = randNum(0, 4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div className="loading-container">
        <div className="food-emoji rotate">
          {num === 0 ? "🍜" : num === 1 ? "🍱" : num === 2 ? "🥪" : "🍔"}
        </div>
      </div>
      <div className="body">
        {num === 0
          ? "Warming up food .."
          : num === 1
          ? "Gathering friends .."
          : num === 2
          ? "Slicing pizza .."
          : "Setting up table .."}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
