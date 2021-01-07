import styled from "styled-components";

const PopupContainer = styled.div`
  text-align: left;
  width: 100%;
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-diction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingSkeleton = () => {
  return (
    <PopupContainer>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="food-container">
          <div className="food-emoji rotate">🍙</div>
        </div>
        <div className="body">Warming up food ..</div>
      </div>
    </PopupContainer>
  );
};

export default LoadingSkeleton;
